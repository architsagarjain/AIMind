'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * The hero character, loaded from `public/models/archit.glb`.
 *
 * WHAT THE FILE SUPPORTS
 * The supplied model is a single static mesh: no skin, no skeleton, no
 * animations and no morph targets. That rules out three things the procedural
 * character could do:
 *
 *   - sitting        — no rig, so the legs cannot be bent into a chair pose
 *   - blinking       — no `eyeBlink*` morph targets to drive
 *   - head tracking  — no head bone to rotate independently of the body
 *
 * So the idle here moves the whole figure rather than parts of it: a breath
 * that scales the body a fraction, a slow weight shift, and a gentle turn
 * toward the pointer. Applied to the root that reads as presence; applied to a
 * limb it would read as broken.
 *
 * Replacing this with a rigged model is a contained change: keep the wrapper,
 * drive bones and morph targets in `useFrame` instead of the root transform.
 */

const MODEL_URL = '/models/archit.glb';

/** Mesh bounds are centred on the origin, so the feet sit this far below it. */
const FOOT_OFFSET = 0.9514;
/** Scales the ~1.9-unit mesh to a plausible standing height in scene metres. */
const SCALE = 0.95;

interface AvatarModelProps {
  /** Normalised pointer, -1..1 on both axes. */
  pointer: React.RefObject<{ x: number; y: number }>;
  /** Freezes idle motion for prefers-reduced-motion. */
  still?: boolean;
  position?: [number, number, number];
  /** Base heading, before the pointer offset is added. */
  rotationY?: number;
}

export function AvatarModel({
  pointer,
  still = false,
  position = [0.72, 0, 0.62],
  rotationY = -0.22,
}: AvatarModelProps) {
  const root = useRef<THREE.Group>(null);
  /** Animated separately from the static placement group below it. */
  const breathe = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  // Clone so the cached GLTF is never mutated — a second mount would otherwise
  // inherit whatever the first one did to the materials.
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.castShadow = true;
      o.receiveShadow = true;
      o.frustumCulled = false;

      const material = o.material as THREE.MeshStandardMaterial;
      if (!material) return;
      // Meshy exports metallicFactor 1, which makes the whole figure mirror the
      // (near-black) environment and read as a silhouette. The map still drives
      // per-texel variation; this just stops the flat multiplier crushing it.
      material.metalness = 0.15;
      material.roughness = Math.min(1, material.roughness * 0.9 + 0.35);
      material.envMapIntensity = 0.6;
      material.needsUpdate = true;
    });
  }, [model]);

  useFrame((state, delta) => {
    if (still) return;
    const t = state.clock.elapsedTime;

    if (breathe.current) {
      // Breath: a fraction of a percent, mostly vertical.
      //
      // This writes to its own group rather than the one carrying the scale and
      // foot offset. Assigning `scale`/`position` on that group would overwrite
      // the placement instead of adding to it — which sank the figure 0.9 units
      // into the floor, leaving only the head and torso above it.
      const breath = Math.sin(t * 0.8);
      breathe.current.scale.set(1 + breath * 0.004, 1 + breath * 0.006, 1 + breath * 0.004);
      breathe.current.position.y = breath * 0.008;
    }

    if (root.current) {
      const px = pointer.current?.x ?? 0;
      const py = pointer.current?.y ?? 0;

      // Turn toward the pointer. Small: a static mesh rotating far enough to
      // notice reads as the whole body swivelling, which it is.
      const targetY = rotationY + px * 0.1 + Math.sin(t * 0.19) * 0.022;
      const targetX = -py * 0.018 + Math.sin(t * 0.27) * 0.008;

      // Exponential damping — frame-rate independent and cannot overshoot,
      // unlike a `delta * rate` factor on a stalled frame.
      const k = 1 - Math.exp(-2 * Math.min(delta, 0.1));
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, targetY, k);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, targetX, k);
      // Weight shift, so the stance is not perfectly locked.
      root.current.position.x = position[0] + Math.sin(t * 0.23) * 0.012;
    }
  });

  return (
    <group ref={root} position={position} rotation={[0, rotationY, 0]}>
      <group ref={breathe}>
        {/* Static placement: scale to height, then lift so the feet reach y=0. */}
        <group scale={SCALE} position={[0, FOOT_OFFSET * SCALE, 0]}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
