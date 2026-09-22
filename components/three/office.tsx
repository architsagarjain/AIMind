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

/**
 * Laptop placement, declared once and consumed by both the JSX below and the
 * camera rig.
 *
 * The screen's world position used to be a hand-computed literal, which
 * silently drifted the moment the lid geometry changed — the camera then flew
 * to where the screen *used* to be. Composing the same transforms three.js will
 * apply makes the constant derived rather than remembered.
 */
const LAPTOP_POSITION = new THREE.Vector3(2.0, 0.775, -0.1);
const LAPTOP_ROTATION_Y = 0.55;
/** Lid pivot, relative to the laptop group. */
const LID_OFFSET = new THREE.Vector3(0, 0.014, -0.12);
const LID_TILT_X = -0.26;
/** Screen plane, relative to the lid pivot. */
const SCREEN_OFFSET = new THREE.Vector3(0, 0.285, 0.004);

const LAPTOP_MATRIX = new THREE.Matrix4()
  .makeRotationY(LAPTOP_ROTATION_Y)
  .premultiply(new THREE.Matrix4().makeTranslation(LAPTOP_POSITION));
const LID_MATRIX = LAPTOP_MATRIX.clone()
  .multiply(new THREE.Matrix4().makeTranslation(LID_OFFSET))
  .multiply(new THREE.Matrix4().makeRotationX(LID_TILT_X));

/** World-space centre of the laptop screen — the camera rig's destination. */
export const LAPTOP_SCREEN = SCREEN_OFFSET.clone().applyMatrix4(LID_MATRIX);

/** Unit normal the screen faces, used to park the camera just off its surface. */
export const LAPTOP_NORMAL = new THREE.Vector3(0, 0, 1)
  .transformDirection(LID_MATRIX)
  .normalize();

