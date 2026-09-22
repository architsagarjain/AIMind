'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * A capsule stretched between two joints.
 *
 * Posing capsules by nudging Euler angles until they look right never
 * converges — every tweak to one joint invalidates the next. Declaring the two
 * endpoints and solving for the transform is exact, and it means the pose can
 * be read off the source as a skeleton.
 *
 * Derivation. Three.js applies Euler order 'XYZ' as R = Rx·Ry·Rz, so with no
 * Y term a capsule's local +Y maps to:
 *
 *   Rz(z) · (0,1,0)        = (−sin z,  cos z,        0)
 *   Rx(x) · (a, b, 0)      = ( a,      b·cos x,      b·sin x)
 *   ⇒ d = (−sin z, cos z·cos x, cos z·sin x)
 *
 * Inverting for a unit direction d:
 *
 *   z = asin(−d.x)
 *   x = atan2(d.z, d.y)
 */

export interface LimbProps {
  /** Start joint, in the parent group's space. */
  from: [number, number, number];
  /** End joint. */
  to: [number, number, number];
  radius: number;
  material: THREE.Material;
  /** Scales the capsule's cylindrical section — < 1 leaves a rounded gap. */
  taper?: number;
  castShadow?: boolean;
}

export function solveLimb(from: THREE.Vector3Like, to: THREE.Vector3Like) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const length = Math.hypot(dx, dy, dz) || 1e-6;

  const nx = dx / length;
  const ny = dy / length;
  const nz = dz / length;

  return {
    position: [(from.x + to.x) / 2, (from.y + to.y) / 2, (from.z + to.z) / 2] as [
      number,
      number,
      number,
    ],
    // Clamped because floating-point drift can push nx a hair past ±1.
    rotation: [Math.atan2(nz, ny), 0, Math.asin(THREE.MathUtils.clamp(-nx, -1, 1))] as [
      number,
      number,
      number,
    ],
    length,
  };
}

export function Limb({ from, to, radius, material, taper = 1, castShadow }: LimbProps) {
  const { position, rotation, length } = useMemo(
    () => solveLimb({ x: from[0], y: from[1], z: from[2] }, { x: to[0], y: to[1], z: to[2] }),
    [from, to],
  );

  // CapsuleGeometry's first arg is the radius and the second the *cylinder*
  // height, so the hemispherical caps have to come off the joint distance or
  // every limb overshoots by one diameter.
  const cylinder = Math.max(0.001, (length - radius * 2) * taper);

  return (
    <mesh position={position} rotation={rotation} material={material} castShadow={castShadow}>
      <capsuleGeometry args={[radius, cylinder, 6, 16]} />
    </mesh>
  );
}
