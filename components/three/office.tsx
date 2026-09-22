'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The dark office set.
 *
 * Layout, in world units (the avatar sits at x≈0.75, facing +z toward camera):
 *   x < 0      whiteboard wall, behind and to the subject's right
 *   x ≈ 0.75   subject + chair
 *   x ≈ 2.6    desk, running off the right edge of frame
 *   z ≈ -4.2   window wall and the city beyond it
 *
 * LAPTOP_SCREEN below is the camera rig's destination, derived from the laptop
 * group's nested transforms — if the laptop moves, that constant moves with it.
 */

/** World-space centre of the laptop screen, and the direction it faces. */
export const LAPTOP_SCREEN = new THREE.Vector3(1.905, 1.049, -0.255);
export const LAPTOP_NORMAL = new THREE.Vector3(0.505, 0.257, 0.823).normalize();

export function Office({ still = false }: { still?: boolean }) {
  const screenGlow = useRef<THREE.PointLight>(null);
  const cityRef = useRef<THREE.Points>(null);

  const materials = useMemo(
    () => ({
      floor: new THREE.MeshStandardMaterial({ color: '#0a0b14', roughness: 0.72, metalness: 0.25 }),
      wall: new THREE.MeshStandardMaterial({ color: '#0c0e1a', roughness: 0.95 }),
      desk: new THREE.MeshStandardMaterial({ color: '#4a3527', roughness: 0.5, metalness: 0.08 }),
      metal: new THREE.MeshStandardMaterial({ color: '#9aa0ab', roughness: 0.3, metalness: 0.85 }),
      metalDark: new THREE.MeshStandardMaterial({ color: '#4a4f58', roughness: 0.4, metalness: 0.7 }),
      chair: new THREE.MeshStandardMaterial({ color: '#16161f', roughness: 0.75 }),
      screen: new THREE.MeshStandardMaterial({
        color: '#08121f',
        emissive: '#0d2740',
        emissiveIntensity: 1,
        roughness: 0.2,
      }),
      screenUi: new THREE.MeshStandardMaterial({
        color: '#000000',
        emissive: '#6ef2ff',
        emissiveIntensity: 1.6,
        roughness: 0.4,
      }),
      mug: new THREE.MeshStandardMaterial({ color: '#15151d', roughness: 0.5 }),
      book: new THREE.MeshStandardMaterial({ color: '#1c1c26', roughness: 0.88 }),
      leaf: new THREE.MeshStandardMaterial({ color: '#254a37', roughness: 0.75 }),
      glass: new THREE.MeshStandardMaterial({
        color: '#060c18',
        roughness: 0.06,
        metalness: 0.5,
        transparent: true,
        opacity: 0.4,
      }),
      chalk: new THREE.MeshStandardMaterial({
        color: '#000000',
        emissive: '#8fd8ff',
        emissiveIntensity: 0.5,
      }),
    }),
    [],
  );

  /** City skyline: emissive points scattered across a far plane. */
  const city = useMemo(() => {
    const count = 1100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const warm = new THREE.Color('#ffd7a0');
    const cool = new THREE.Color('#6ef2ff');

    for (let i = 0; i < count; i += 1) {
      // Weighted low so it reads as a skyline rather than a starfield.
      const x = (Math.random() - 0.5) * 26 + 1;
      const y = Math.pow(Math.random(), 2.3) * 3.2 - 0.1;
      const z = -6.5 - Math.random() * 7;
      positions.set([x, y, z], i * 3);

      const c = warm.clone().lerp(cool, Math.random() * 0.5);
      colors.set([c.r, c.g, c.b], i * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (still) return;
    const t = state.clock.elapsedTime;
    if (screenGlow.current) {
      screenGlow.current.intensity = 1.5 + Math.sin(t * 2.3) * 0.12 + Math.sin(t * 7.1) * 0.05;
    }
    if (cityRef.current) {
      const material = cityRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.78 + Math.sin(t * 0.6) * 0.07;
    }
  });

  return (
    <group>
      {/* --------------------------------------------------------------- shell */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={materials.floor}>
        <planeGeometry args={[36, 36]} />
      </mesh>

      {/* Whiteboard wall on the subject's right, carrying the handwriting glow */}
      <group position={[-3.1, 1.65, -1.85]} rotation={[0, 0.5, 0]}>
        <mesh material={materials.wall}>
          <planeGeometry args={[9, 7]} />
        </mesh>
        {/* Abstract "handwriting" — short emissive strokes, legible as writing
            at hero distance without needing a texture. */}
        {[
          [-1.2, 1.1, 1.5],
          [-1.1, 0.82, 1.15],
          [-1.25, 0.54, 1.35],
          [-1.15, 0.26, 0.95],
          [1.05, 0.95, 1.1],
          [1.15, 0.67, 1.45],
          [0.95, 0.39, 0.85],
        ].map(([x, y, w], i) => (
          <mesh key={i} position={[x!, y!, 0.02]} rotation={[0, 0, -0.04]} material={materials.chalk}>
            <boxGeometry args={[w!, 0.035, 0.005]} />
          </mesh>
        ))}
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

      <points ref={cityRef} geometry={city}>
        <pointsMaterial
          size={0.06}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.82}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Distant ridgeline so the skyline has a horizon */}
      <mesh position={[-1, 0.3, -12]} rotation={[0, 0.6, 0]} material={materials.wall}>
        <coneGeometry args={[7, 2.6, 4]} />
      </mesh>
      <mesh position={[5, 0.2, -13]} rotation={[0, 0.3, 0]} material={materials.wall}>
        <coneGeometry args={[6, 2, 4]} />
      </mesh>

      {/* ---------------------------------------------------------------- desk */}
      <group position={[2.6, 0, -0.35]}>
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow material={materials.desk}>
          <boxGeometry args={[3.4, 0.07, 1.2]} />
        </mesh>
        {[
          [-1.55, 0.48],
          [1.55, 0.48],
          [-1.55, -0.48],
          [1.55, -0.48],
        ].map(([x, z]) => (
          <mesh key={`${x}-${z}`} position={[x!, 0.355, z!]} material={materials.metalDark}>
            <boxGeometry args={[0.055, 0.71, 0.055]} />
          </mesh>
        ))}
      </group>

      {/* -------------------------------------------------------------- laptop */}
      {/* Rotated to face back toward the subject — LAPTOP_SCREEN is derived
          from exactly these transforms. */}
      <group position={[2.0, 0.775, -0.1]} rotation={[0, 0.55, 0]}>
        <mesh position={[0, 0.008, 0.18]} castShadow material={materials.metal}>
          <boxGeometry args={[0.8, 0.018, 0.56]} />
        </mesh>
        <mesh position={[0, 0.019, 0.22]} material={materials.chair}>
          <boxGeometry args={[0.64, 0.004, 0.32]} />
        </mesh>

        <group position={[0, 0.016, -0.12]} rotation={[-0.26, 0, 0]}>
          {/* Lid */}
          <mesh position={[0, 0.27, -0.006]} castShadow material={materials.metal}>
            <boxGeometry args={[0.8, 0.55, 0.014]} />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 0.27, 0.008]} material={materials.screen}>
            <planeGeometry args={[0.73, 0.48]} />
          </mesh>
          {/* Faint UI on the screen, so the dive lands on something, not a void */}
          <group position={[0, 0.27, 0.011]}>
            <mesh position={[0, 0.2, 0]} material={materials.screenUi}>
              <planeGeometry args={[0.69, 0.018]} />
            </mesh>
            {[0.12, 0.06, 0, -0.06].map((y, i) => (
              <mesh key={y} position={[-0.14 - i * 0.02, y, 0]} material={materials.screenUi}>
                <planeGeometry args={[0.38 - i * 0.05, 0.012]} />
              </mesh>
            ))}
            <mesh position={[0.22, 0.02, 0]} material={materials.screenUi}>
              <planeGeometry args={[0.2, 0.16]} />
            </mesh>
          </group>

          <pointLight
            ref={screenGlow}
            position={[0, 0.27, 0.5]}
            color="#6ef2ff"
            intensity={1.5}
            distance={3.2}
            decay={2}
          />
        </group>
      </group>

      {/* ----------------------------------------------------------------- mug */}
      <group position={[3.1, 0.775, 0.02]}>
        <mesh material={materials.mug} castShadow>
          <cylinderGeometry args={[0.078, 0.064, 0.145, 20]} />
        </mesh>
        <mesh position={[0.095, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.mug}>
          <torusGeometry args={[0.042, 0.011, 8, 16]} />
        </mesh>
      </group>

      {/* --------------------------------------------------------------- books */}
      <group position={[3.75, 0.775, -0.4]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[0, 0.027 + i * 0.052, 0]}
            rotation={[0, i * 0.06 - 0.12, 0]}
            material={materials.book}
            castShadow
          >
            <boxGeometry args={[0.48, 0.048, 0.33]} />
          </mesh>
        ))}
      </group>

      {/* --------------------------------------------------------------- plant */}
      <group position={[4.2, 0.775, 0.15]}>
        <mesh material={materials.mug}>
          <cylinderGeometry args={[0.11, 0.08, 0.19, 14]} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.1, 0.22 + (i % 3) * 0.08, Math.sin(a) * 0.1]}
              rotation={[Math.cos(a) * 0.45, a, Math.sin(a) * 0.45]}
              material={materials.leaf}
              scale={[1, 2.6, 0.35]}
            >
              <sphereGeometry args={[0.075, 8, 6]} />
            </mesh>
          );
        })}
      </group>

      {/* --------------------------------------------------------------- chair */}
      {/* Sits behind the subject; the backrest is deliberately low so it frames
          the shoulders instead of hiding them. */}
      <group position={[0.75, 0, -0.12]} rotation={[0, -0.12, 0]}>
        <mesh position={[0, 1.02, -0.36]} rotation={[0.14, 0, 0]} castShadow material={materials.chair}>
          <boxGeometry args={[0.72, 0.82, 0.1]} />
        </mesh>
        {/* Headrest wing */}
        <mesh position={[0, 1.46, -0.42]} rotation={[0.2, 0, 0]} material={materials.chair}>
          <boxGeometry args={[0.5, 0.28, 0.09]} />
        </mesh>
        <mesh position={[0, 0.52, 0.0]} castShadow material={materials.chair}>
          <boxGeometry args={[0.76, 0.11, 0.66]} />
        </mesh>
        <mesh position={[-0.44, 0.74, 0.02]} material={materials.chair}>
          <boxGeometry args={[0.09, 0.07, 0.46]} />
        </mesh>
        <mesh position={[0.44, 0.74, 0.02]} material={materials.chair}>
          <boxGeometry args={[0.09, 0.07, 0.46]} />
        </mesh>
        <mesh position={[0, 0.28, 0]} material={materials.metalDark}>
          <cylinderGeometry args={[0.05, 0.05, 0.46, 12]} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.23, 0.05, Math.sin(a) * 0.23]}
              rotation={[0, -a, 0]}
              material={materials.chair}
            >
              <boxGeometry args={[0.46, 0.045, 0.06]} />
            </mesh>
          );
        })}
      </group>

      {/* -------------------------------------------------------------- lights */}
      {/* The set is lit as a night interior: a cool ambient base, a soft key on
          the face, a cyan rim for separation, and warm practicals. */}
      <ambientLight intensity={0.55} color="#6e7d9e" />
      <hemisphereLight args={['#2a3d63', '#07070d', 0.7]} />

      {/* Key — front-left of the subject, soft and cool */}
      <spotLight
        position={[-1.6, 3.2, 3.2]}
        target-position={[0.75, 1.4, 0.3]}
        angle={0.7}
        penumbra={1}
        intensity={26}
        color="#cfe2ff"
        distance={12}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />

      {/* Cyan rim from behind-left — the signature separation light */}
      <pointLight position={[-1.4, 2.2, -1.6]} intensity={14} color="#6ef2ff" distance={8} decay={2} />

      {/* Second rim, camera-right, so the far shoulder catches an edge */}
      <pointLight position={[3.0, 2.0, 1.2]} intensity={9} color="#8fd0ff" distance={7} decay={2} />

      {/* Warm practical bouncing off the desk */}
      <pointLight position={[2.6, 1.3, 0.9]} intensity={6} color="#ffb877" distance={5.5} decay={2} />

      {/* Cool wash from the window behind */}
      <directionalLight position={[1.5, 4, -5]} intensity={0.7} color="#7ea4ff" />
    </group>
  );
}