export function Office({ still = false }: { still?: boolean }) {
  const screenGlow = useRef<THREE.PointLight>(null);
  const cityRef = useRef<THREE.Points>(null);

  const materials = useMemo(
    () => ({
      floor: new THREE.MeshStandardMaterial({ color: '#0a0b14', roughness: 0.72, metalness: 0.25 }),
      wall: new THREE.MeshStandardMaterial({ color: '#0c0e1a', roughness: 0.95 }),
      desk: new THREE.MeshStandardMaterial({ color: '#4a3527', roughness: 0.5, metalness: 0.08 }),
      metal: new THREE.MeshStandardMaterial({ color: '#9aa0ab', roughness: 0.3, metalness: 0.85 }),
      // Anodised aluminium: low roughness + high metalness is what separates a
      // MacBook read from a generic grey slab.
      aluminium: new THREE.MeshStandardMaterial({
        color: '#b9bec7',
        roughness: 0.22,
        metalness: 0.95,
      }),
      aluminiumDark: new THREE.MeshStandardMaterial({
        color: '#70757e',
        roughness: 0.3,
        metalness: 0.9,
      }),
      bezel: new THREE.MeshStandardMaterial({ color: '#0a0a0e', roughness: 0.5 }),
      keycap: new THREE.MeshStandardMaterial({ color: '#15151b', roughness: 0.75 }),
      logo: new THREE.MeshStandardMaterial({
        color: '#000000',
        emissive: '#e8f7ff',
        emissiveIntensity: 0.7,
      }),
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
      screenUiDim: new THREE.MeshStandardMaterial({
        color: '#000000',
        emissive: '#1d9bf0',
        emissiveIntensity: 0.5,
        roughness: 0.4,
      }),
      mug: new THREE.MeshStandardMaterial({ color: '#15151d', roughness: 0.5 }),
      book: new THREE.MeshStandardMaterial({ color: '#2a2a38', roughness: 0.85 }),
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

  const m = materials;

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
      {/* Proportioned off a 14" notebook: a thin tapered deck, a narrow bezel,
          and a lid a touch wider than it is tall. LAPTOP_SCREEN is derived from
          exactly these transforms — move the laptop and it moves with it. */}
      <group position={LAPTOP_POSITION} rotation={[0, LAPTOP_ROTATION_Y, 0]}>
        {/* Deck */}
        <mesh position={[0, 0.007, 0.18]} castShadow material={m.aluminium}>
          <boxGeometry args={[0.82, 0.014, 0.57]} />
        </mesh>
        {/* Foot shadow line under the front lip */}
        <mesh position={[0, -0.002, 0.18]} material={m.aluminiumDark}>
          <boxGeometry args={[0.8, 0.006, 0.55]} />
        </mesh>

        {/* Keyboard well + keycap field */}
        <mesh position={[0, 0.015, 0.14]} material={m.bezel}>
          <boxGeometry args={[0.66, 0.003, 0.26]} />
        </mesh>
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 14 }).map((__, col) => (
            <mesh
              key={`${row}-${col}`}
              position={[-0.315 + col * 0.0485, 0.018, 0.045 + row * 0.048]}
              material={m.keycap}
            >
              <boxGeometry args={[0.04, 0.003, 0.04]} />
            </mesh>
          )),
        )}
        {/* Trackpad */}
        <mesh position={[0, 0.016, 0.335]} material={m.aluminiumDark}>
          <boxGeometry args={[0.24, 0.002, 0.16]} />
        </mesh>

        {/* Lid, hinged back ~15° */}
        <group position={LID_OFFSET} rotation={[LID_TILT_X, 0, 0]}>
          {/* Outer shell */}
          <mesh position={[0, 0.28, -0.008]} castShadow material={m.aluminium}>
            <boxGeometry args={[0.82, 0.56, 0.011]} />
          </mesh>
          {/* Backlit logo on the shell */}
          <mesh position={[0, 0.28, -0.015]} material={m.logo}>
            <circleGeometry args={[0.05, 20]} />
          </mesh>
          {/* Bezel then screen, so the display is inset rather than flush */}
          <mesh position={[0, 0.28, 0.0]} material={m.bezel}>
            <planeGeometry args={[0.8, 0.54]} />
          </mesh>
          <mesh position={SCREEN_OFFSET} material={m.screen}>
            <planeGeometry args={[0.76, 0.5]} />
          </mesh>

          {/* On-screen UI — a title bar, a sidebar, copy lines and a panel, so
              the camera's dive lands on something structured, not a void. */}
          <group position={[0, 0.285, 0.007]}>
            <mesh position={[0, 0.222, 0]} material={m.screenUi}>
              <planeGeometry args={[0.73, 0.016]} />
            </mesh>
            {/* Sidebar */}
            <mesh position={[-0.3, 0.02, 0]} material={m.screenUiDim}>
              <planeGeometry args={[0.14, 0.4]} />
            </mesh>
            {[0.12, 0.06, 0, -0.06, -0.12].map((y, i) => (
              <mesh key={y} position={[-0.3, y + 0.06, 0.001]} material={m.screenUi}>
                <planeGeometry args={[0.1 - (i % 2) * 0.02, 0.008]} />
              </mesh>
            ))}
            {/* Body copy */}
            {[0.15, 0.105, 0.06, 0.015, -0.03].map((y, i) => (
              <mesh key={y} position={[-0.02 - i * 0.012, y, 0]} material={m.screenUi}>
                <planeGeometry args={[0.34 - i * 0.035, 0.011]} />
              </mesh>
            ))}
            {/* Card */}
            <mesh position={[0.2, -0.11, 0]} material={m.screenUiDim}>
              <planeGeometry args={[0.22, 0.14]} />
            </mesh>
            <mesh position={[0.2, -0.06, 0.001]} material={m.screenUi}>
              <planeGeometry args={[0.18, 0.01]} />
            </mesh>
          </group>

          <pointLight
            ref={screenGlow}
            position={[0, 0.28, 0.5]}
            color="#6ef2ff"
            intensity={1.5}
            distance={3.2}
            decay={2}
          />
        </group>
      </group>

      {/* ----------------------------------------------------------------- mug */}
      <group position={[2.78, 0.775, 0.16]}>
        <mesh material={materials.mug} castShadow>
          <cylinderGeometry args={[0.078, 0.064, 0.145, 20]} />
        </mesh>
        <mesh position={[0.095, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.mug}>
          <torusGeometry args={[0.042, 0.011, 8, 16]} />
        </mesh>
      </group>

      {/* --------------------------------------------------------------- books */}
      <group position={[3.12, 0.775, -0.34]}>
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
      <group position={[3.62, 0.775, 0.3]}>
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
      <group position={[1.55, 0, -0.55]} rotation={[0, -0.75, 0]}>
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
      <ambientLight intensity={0.62} color="#7787a8" />
      <hemisphereLight args={['#2a3d63', '#07070d', 0.7]} />

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

      {/* Warm practical bouncing off the desk */}
      <pointLight position={[2.65, 1.2, 0.8]} intensity={10} color="#ffb070" distance={4.6} decay={2} />

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
