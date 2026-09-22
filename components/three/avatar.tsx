'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Stylised seated character, built procedurally from primitives.
 *
 * Why procedural rather than a GLB: a rigged character is a multi-megabyte
 * asset and a modelling dependency. Primitives with good materials and lighting
 * hit the same "alive, not realistic" note, ship in kilobytes, and let the idle
 * animation be driven directly rather than baked.
 *
 * Proportions are deliberately non-realistic — an oversized head on a compact
 * body is what reads as "stylised character" rather than "low-poly human".
 *
 * Three idle behaviours run continuously:
 *   breathe — chest and shoulders scale on a slow sine
 *   blink   — eyelids snap closed at randomised intervals
 *   look    — head drifts, with a subtle lean toward the pointer
 */

const SKIN = '#f0bd94';
const SKIN_SHADOW = '#dba077';
const HAIR = '#17131c';
const HOODIE = '#1a1a23';
const HOODIE_DARK = '#111118';

interface AvatarProps {
  /** Normalised pointer, -1..1 on both axes. */
  pointer: React.RefObject<{ x: number; y: number }>;
  /** Freezes idle motion for prefers-reduced-motion. */
  still?: boolean;
}

/**
 * Frame-rate-independent damping factor.
 *
 * `delta * rate` is the tempting form, but it is an interpolation *factor*, not
 * a rate: on a stalled frame (a slow GPU, a backgrounded tab) delta can reach
 * 0.2s, pushing the factor past 2 and making the lerp diverge instead of
 * converge. Exponential decay is always in [0, 1), so it cannot overshoot.
 */
const damp = (rate: number, delta: number) => 1 - Math.exp(-rate * Math.min(delta, 0.1));

