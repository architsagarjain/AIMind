'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Limb } from './limb';

/**
 * Stylised seated character, built procedurally from primitives.
 *
 * Why procedural rather than a GLB: a rigged character is a multi-megabyte
 * asset and a modelling dependency. Primitives with good materials and lighting
 * hit the same "alive, not realistic" note, ship in kilobytes, and let the idle
 * animation be driven directly rather than baked.
 *
 * Proportions are deliberately non-realistic — an oversized head on a compact
 * body is the stylisation lever, and the face is built large because at hero
 * distance the eyes and mouth are doing nearly all of the characterisation.
 *
 * The skeleton below is the pose: joints are declared as points and `<Limb>`
 * solves each capsule's transform, so the pose can be adjusted by moving a
 * coordinate instead of re-deriving Euler angles.
 *
 * Three idle behaviours run continuously:
 *   breathe — chest and shoulders scale on a slow sine
 *   blink   — eyelids snap closed at randomised intervals
 *   look    — head drifts, with a subtle lean toward the pointer
 */

const SKIN = '#f2c19a';
const SKIN_SHADOW = '#dda078';
const SKIN_WARM = '#ffd2ad';
const HAIR = '#1c1620';
const HAIR_SHEEN = '#2e2433';
const HOODIE = '#262632';
const HOODIE_DARK = '#1b1b24';

/** ---------------------------------------------------------------- skeleton */
/* Joint positions in the avatar's local space. Edit these to change the pose. */

const SHOULDER_L: [number, number, number] = [-0.33, 1.13, 0.02];
const ELBOW_L: [number, number, number] = [-0.4, 0.82, 0.12];
const WRIST_L: [number, number, number] = [-0.3, 0.64, 0.36];

// The right arm props the chin — elbow parked on the chair's armrest.
const SHOULDER_R: [number, number, number] = [0.33, 1.13, 0.02];
const ELBOW_R: [number, number, number] = [0.42, 0.79, 0.1];
const WRIST_R: [number, number, number] = [0.17, 1.28, 0.28];

// Relaxed open stance: knees apart, both feet planted and pushed forward.
//
// A figure-four cross was tried first, to match the reference, but at this
// camera the crossed shin passes behind the supporting thigh and the two
// sneakers stack vertically — the whole lower body collapses into one dark
// mass. An open stance keeps both silhouettes separated and puts the white
// sneakers where they read against the dark trousers.
const HIP_R: [number, number, number] = [0.15, 0.64, 0.05];
const KNEE_R: [number, number, number] = [0.27, 0.56, 0.46];
const ANKLE_R: [number, number, number] = [0.31, 0.12, 0.57];

const HIP_L: [number, number, number] = [-0.16, 0.64, 0.06];
const KNEE_L: [number, number, number] = [-0.27, 0.55, 0.5];
const ANKLE_L: [number, number, number] = [-0.31, 0.12, 0.65];

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

/** One shoe, so both feet cannot drift apart as the pose is tuned. */
function Sneaker({
  position,
  yaw,
  shoe,
  sole,
}: {
  position: [number, number, number];
  yaw: number;
  shoe: THREE.Material;
  sole: THREE.Material;
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* Upper */}
      <mesh material={shoe} scale={[1, 0.8, 1.55]} castShadow>
        <sphereGeometry args={[0.1, 18, 14]} />
      </mesh>
      {/* Toe box, lifted so the shoe has a profile rather than reading as an egg */}
      <mesh position={[0, -0.01, 0.1]} material={shoe} scale={[0.92, 0.66, 0.9]}>
        <sphereGeometry args={[0.1, 16, 12]} />
      </mesh>
      {/* Midsole */}
      <mesh position={[0, -0.052, 0.012]} material={sole} scale={[1.05, 0.3, 1.6]}>
        <sphereGeometry args={[0.1, 18, 10]} />
      </mesh>
      {/* Laces */}
      {[0.0, 0.045, 0.09].map((z) => (
        <mesh
          key={z}
          position={[0, 0.056, z]}
          rotation={[0, 0, Math.PI / 2]}
          material={sole}
        >
          <capsuleGeometry args={[0.008, 0.05, 4, 8]} />
        </mesh>
      ))}
    </group>
  );
}

