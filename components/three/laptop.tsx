'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MODEL_URLS } from '@/lib/model-manifest';
import { applyTextureQuality } from './texture-quality';
import { createStandbyTexture } from './standby-texture';

/**
 * The MacBook on the desk, loaded from `public/models/macbook.glb`.
 *
 * This is the scroll cinematic's destination: the camera flies into the screen
 * and the boot sequence takes over. `LAPTOP_SCREEN` and `LAPTOP_NORMAL` below
 * are what the rig aims at, and they are *derived* from the placement
 * constants rather than written down — an earlier hand-computed literal
 * silently drifted when the geometry changed and the camera flew to where the
 * screen used to be.
 *
 * The screen shows ARCHIT.OS on standby, drawn live at runtime (see
 * standby-texture.ts). The GLB carries a plain image baked by
 * `scripts/optimize-laptop.mjs`, used only until that first draw.
 */

/**
 * Emissive strength for the standby screen. It is mostly dark with bright
 * cyan detail, so it needs far more than a light screen did (0.62) to read
 * as lit; much past this the cyan clips to white under ACES.
 */
const SCREEN_GLOW = 1.5;

/** Content-hashed; see scripts/write-model-manifest.mjs. */
const MODEL_URL = MODEL_URLS.macbook;

/** The model is authored in centimetres; the scene is in metres. */
const CM = 0.01;
/**
 * Art-direction scale on top of the unit conversion.
 *
 * At true size a 16" MacBook is 35cm across, which is correct next to a 1.8m
 * figure but reads as a toy against this desk — the desk is a deliberately
 * long 3.4-unit slab, so the laptop loses the frame. A modest upscale gives it
 * presence without making the room feel like a dollhouse.
 */
const PRESENCE = 1.45;
const MODEL_SCALE = CM * PRESENCE;

/**
 * Screen plane in model space, measured off the source GLB — the bounding-box
 * centre and average vertex normal of the one mesh carrying an emissive
 * texture. Re-measure if the model is ever replaced.
 */
const SCREEN_LOCAL = new THREE.Vector3(0, 11.749, -16.957).multiplyScalar(MODEL_SCALE);
const SCREEN_NORMAL_LOCAL = new THREE.Vector3(0, 0.3421, 0.9394).normalize();

/** Placement on the desk. Model min-y is -1.07cm, so it is lifted to sit flat. */
const POSITION = new THREE.Vector3(1.92, 0.775 + 1.07 * MODEL_SCALE, 0.04);
const ROTATION_Y = -0.42;

const PLACEMENT = new THREE.Matrix4()
  .makeRotationY(ROTATION_Y)
  .premultiply(new THREE.Matrix4().makeTranslation(POSITION));

/** World-space centre of the screen — the camera rig's destination. */
export const LAPTOP_SCREEN = SCREEN_LOCAL.clone().applyMatrix4(PLACEMENT);

/** Unit normal the screen faces, used to park the camera just off its surface. */
export const LAPTOP_NORMAL = SCREEN_NORMAL_LOCAL.clone()
  .transformDirection(PLACEMENT)
  .normalize();

export function Laptop({ still = false }: { still?: boolean }) {
  const glow = useRef<THREE.PointLight>(null);
  const { scene } = useGLTF(MODEL_URL);
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  // Clone so the cached GLTF is never mutated by material tweaks below.
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const standby = createStandbyTexture();
    model.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.castShadow = true;
      o.receiveShadow = true;

      const material = o.material as THREE.MeshStandardMaterial;
      if (!material) return;
      // The screen is the only emissive surface. It gets the live standby screen,
      // on a clone so the cached GLTF material is left as loaded.
      if (material.emissiveIntensity > 0 && material.emissiveMap) {
        const screen = material.clone();
        screen.emissiveMap = standby.texture;
        screen.emissiveIntensity = SCREEN_GLOW;
        o.material = screen;
        return;
      }
      // Calm the aluminium, which otherwise mirrors a near-black room and goes flat.
      material.envMapIntensity = 0.7;
    });
    applyTextureQuality(model, maxAnisotropy);
    return () => standby.dispose();
  }, [model, maxAnisotropy]);

  useFrame((state) => {
    if (still || !glow.current) return;
    const t = state.clock.elapsedTime;
    // A real panel is never perfectly steady.
    glow.current.intensity = 2.6 + Math.sin(t * 2.3) * 0.16 + Math.sin(t * 7.1) * 0.07;
  });

  return (
    <group position={POSITION} rotation={[0, ROTATION_Y, 0]}>
      <group scale={MODEL_SCALE}>
        <primitive object={model} />
      </group>

      {/* Screen spill.
          Parked well forward of the panel: closer in, its own reflection washes
          across the UI at exactly the moment the camera arrives on it. */}
      <pointLight
        ref={glow}
        position={SCREEN_LOCAL.clone().addScaledVector(SCREEN_NORMAL_LOCAL, 1.15)}
        // The standby screen is night blue with cyan detail.
        color="#8fd8ff"
        intensity={2.6}
        distance={3.6}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