export function Avatar({ pointer, still = false }: AvatarProps) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftLid = useRef<THREE.Mesh>(null);
  const rightLid = useRef<THREE.Mesh>(null);

  /** Blink scheduler — next blink time and how long the lid stays down. */
  const blink = useRef({ next: 2.4, closing: false, until: 0 });

  const materials = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.58, metalness: 0 }),
      skinShadow: new THREE.MeshStandardMaterial({
        color: SKIN_SHADOW,
        roughness: 0.66,
        metalness: 0,
      }),
      hair: new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.42, metalness: 0.08 }),
      hoodie: new THREE.MeshStandardMaterial({ color: HOODIE, roughness: 0.9, metalness: 0 }),
      hoodieDark: new THREE.MeshStandardMaterial({
        color: HOODIE_DARK,
        roughness: 0.94,
        metalness: 0,
      }),
      eyeWhite: new THREE.MeshStandardMaterial({ color: '#f7f8fc', roughness: 0.2 }),
      pupil: new THREE.MeshStandardMaterial({ color: '#0b0b12', roughness: 0.15 }),
      print: new THREE.MeshStandardMaterial({
        color: '#000000',
        emissive: '#6b7280',
        emissiveIntensity: 0.16,
      }),
      shoe: new THREE.MeshStandardMaterial({ color: '#eef0f5', roughness: 0.55 }),
      watch: new THREE.MeshStandardMaterial({ color: '#202029', roughness: 0.35, metalness: 0.6 }),
      mouth: new THREE.MeshStandardMaterial({ color: '#a45c4a', roughness: 0.5 }),
    }),
    [],
  );

  useFrame((state, delta) => {
    if (still) return;
    const t = state.clock.elapsedTime;

    // --- Breathing: the torso expands and lifts a touch on each cycle -------
    if (torso.current) {
      const breath = Math.sin(t * 0.85);
      torso.current.scale.set(1 + breath * 0.013, 1 + breath * 0.017, 1 + breath * 0.013);
      torso.current.position.y = breath * 0.012;
    }

    // --- Head: slow idle drift plus a gentle pull toward the pointer --------
    if (head.current) {
      const px = pointer.current?.x ?? 0;
      const py = pointer.current?.y ?? 0;
      const idleYaw = Math.sin(t * 0.33) * 0.08 + Math.sin(t * 0.71) * 0.022;
      const idlePitch = Math.sin(t * 0.47) * 0.04;

      head.current.rotation.y = THREE.MathUtils.lerp(
        head.current.rotation.y,
        idleYaw + px * 0.16,
        damp(2.2, delta),
      );
      head.current.rotation.x = THREE.MathUtils.lerp(
        head.current.rotation.x,
        idlePitch - py * 0.09,
        damp(2.2, delta),
      );
      head.current.rotation.z = Math.sin(t * 0.29) * 0.018;
    }

    // --- Blink: randomised, occasionally doubled ----------------------------
    const b = blink.current;
    if (!b.closing && t > b.next) {
      b.closing = true;
      b.until = t + 0.085;
    }
    if (b.closing && t > b.until) {
      b.closing = false;
      // 4–7s apart, with a 1-in-5 chance of a quick second blink.
      b.next = t + (Math.random() < 0.2 ? 0.28 : 4 + Math.random() * 3);
    }
    const lidScale = b.closing ? 1 : 0.04;
    for (const lid of [leftLid.current, rightLid.current]) {
      if (!lid) continue;
      lid.scale.y = THREE.MathUtils.lerp(lid.scale.y, lidScale, damp(28, delta));
    }

    // --- Whole-body sway ----------------------------------------------------
    if (root.current) {
      root.current.rotation.y = -0.16 + Math.sin(t * 0.21) * 0.025;
      root.current.position.y = Math.sin(t * 0.85) * 0.006;
    }
  });

  return (
    <group ref={root} position={[0.75, 0, 0.3]} rotation={[0, -0.16, 0]}>
      {/* ---------------------------------------------------------------- body */}
      <group ref={torso}>
        {/* Hoodie torso — tapered capsule, short so the head dominates */}
        <mesh position={[0, 0.96, 0]} material={materials.hoodie} castShadow>
          <capsuleGeometry args={[0.3, 0.3, 8, 24]} />
        </mesh>

        {/* Shoulders */}
        <mesh position={[0, 1.1, 0]} material={materials.hoodie} castShadow>
          <sphereGeometry args={[0.33, 24, 18]} />
        </mesh>

        {/* Hood bunched behind the neck */}
        <mesh position={[0, 1.16, -0.19]} rotation={[0.5, 0, 0]} material={materials.hoodieDark}>
          <torusGeometry args={[0.18, 0.08, 12, 24]} />
        </mesh>

        {/* Chest print */}
        <mesh position={[-0.035, 0.99, 0.304]} rotation={[0, -0.1, 0]} material={materials.print}>
          <planeGeometry args={[0.14, 0.11]} />
        </mesh>

        {/* Arms.
            Each limb is a capsule placed at the midpoint of an elbow→wrist
            vector and rotated to align its local +Y with that vector. Posing by
            eye never converges; solving the two Euler angles does. */}

        {/* Left arm — hangs down, hand resting on the knee */}
        <mesh
          position={[-0.345, 0.95, 0.08]}
          rotation={[2.802, 0, 0.0831]}
          material={materials.hoodie}
          castShadow
        >
          <capsuleGeometry args={[0.087, 0.187, 6, 16]} />
        </mesh>
        <mesh
          position={[-0.31, 0.7, 0.24]}
          rotation={[2.2423, 0, -0.3737]}
          material={materials.hoodie}
          castShadow
        >
          <capsuleGeometry args={[0.078, 0.118, 6, 16]} />
        </mesh>
        <mesh position={[-0.26, 0.62, 0.34]} material={materials.skin} castShadow>
          <sphereGeometry args={[0.085, 16, 12]} />
        </mesh>

        {/* Right arm — elbow down, forearm angled up so the hand meets the jaw.
            This is the pose the whole composition is built around. */}
        <mesh
          position={[0.335, 0.965, 0.06]}
          rotation={[2.9037, 0, -0.0295]}
          material={materials.hoodie}
          castShadow
        >
          <capsuleGeometry args={[0.087, 0.166, 6, 16]} />
        </mesh>
        <mesh
          position={[0.255, 1.05, 0.19]}
          rotation={[0.3454, 0, 0.3096]}
          material={materials.hoodie}
          castShadow
        >
          <capsuleGeometry args={[0.078, 0.402, 6, 16]} />
        </mesh>
        {/* Watch, sitting just below the wrist */}
        <mesh
          position={[0.204, 1.2, 0.244]}
          rotation={[0.3454, 0, 0.3096 + Math.PI / 2]}
          material={materials.watch}
        >
          <cylinderGeometry args={[0.084, 0.084, 0.042, 16]} />
        </mesh>
        {/* Hand, knuckles against the jaw */}
        <mesh
          position={[0.17, 1.3, 0.28]}
          rotation={[0, 0, 0.35]}
          scale={[1, 1.15, 0.85]}
          material={materials.skin}
          castShadow
        >
          <sphereGeometry args={[0.082, 16, 12]} />
        </mesh>
      </group>

      {/* ---------------------------------------------------------------- head */}
      {/* Oversized on purpose — this is the stylisation lever. */}
      <group ref={head} position={[0, 1.56, 0.03]}>
        {/* Neck */}
        <mesh position={[0, -0.2, -0.01]} material={materials.skinShadow}>
          <cylinderGeometry args={[0.078, 0.095, 0.16, 16]} />
        </mesh>

        {/* Skull */}
        <mesh material={materials.skin} castShadow scale={[1, 1.06, 0.95]}>
          <sphereGeometry args={[0.3, 32, 24]} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.29, -0.01, -0.01]} material={materials.skinShadow} scale={[0.45, 1, 0.7]}>
          <sphereGeometry args={[0.07, 12, 10]} />
        </mesh>
        <mesh position={[0.29, -0.01, -0.01]} material={materials.skinShadow} scale={[0.45, 1, 0.7]}>
          <sphereGeometry args={[0.07, 12, 10]} />
        </mesh>

        {/* Hair: swept cap plus a front quiff */}
        <mesh position={[0, 0.08, -0.03]} material={materials.hair} scale={[1.1, 1.08, 1.09]}>
          <sphereGeometry args={[0.3, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.44]} />
        </mesh>
        {/* Back of the hair, dropping lower than the front hairline */}
        <mesh position={[0, 0.03, -0.09]} material={materials.hair} scale={[1.08, 1.05, 0.95]}>
          <sphereGeometry args={[0.3, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        </mesh>
        <mesh
          position={[0.03, 0.235, 0.115]}
          rotation={[0.5, 0.14, 0.16]}
          material={materials.hair}
          scale={[1.6, 0.6, 1.0]}
        >
          <sphereGeometry args={[0.17, 20, 16]} />
        </mesh>
        <mesh position={[-0.2, 0.13, 0.11]} rotation={[0.2, 0, 0.55]} material={materials.hair}>
          <capsuleGeometry args={[0.045, 0.12, 6, 12]} />
        </mesh>
        {/* Sideburns */}
        <mesh position={[-0.26, -0.02, 0.02]} material={materials.hair} scale={[0.35, 1.1, 0.55]}>
          <sphereGeometry args={[0.075, 10, 8]} />
        </mesh>
        <mesh position={[0.26, -0.02, 0.02]} material={materials.hair} scale={[0.35, 1.1, 0.55]}>
          <sphereGeometry args={[0.075, 10, 8]} />
        </mesh>

        {/* Brows — heavy and slightly raised; most of the expression lives here */}
        <mesh position={[-0.1, 0.085, 0.262]} rotation={[0, -0.2, 0.05]} material={materials.hair}>
          <boxGeometry args={[0.1, 0.022, 0.022]} />
        </mesh>
        <mesh position={[0.1, 0.085, 0.262]} rotation={[0, 0.2, -0.05]} material={materials.hair}>
          <boxGeometry args={[0.1, 0.022, 0.022]} />
        </mesh>

        {/* Eyes.
            The whites are sunk into the skull so only a sliver shows — a sphere
            sitting proud of the face reads as googly rather than stylised. */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.1, 0.005, 0.224]} rotation={[0, side * 0.16, 0]}>
            <mesh material={materials.eyeWhite} scale={[1.05, 0.92, 0.5]}>
              <sphereGeometry args={[0.062, 20, 16]} />
            </mesh>
            <mesh position={[side * -0.006, -0.004, 0.026]} material={materials.pupil}>
              <sphereGeometry args={[0.031, 16, 12]} />
            </mesh>
            {/* Catchlight — a tiny emissive dot is what makes eyes look alive */}
            <mesh position={[side * -0.016, 0.016, 0.044]} material={materials.eyeWhite}>
              <sphereGeometry args={[0.009, 8, 6]} />
            </mesh>
            {/* Eyelid: flat by default, snaps to full height on blink */}
            <mesh
              ref={side === -1 ? leftLid : rightLid}
              position={[0, 0.016, 0.006]}
              scale={[1, 0.04, 1]}
              material={materials.skin}
            >
              <sphereGeometry args={[0.066, 16, 12]} />
            </mesh>
          </group>
        ))}

        {/* Nose */}
        <mesh
          position={[0, -0.055, 0.278]}
          rotation={[0.35, 0, 0]}
          scale={[0.85, 1, 1]}
          material={materials.skinShadow}
        >
          <sphereGeometry args={[0.038, 14, 12]} />
        </mesh>

        {/* Mouth — a shallow upward arc, read as a half-smile */}
        <mesh
          position={[0, -0.115, 0.252]}
          rotation={[0.1, 0, Math.PI + Math.PI * 0.3]}
          material={materials.mouth}
        >
          <torusGeometry args={[0.055, 0.012, 8, 20, Math.PI * 0.4]} />
        </mesh>
      </group>

      {/* ---------------------------------------------------------------- legs */}
      {/* Same midpoint-and-align construction as the arms. Seated, knees
          forward, feet planted and slightly splayed. */}
      <group>
        {/* Left thigh / shin / shoe */}
        <mesh position={[-0.18, 0.63, 0.3]} rotation={[1.7063, 0, 0.0898]} material={materials.hoodieDark} castShadow>
          <capsuleGeometry args={[0.115, 0.216, 6, 16]} />
        </mesh>
        <mesh position={[-0.21, 0.37, 0.56]} rotation={[2.9694, 0, 0.0428]} material={materials.hoodieDark} castShadow>
          <capsuleGeometry args={[0.095, 0.277, 6, 16]} />
        </mesh>
        <mesh position={[-0.22, 0.1, 0.68]} rotation={[1.45, 0.06, 0]} material={materials.shoe} castShadow>
          <capsuleGeometry args={[0.092, 0.13, 6, 14]} />
        </mesh>

        {/* Right thigh / shin / shoe, opened out a little */}
        <mesh position={[0.2, 0.63, 0.29]} rotation={[1.7126, 0, -0.1862]} material={materials.hoodieDark} castShadow>
          <capsuleGeometry args={[0.115, 0.202, 6, 16]} />
        </mesh>
        <mesh position={[0.27, 0.37, 0.53]} rotation={[3.0111, 0, -0.1287]} material={materials.hoodieDark} castShadow>
          <capsuleGeometry args={[0.095, 0.278, 6, 16]} />
        </mesh>
        <mesh position={[0.3, 0.1, 0.64]} rotation={[1.45, -0.12, 0]} material={materials.shoe} castShadow>
          <capsuleGeometry args={[0.092, 0.13, 6, 14]} />
        </mesh>
      </group>
    </group>
  );
}