export function Avatar({ pointer, still = false }: AvatarProps) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftLid = useRef<THREE.Mesh>(null);
  const rightLid = useRef<THREE.Mesh>(null);

  /** Blink scheduler — next blink time and how long the lid stays down. */
  const blink = useRef({ next: 2.4, closing: false, until: 0 });

  const m = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.52, metalness: 0 }),
      skinShadow: new THREE.MeshStandardMaterial({
        color: SKIN_SHADOW,
        roughness: 0.6,
        metalness: 0,
      }),
      // A faintly emissive warm tone on the cheeks and nose fakes the
      // subsurface bounce that makes stylised skin look soft rather than
      // plastic — cheaper than a real transmission material.
      blush: new THREE.MeshStandardMaterial({
        color: SKIN_WARM,
        roughness: 0.48,
        emissive: '#8a3f2a',
        emissiveIntensity: 0.12,
      }),
      hair: new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.55, metalness: 0.05 }),
      hairSheen: new THREE.MeshStandardMaterial({
        color: HAIR_SHEEN,
        roughness: 0.5,
        metalness: 0.08,
      }),
      hoodie: new THREE.MeshStandardMaterial({ color: HOODIE, roughness: 0.88, metalness: 0 }),
      hoodieDark: new THREE.MeshStandardMaterial({
        color: HOODIE_DARK,
        roughness: 0.93,
        metalness: 0,
      }),
      drawstring: new THREE.MeshStandardMaterial({ color: '#d8d6d0', roughness: 0.7 }),
      eyeWhite: new THREE.MeshStandardMaterial({ color: '#fbfcff', roughness: 0.16 }),
      iris: new THREE.MeshStandardMaterial({ color: '#2b1f33', roughness: 0.12 }),
      catchlight: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 1.4,
      }),
      mouth: new THREE.MeshStandardMaterial({ color: '#8f4a3e', roughness: 0.45 }),
      print: new THREE.MeshStandardMaterial({
        color: '#000000',
        emissive: '#8b93a1',
        emissiveIntensity: 0.22,
      }),
      shoe: new THREE.MeshStandardMaterial({ color: '#f4f5f8', roughness: 0.5 }),
      shoeSole: new THREE.MeshStandardMaterial({ color: '#d6d9e0', roughness: 0.65 }),
      watch: new THREE.MeshStandardMaterial({ color: '#22222b', roughness: 0.3, metalness: 0.65 }),
      watchFace: new THREE.MeshStandardMaterial({
        color: '#05070c',
        emissive: '#6ef2ff',
        emissiveIntensity: 0.35,
        roughness: 0.15,
      }),
    }),
    [],
  );

  useFrame((state, delta) => {
    if (still) return;
    const t = state.clock.elapsedTime;

    if (torso.current) {
      const breath = Math.sin(t * 0.85);
      torso.current.scale.set(1 + breath * 0.013, 1 + breath * 0.017, 1 + breath * 0.013);
      torso.current.position.y = breath * 0.012;
    }

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
      head.current.rotation.z = -0.05 + Math.sin(t * 0.29) * 0.018;
    }

    const b = blink.current;
    if (!b.closing && t > b.next) {
      b.closing = true;
      b.until = t + 0.085;
    }
    if (b.closing && t > b.until) {
      b.closing = false;
      b.next = t + (Math.random() < 0.2 ? 0.28 : 4 + Math.random() * 3);
    }
    const lidScale = b.closing ? 1 : 0.04;
    for (const lid of [leftLid.current, rightLid.current]) {
      if (!lid) continue;
      lid.scale.y = THREE.MathUtils.lerp(lid.scale.y, lidScale, damp(28, delta));
    }

    if (root.current) {
      root.current.rotation.y = -0.16 + Math.sin(t * 0.21) * 0.025;
      root.current.position.y = Math.sin(t * 0.85) * 0.006;
    }
  });

  return (
    <group ref={root} position={[0.75, 0, 0.3]} rotation={[0, -0.16, 0]}>
      {/* ---------------------------------------------------------------- body */}
      <group ref={torso}>
        <mesh position={[0, 0.96, 0]} material={m.hoodie} castShadow>
          <capsuleGeometry args={[0.3, 0.3, 8, 24]} />
        </mesh>
        <mesh position={[0, 1.1, 0]} material={m.hoodie} castShadow>
          <sphereGeometry args={[0.33, 24, 18]} />
        </mesh>

        {/* Hood, bunched behind the neck */}
        <mesh position={[0, 1.16, -0.19]} rotation={[0.5, 0, 0]} material={m.hoodieDark}>
          <torusGeometry args={[0.185, 0.085, 12, 24]} />
        </mesh>
        {/* Collar opening */}
        <mesh position={[0, 1.2, 0.06]} rotation={[1.35, 0, 0]} material={m.hoodieDark}>
          <torusGeometry args={[0.15, 0.045, 10, 22]} />
        </mesh>

        {/* Drawstrings — small, but they are what reads the garment as a hoodie */}
        {[-0.075, 0.075].map((x) => (
          <group key={x}>
            <mesh position={[x, 1.07, 0.245]} rotation={[0.12, 0, x > 0 ? -0.06 : 0.06]} material={m.drawstring}>
              <capsuleGeometry args={[0.009, 0.15, 4, 8]} />
            </mesh>
            <mesh position={[x, 0.985, 0.262]} material={m.drawstring}>
              <cylinderGeometry args={[0.014, 0.014, 0.03, 8]} />
            </mesh>
          </group>
        ))}

        {/* Kangaroo pocket */}
        <mesh position={[0, 0.83, 0.235]} rotation={[0.22, 0, 0]} material={m.hoodieDark}>
          <boxGeometry args={[0.34, 0.16, 0.06]} />
        </mesh>

        {/* Chest print */}
        <mesh position={[-0.035, 1.0, 0.304]} rotation={[0, -0.1, 0]} material={m.print}>
          <planeGeometry args={[0.13, 0.1]} />
        </mesh>

        {/* Arms */}
        <Limb from={SHOULDER_L} to={ELBOW_L} radius={0.088} material={m.hoodie} castShadow />
        <Limb from={ELBOW_L} to={WRIST_L} radius={0.079} material={m.hoodie} castShadow />
        <mesh position={WRIST_L} material={m.skin} castShadow>
          <sphereGeometry args={[0.083, 16, 12]} />
        </mesh>

        <Limb from={SHOULDER_R} to={ELBOW_R} radius={0.088} material={m.hoodie} castShadow />
        <Limb from={ELBOW_R} to={WRIST_R} radius={0.079} material={m.hoodie} castShadow />

        {/* Watch, on the raised wrist where the reference shows it */}
        <group position={[0.2, 1.17, 0.26]} rotation={[0.35, 0, 0.32]}>
          <mesh material={m.watch}>
            <cylinderGeometry args={[0.088, 0.088, 0.045, 18]} />
          </mesh>
          <mesh position={[0, 0.024, 0]} material={m.watchFace}>
            <cylinderGeometry args={[0.062, 0.062, 0.006, 18]} />
          </mesh>
        </group>

        {/* Hand supporting the chin, fingers curled toward the cheek */}
        <group position={WRIST_R} rotation={[0.1, 0, 0.4]}>
          <mesh scale={[1, 1.18, 0.8]} material={m.skin} castShadow>
            <sphereGeometry args={[0.083, 18, 14]} />
          </mesh>
          {[-0.035, 0, 0.035].map((x, i) => (
            <mesh
              key={x}
              position={[x, 0.06 + i * 0.004, 0.045]}
              rotation={[0.5, 0, 0]}
              material={m.skinShadow}
            >
              <capsuleGeometry args={[0.019, 0.045, 4, 8]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ---------------------------------------------------------------- head */}
      <group ref={head} position={[0, 1.56, 0.03]}>
        <mesh position={[0, -0.2, -0.01]} material={m.skinShadow}>
          <cylinderGeometry args={[0.08, 0.098, 0.16, 16]} />
        </mesh>

        {/* Skull */}
        <mesh material={m.skin} castShadow scale={[1, 1.06, 0.95]}>
          <sphereGeometry args={[0.3, 32, 24]} />
        </mesh>

        {/* No cheek geometry: in the reference the cheeks are lighting, not
            shape. Spheres here sit proud of the eye plane and bury the eyes. */}

        {/* Ears */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.29, -0.01, -0.01]}
            rotation={[0, 0, side * -0.12]}
            material={m.skinShadow}
            scale={[0.45, 1, 0.7]}
          >
            <sphereGeometry args={[0.072, 12, 10]} />
          </mesh>
        ))}

        {/* ------------------------------------------------------------- hair */}
        {/* Built from overlapping lobes rather than one cap: a single sphere
            section reads as a painted-on helmet, and the silhouette is most of
            what makes stylised hair look like hair. */}
        <mesh position={[0, 0.075, -0.03]} material={m.hair} scale={[1.09, 1.06, 1.08]}>
          <sphereGeometry args={[0.3, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
        </mesh>
        <mesh position={[0, 0.02, -0.095]} material={m.hair} scale={[1.07, 1.04, 0.94]}>
          <sphereGeometry args={[0.3, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        </mesh>

        {/* Swept quiff, front-right and lifted */}
        <mesh
          position={[0.05, 0.255, 0.1]}
          rotation={[0.52, 0.18, 0.2]}
          material={m.hairSheen}
          scale={[1.5, 0.66, 1.05]}
        >
          <sphereGeometry args={[0.175, 20, 16]} />
        </mesh>
        {/* Secondary lobes give the silhouette its wave */}
        <mesh
          position={[-0.13, 0.215, 0.02]}
          rotation={[0.25, -0.3, 0.45]}
          material={m.hair}
          scale={[1.1, 0.7, 1]}
        >
          <sphereGeometry args={[0.12, 18, 14]} />
        </mesh>
        <mesh
          position={[0.2, 0.2, -0.03]}
          rotation={[0.1, 0.4, -0.5]}
          material={m.hair}
          scale={[1, 0.78, 1.1]}
        >
          <sphereGeometry args={[0.13, 18, 14]} />
        </mesh>
        <mesh
          position={[-0.05, 0.28, -0.12]}
          rotation={[-0.3, 0, 0.1]}
          material={m.hairSheen}
          scale={[1.35, 0.6, 1]}
        >
          <sphereGeometry args={[0.15, 18, 14]} />
        </mesh>
        {/* Front locks breaking the hairline */}
        {[
          [-0.175, 0.165, 0.175, 0.5],
          [0.15, 0.185, 0.185, -0.45],
        ].map(([x, y, z, rz], i) => (
          <mesh
            key={i}
            position={[x!, y!, z!]}
            rotation={[0.35, 0, rz!]}
            material={m.hair}
            scale={[1, 1.5, 0.8]}
          >
            <sphereGeometry args={[0.055, 12, 10]} />
          </mesh>
        ))}
        {/* Sideburns */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.262, -0.025, 0.015]}
            material={m.hair}
            scale={[0.32, 1.15, 0.55]}
          >
            <sphereGeometry args={[0.08, 10, 8]} />
          </mesh>
        ))}

        {/* ------------------------------------------------------------ brows */}
        {/* Thick and arched, sitting high with a clear gap above the eye — the
            gap is what separates "thoughtful" from "scowling". */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.108, 0.106, 0.25]} rotation={[0, side * 0.24, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2 + side * 0.17]} material={m.hair}>
              <capsuleGeometry args={[0.019, 0.08, 5, 10]} />
            </mesh>
          </group>
        ))}

        {/* ------------------------------------------------------------- eyes */}
        {/* Large and slightly off-axis: the reference looks up and away rather
            than at the viewer, which is what makes it read as thinking. */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.108, 0.012, 0.236]} rotation={[0, side * 0.2, 0]}>
            <mesh material={m.eyeWhite} scale={[1.1, 0.94, 0.6]}>
              <sphereGeometry args={[0.066, 22, 18]} />
            </mesh>
            {/* Iris, aimed up-left */}
            <mesh position={[-0.013, 0.012, 0.034]} material={m.iris} scale={[1, 1, 0.55]}>
              <sphereGeometry args={[0.04, 18, 14]} />
            </mesh>
            <mesh position={[-0.021, 0.026, 0.052]} material={m.catchlight}>
              <sphereGeometry args={[0.012, 8, 6]} />
            </mesh>
            <mesh position={[0.013, 0.002, 0.05]} material={m.catchlight} scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.006, 6, 5]} />
            </mesh>

            {/* Upper lash line — a dark sliver that gives the eye a top edge */}
            <mesh position={[0, 0.057, 0.026]} rotation={[0.3, 0, Math.PI / 2]} material={m.hair}>
              <capsuleGeometry args={[0.008, 0.078, 4, 10]} />
            </mesh>

            {/* Eyelid: flat by default, snaps to full height on blink */}
            <mesh
              ref={side === -1 ? leftLid : rightLid}
              position={[0, 0.042, 0.0]}
              scale={[1, 0.04, 1]}
              material={m.skinShadow}
            >
              <sphereGeometry args={[0.076, 16, 12]} />
            </mesh>
          </group>
        ))}

        {/* -------------------------------------------------------- nose/mouth */}
        <mesh
          position={[0, -0.055, 0.272]}
          rotation={[0.35, 0, 0]}
          scale={[0.8, 0.9, 0.95]}
          material={m.skinShadow}
        >
          <sphereGeometry args={[0.036, 16, 14]} />
        </mesh>

        {/* Smile: a wide shallow arc, with corners tucked into the cheeks */}
        <mesh
          position={[0, -0.135, 0.252]}
          rotation={[0.12, 0, Math.PI + Math.PI * 0.26]}
          material={m.mouth}
        >
          <torusGeometry args={[0.068, 0.013, 8, 22, Math.PI * 0.48]} />
        </mesh>
      </group>

      {/* ---------------------------------------------------------------- legs */}
      <group>
        <Limb from={HIP_R} to={KNEE_R} radius={0.118} material={m.hoodieDark} castShadow />
        <Limb from={KNEE_R} to={ANKLE_R} radius={0.097} material={m.hoodieDark} castShadow />
        <Sneaker position={[0.33, 0.075, 0.69]} yaw={-0.2} shoe={m.shoe} sole={m.shoeSole} />

        <Limb from={HIP_L} to={KNEE_L} radius={0.118} material={m.hoodieDark} castShadow />
        <Limb from={KNEE_L} to={ANKLE_L} radius={0.097} material={m.hoodieDark} castShadow />
        <Sneaker position={[-0.32, 0.075, 0.77]} yaw={0.16} shoe={m.shoe} sole={m.shoeSole} />

        {/* Trouser cuffs, breaking the leg-to-shoe join */}
        {[
          [0.31, 0.17, 0.58],
          [-0.31, 0.17, 0.66],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x!, y!, z!]} rotation={[0.12, 0, 0]} material={m.hoodie}>
            <cylinderGeometry args={[0.108, 0.1, 0.1, 14]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
