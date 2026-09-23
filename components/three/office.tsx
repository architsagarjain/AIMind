'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Chair } from './chair';
import { Desk } from './desk';
import { Books, Mug, Plant } from './desk-props';
import { useNightEnvironment } from './night-environment';
import { Skyline } from './skyline';
import { Whiteboard } from './whiteboard';

/**
 * The dark office set.
 *
 * Layout, in world units (the avatar sits at x≈0.75, facing +z toward camera):
 *   x < 0      whiteboard wall, behind and to the subject's right
 *   x ≈ 0.75   subject + chair
 *   x ≈ 2.6    desk, running off the right edge of frame
 *   z ≈ -4.2   floor-to-ceiling glass; the floor stops here, and the city
 *              (skyline.tsx) falls away below it
 *
 * The laptop itself is a loaded model; see `laptop.tsx`, which also owns the
 * camera rig's target constants. The desk, chair and desk props are
 * procedural and live in their own files; they share a reflection map built
 * here.
 */

interface OfficeProps {
  /** Normalised pointer, -1..1, y down. Drives the skyline's interaction. */
  pointer: React.RefObject<{ x: number; y: number }>;
  still?: boolean;
}

export function Office({ pointer, still = false }: OfficeProps) {
  const env = useNightEnvironment();

  const materials = useMemo(
    () => ({
      floor: new THREE.MeshStandardMaterial({ color: '#0a0b14', roughness: 0.72, metalness: 0.25 }),
      wall: new THREE.MeshStandardMaterial({ color: '#0c0e1a', roughness: 0.95 }),
      metal: new THREE.MeshStandardMaterial({ color: '#9aa0ab', roughness: 0.3, metalness: 0.85 }),
      // Anodised aluminium: low roughness + high metalness is what separates a
      // MacBook read from a generic grey slab.
      metalDark: new THREE.MeshStandardMaterial({ color: '#4a4f58', roughness: 0.4, metalness: 0.7 }),
      glass: new THREE.MeshStandardMaterial({
        color: '#060c18',
        roughness: 0.06,
        metalness: 0.5,
        transparent: true,
        // Lighter than it was: behind it is now a lit city worth seeing.
        opacity: 0.28,
      }),
    }),
    [],
  );

  return (
    <group>
      {/* --------------------------------------------------------------- shell */}
      {/* Ends at the glass (z = -4.2) rather than running under the city. */}
      <mesh
        position={[0, 0, 6.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.floor}
      >
        <planeGeometry args={[36, 22]} />
      </mesh>

      {/* Side wall on the subject's right, carrying the glass board */}
      <group position={[-3.1, 1.65, -1.85]} rotation={[0, 0.5, 0]}>
        <mesh material={materials.wall}>
          <planeGeometry args={[9, 7]} />
        </mesh>
        {/* Where the strokes used to be; see whiteboard.tsx. */}
        <group position={[0, 0.62, 0.03]}>
          <Whiteboard env={env} />
        </group>
      </group>

      {/* ------------------------------------------------------- window + city */}
      <group position={[1.4, 2.0, -4.2]}>
        <mesh material={materials.glass}>
          <planeGeometry args={[13, 5.8]} />
        </mesh>
        {[-4.2, 0.6, 5.2].map((x) => (
          <mesh key={x} position={[x, 0, 0.03]} material={materials.metalDark}>
            <boxGeometry args={[0.06, 5.8, 0.06]} />
          </mesh>
        ))}
        <mesh position={[0, -0.6, 0.03]} material={materials.metalDark}>
          <boxGeometry args={[13, 0.06, 0.06]} />
        </mesh>
      </group>

      <Skyline pointer={pointer} still={still} />

      {/* Room shell around the glass. With a black clear colour the set could
          stop at the window's edges; with a sky behind it, the gap past the
          right end and above the head showed straight out of the building. */}
      <mesh position={[7.9, 3, 1.8]} rotation={[0, -Math.PI / 2, 0]} material={materials.wall}>
        <planeGeometry args={[12, 6]} />
      </mesh>
      <mesh position={[1.4, 7, -4.2]} material={materials.wall}>
        <planeGeometry args={[16, 4.2]} />
      </mesh>

      {/* ---------------------------------------------------------------- desk */}
      <group position={[2.6, 0, -0.35]}>
        <Desk env={env} />
      </group>

      {/* ------------------------------------------------------------- props */}
      {/* Same spots as before; each prop's origin is its footprint on the top. */}
      <group position={[2.78, 0.775, 0.16]}>
        <Mug env={env} still={still} />
      </group>
      <group position={[3.12, 0.775, -0.34]} rotation={[0, -0.12, 0]}>
        <Books env={env} />
      </group>
      <group position={[3.62, 0.775, 0.3]}>
        <Plant env={env} />
      </group>

      {/* --------------------------------------------------------------- chair */}
      {/* Behind the desk, turned toward him, as if he has just stepped round
          from it.
          - It must stay clear of the desk's footprint (x 0.9–4.3, z -0.95–0.25).
            The chair used to stand inside it, with its back rising straight
            through the top; the nearest part, an armrest, now clears the far
            edge by ~14cm.
          - x is set by the hero framing: at 1.42 it hid entirely behind the
            subject, and much past 1.7 the back rises behind the laptop screen,
            which is the camera's dive target. 1.6 lands it in the gap between
            his arm and the laptop.
          - The mesh back keeps it from reading as a dark mass. */}
      <group position={[1.6, 0, -1.38]} rotation={[0, -0.55, 0]}>
        <Chair env={env} />
      </group>

      {/* -------------------------------------------------------------- lights */}
      {/* The set is lit as a night interior: a cool ambient base, a soft key on
          the face, a cyan rim for separation, and warm practicals. */}
      <ambientLight intensity={0.95} color="#8496b8" />
      <hemisphereLight args={['#3d548a', '#0d0f1a', 1.0]} />

      {/* Key — front-left of the subject, soft and cool */}
      <spotLight
        position={[-1.6, 3.2, 3.2]}
        target-position={[0.78, 1.3, 0.35]}
        angle={0.7}
        penumbra={1}
        intensity={30}
        color="#d7e6ff"
        distance={12}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />

      {/* Cyan rim from behind-left — the signature separation light */}
      <pointLight position={[-1.2, 1.9, -1.0]} intensity={22} color="#6ef2ff" distance={8} decay={2} />

      {/* Second rim, camera-right, so the far shoulder catches an edge */}
      <pointLight position={[3.0, 2.0, 1.2]} intensity={9} color="#8fd0ff" distance={7} decay={2} />

      {/* Warm practical over the desk.
          Raised and pulled back from where it was (2.65, 1.2, 0.8): that sat
          0.74 from the mug and put ~18 units of light on it against ~2.6 on
          the subject's face, which blew out every prop on the desk. Here the
          mug gets ~4 and the face stays within ~5% of what it had. */}
      <pointLight position={[2.55, 1.95, 1.35]} intensity={11} color="#ffb070" distance={4.6} decay={2} />

      {/* Low warm bounce on the desk itself. Kept short-range: at a longer
          distance it washed the charcoal suit brown. */}
      <pointLight position={[2.2, 0.72, 1.0]} intensity={3.5} color="#ff9e5e" distance={2.8} decay={2} />

      {/* Subject fill, camera-left and close.
          Without it the hoodie sits at the same value as the background and
          the whole figure collapses into a silhouette — the face reads but the
          body does not. Kept dim and cool so it lifts form without flattening
          the night-interior grade. */}
      <pointLight position={[-0.6, 1.75, 2.5]} intensity={12} color="#c3d6f5" distance={7.5} decay={2} />
      <pointLight position={[0.35, 0.5, 2.1]} intensity={6} color="#a8bde3" distance={5} decay={2} />

      {/* Cool wash from the window behind */}
      <directionalLight position={[1.5, 4, -5]} intensity={0.7} color="#7ea4ff" />
    </group>
  );
}
