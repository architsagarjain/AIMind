'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { applyTextureQuality } from './texture-quality';

/**
 * The hero character, loaded from `public/models/archit.glb`.
 *
 * The model is rigged by `scripts/rig-character.mjs`, which fits a 19-bone
 * humanoid skeleton to the scan and solves skin weights — the source export
 * carries no skeleton of its own. So this drives *bones*, not the root
 * transform: the head turns toward the cursor on its own neck, the chest
 * breathes, and the arms carry a little sway.
 *
 * WHAT THE RIG WILL AND WILL NOT DO
 * Head, neck, spine and arms deform cleanly — the source is a relaxed A-pose
 * with real air gaps between the arms and the torso, which is what makes the
 * weights separable. Seating does not: bending hips and knees toward 90°
 * pinches the tailored trousers at both joints, because envelope weights have
 * no notion of how fabric folds. The figure therefore stands.
 */

const MODEL_URL = '/models/archit.glb';

/** Mesh bounds are centred on the origin, so the feet sit this far below it. */
const FOOT_OFFSET = 0.9513;
/** Scales the ~1.9-unit mesh to a plausible standing height in scene metres. */
const SCALE = 0.95;

/** How far the head may turn, in radians. Past this the neck visibly shears. */
const HEAD_YAW = 0.34;
const HEAD_PITCH = 0.16;
/** The neck takes a share of the turn so the motion originates below the jaw. */
const NECK_SHARE = 0.35;

/**
 * Rest-pose corrections, in radians.
 *
 * The source model stands in a relaxed A-pose with the arms held out. That
 * spread is what makes the mesh riggable at all — it is the air gap the weight
 * solver needs — but it reads as a scanning pose rather than a person standing.
 * Now that there is a skeleton, the arms can simply be brought down to a
 * natural rest and the elbows given a slight break.
 *
 * This is the payoff of rigging that a static mesh could not offer: the pose
 * the model ships in no longer has to be the pose on screen.
 */
const REST = {
  upperArmL: { x: 0.02, z: 0.2 },
  upperArmR: { x: 0.02, z: -0.2 },
  lowerArmL: { x: 0.1, z: 0.07 },
  lowerArmR: { x: 0.1, z: -0.07 },
} as const;

interface AvatarModelProps {
  /** Normalised pointer, -1..1 on both axes. */
  pointer: React.RefObject<{ x: number; y: number }>;
  /** Freezes idle motion for prefers-reduced-motion. */
  still?: boolean;
  position?: [number, number, number];
  /** Base heading, before the pointer offset is added. */
  rotationY?: number;
}

/**
 * Frame-rate-independent damping factor.
 *
 * `delta * rate` is an interpolation *factor*, not a rate: on a stalled frame
 * it exceeds 1 and the lerp diverges instead of converging. Exponential decay
 * is always in [0, 1), so it cannot overshoot.
 */
const damp = (rate: number, delta: number) => 1 - Math.exp(-rate * Math.min(delta, 0.1));

type BoneName =
  | 'head'
  | 'neck'
  | 'chest'
  | 'spine'
  | 'upperArmL'
  | 'upperArmR'
  | 'lowerArmL'
  | 'lowerArmR';

type Rig = Partial<Record<BoneName, THREE.Bone>>;

export function AvatarModel({
  pointer,
  still = false,
  position = [0.72, 0, 0.62],
  rotationY = -0.22,
}: AvatarModelProps) {
  const root = useRef<THREE.Group>(null);
  const rig = useRef<Rig>({});
  const { scene } = useGLTF(MODEL_URL);
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  // SkeletonUtils.clone, not Object3D.clone: the latter copies a SkinnedMesh
  // but leaves it bound to the *original* skeleton, so every instance would
  // deform in lockstep with whichever one moved last.
  const model = useMemo(() => cloneSkinned(scene), [scene]);

  useEffect(() => {
    const bones: Rig = {};
    model.traverse((o) => {
      if ((o as THREE.Bone).isBone) bones[o.name as keyof Rig] = o as THREE.Bone;
      if (!(o instanceof THREE.Mesh)) return;
      o.castShadow = true;
      o.receiveShadow = true;
      // A skinned mesh's bounds move with the pose; culling on the bind-pose
      // box pops the figure out of frame mid-turn.
      o.frustumCulled = false;

      const material = o.material as THREE.MeshStandardMaterial;
      if (!material) return;
      // The export sets metallicFactor 1, which makes the whole figure mirror
      // a near-black room and read as a silhouette. The map still drives
      // per-texel variation; this stops the flat multiplier crushing it.
      material.metalness = 0.15;
      material.roughness = Math.min(1, material.roughness * 0.9 + 0.35);
      material.envMapIntensity = 0.6;
      material.needsUpdate = true;
    });
    applyTextureQuality(model, maxAnisotropy);

    // Apply the rest-pose correction once, at bind time.
    for (const [name, r] of Object.entries(REST)) {
      const bone = bones[name as BoneName];
      if (bone) bone.rotation.set(r.x, 0, r.z);
    }
    rig.current = bones;
  }, [model, maxAnisotropy]);

  useFrame((state, delta) => {
    if (still) return;
    const t = state.clock.elapsedTime;
    const { head, neck, chest, spine, upperArmL, upperArmR } = rig.current;
    const k = damp(3.2, delta);

    // --- Head: follow the pointer, split across neck and head ---------------
    const px = THREE.MathUtils.clamp(pointer.current?.x ?? 0, -1, 1);
    const py = THREE.MathUtils.clamp(pointer.current?.y ?? 0, -1, 1);
    const yaw = px * HEAD_YAW + Math.sin(t * 0.31) * 0.03;
    const pitch = py * HEAD_PITCH + Math.sin(t * 0.43) * 0.015;

    if (head) {
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, yaw * (1 - NECK_SHARE), k);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, pitch * (1 - NECK_SHARE), k);
      head.rotation.z = THREE.MathUtils.lerp(head.rotation.z, -px * 0.05, k);
    }
    if (neck) {
      neck.rotation.y = THREE.MathUtils.lerp(neck.rotation.y, yaw * NECK_SHARE, k);
      neck.rotation.x = THREE.MathUtils.lerp(neck.rotation.x, pitch * NECK_SHARE, k);
    }

    // --- Breath: a small chest rise, carried a little by the spine ----------
    const breath = Math.sin(t * 0.8);
    if (chest) chest.rotation.x = -breath * 0.012;
    if (spine) spine.rotation.x = -breath * 0.006 + Math.sin(t * 0.17) * 0.008;

    // --- Arms: a touch of sway, added to the rest pose rather than replacing
    //     it — assigning the rotation outright would snap the arms back out.
    if (upperArmL) upperArmL.rotation.z = REST.upperArmL.z + Math.sin(t * 0.37) * 0.02;
    if (upperArmR) upperArmR.rotation.z = REST.upperArmR.z - Math.sin(t * 0.41) * 0.02;

    // --- Weight shift --------------------------------------------------------
    if (root.current) {
      root.current.position.x = position[0] + Math.sin(t * 0.23) * 0.01;
      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        rotationY + px * 0.05,
        damp(1.6, delta),
      );
    }
  });

  return (
    <group ref={root} position={position} rotation={[0, rotationY, 0]}>
      {/* Static placement: scale to height, then lift so the feet reach y=0.
          Kept free of animation — assigning `scale`/`position` on this group
          would overwrite the placement rather than add to it. */}
      <group scale={SCALE} position={[0, FOOT_OFFSET * SCALE, 0]}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
