'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { merge, place, placementMatrix, roundedBox } from './set-geometry';
import { backOutlinePoints, meshWeaveTexture } from './set-textures';

/**
 * An ergonomic mesh task chair, built procedurally.
 *
 * Local space: origin on the floor under the gas lift, the seat facing +z.
 * Parts are merged per material, so the whole chair is six draw calls.
 */

// ---------------------------------------------------------------- dimensions
const SEAT_Y = 0.478;
const BACK_WIDTH = 0.5;
const BACK_HEIGHT = 0.64;
/** Radius the back wraps around the sitter. */
const BACK_WRAP = 0.6;
const LUMBAR = 0.028;

/** Where the back sits relative to the seat, and how far it reclines. */
const BACK_PLACEMENT = { position: [0, 0.585, -0.265], rotation: [-0.17, 0, 0] } as const;

const STAR_ARMS = 5;
const STAR_REACH = 0.315;

/**
 * The back's surface: wrapped horizontally around the sitter and pushed
 * forward at the lumbar. Applied identically to the mesh and to its frame, so
 * the two can never separate.
 */
function backSurfaceZ(x: number, y: number): number {
  const wrap = -(x * x) / (2 * BACK_WRAP);
  const lumbar = LUMBAR * Math.exp(-(((y - 0.26 * BACK_HEIGHT) / (0.13 * BACK_HEIGHT)) ** 2));
  return wrap + lumbar;
}

function lathe(profile: Array<[number, number]>, segments = 32): THREE.BufferGeometry {
  return new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
}

/** One arm of the five-star base: a tapered, rising cast-aluminium spoke. */
function starArm(angle: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0.03, 0.08);
  s.lineTo(0.3, 0.062);
  s.quadraticCurveTo(0.33, 0.06, 0.33, 0.075);
  s.quadraticCurveTo(0.33, 0.09, 0.3, 0.09);
  s.lineTo(0.03, 0.128);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.034,
    bevelEnabled: true,
    bevelThickness: 0.007,
    bevelSize: 0.006,
    bevelSegments: 3,
    curveSegments: 8,
  });
  g.translate(0, 0, -0.017);
  return place(g, { rotation: [0, angle, 0] });
}

/** A twin-wheel caster at the end of a spoke. */
function caster(angle: number): THREE.BufferGeometry[] {
  const dir = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
  const tangent = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
  const at = (r: number, y: number, t = 0) =>
    dir.clone().multiplyScalar(r).addScaledVector(tangent, t).setY(y).toArray() as [
      number,
      number,
      number,
    ];

  const wheel = (t: number) => {
    const g = new THREE.CylinderGeometry(0.026, 0.026, 0.013, 20);
    g.rotateX(Math.PI / 2); // axle along the tangent, so it rolls radially
    return place(g, { position: at(STAR_REACH + 0.02, 0.026, t), rotation: [0, angle, 0] });
  };

  return [
    place(new THREE.CylinderGeometry(0.007, 0.007, 0.02, 10), { position: at(STAR_REACH, 0.056) }),
    roundedBox(0.05, 0.03, 0.044, 0.012, {
      position: at(STAR_REACH + 0.012, 0.05),
      rotation: [0, angle, 0],
    }),
    wheel(-0.012),
    wheel(0.012),
  ];
}

function seatCushion(): THREE.BufferGeometry {
  // Drawn in XY with +y toward the back; rotated flat below. Slightly wider at
  // the front, where the thighs are.
  const fw = 0.245;
  const bw = 0.225;
  const f = -0.22;
  const b = 0.22;
  const r = 0.07;
  const s = new THREE.Shape();
  s.moveTo(-fw + r, f);
  s.lineTo(fw - r, f);
  s.quadraticCurveTo(fw, f, fw, f + r);
  s.lineTo(bw, b - r);
  s.quadraticCurveTo(bw, b, bw - r, b);
  s.lineTo(-bw + r, b);
  s.quadraticCurveTo(-bw, b, -bw, b - r);
  s.lineTo(-fw, f + r);
  s.quadraticCurveTo(-fw, f, -fw + r, f);

  // A deep, many-segment bevel is what makes this a cushion rather than a slab.
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.026,
    bevelSize: 0.03,
    bevelSegments: 6,
    curveSegments: 12,
  });
  return place(g, { position: [0, SEAT_Y, 0], rotation: [-Math.PI / 2, 0, 0] });
}

interface BackParts {
  mesh: THREE.BufferGeometry;
  frame: THREE.BufferGeometry;
  /** Bottom-centre of the frame, in chair space; where the spine attaches. */
  mount: THREE.Vector3;
}

function back(): BackParts {
  const matrix = placementMatrix(BACK_PLACEMENT);

  const mesh = new THREE.PlaneGeometry(BACK_WIDTH, BACK_HEIGHT, 36, 44);
  mesh.translate(0, BACK_HEIGHT / 2, 0);
  const pos = mesh.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i += 1) {
    pos.setZ(i, backSurfaceZ(pos.getX(i), pos.getY(i)));
  }
  mesh.computeVertexNormals();
  mesh.applyMatrix4(matrix);

  const outline = backOutlinePoints().map(
    (p) =>
      new THREE.Vector3(
        p.x * BACK_WIDTH,
        p.y * BACK_HEIGHT,
        backSurfaceZ(p.x * BACK_WIDTH, p.y * BACK_HEIGHT),
      ),
  );
  const frame = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(outline, true, 'centripetal'),
    260,
    0.012,
    10,
    true,
  );
  frame.applyMatrix4(matrix);

  const mount = new THREE.Vector3(0, 0, backSurfaceZ(0, 0) - 0.012).applyMatrix4(matrix);
  return { mesh, frame, mount };
}

export function Chair({ env }: { env: THREE.Texture }) {
  const built = useMemo(() => {
    const weave = meshWeaveTexture();

    const materials = {
      aluminium: new THREE.MeshStandardMaterial({
        color: '#c3c8d1',
        metalness: 1,
        roughness: 0.24,
        envMap: env,
        envMapIntensity: 1,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: '#eef1f6',
        metalness: 1,
        roughness: 0.07,
        envMap: env,
        envMapIntensity: 1.1,
      }),
      plastic: new THREE.MeshStandardMaterial({
        color: '#121318',
        metalness: 0.1,
        roughness: 0.42,
        envMap: env,
        envMapIntensity: 0.7,
      }),
      pad: new THREE.MeshStandardMaterial({
        color: '#17181e',
        roughness: 0.62,
        envMap: env,
        envMapIntensity: 0.5,
      }),
      // Sheen is the fabric term: a soft glow at grazing angles, which is how
      // woven upholstery catches a rim light.
      fabric: new THREE.MeshPhysicalMaterial({
        color: '#17191f',
        roughness: 0.92,
        // Kept low: at full strength under this blue key, the whole cushion
        // glowed and read as a pale plastic pillow.
        sheen: 0.5,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color('#3d4966'),
        envMap: env,
        envMapIntensity: 0.35,
      }),
      mesh: new THREE.MeshStandardMaterial({
        map: weave,
        transparent: true,
        // Two faces of a bent, see-through sheet would z-sort against each
        // other every frame; not writing depth sidesteps that.
        depthWrite: false,
        side: THREE.DoubleSide,
        roughness: 0.85,
        envMap: env,
        envMapIntensity: 0.3,
      }),
    };

    const { mesh, frame, mount } = back();
    const angles = Array.from({ length: STAR_ARMS }, (_, i) => (i / STAR_ARMS) * Math.PI * 2 + 0.3);

    const spine = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.415, -0.12),
        new THREE.Vector3(0, 0.4, -0.25),
        new THREE.Vector3(0, 0.47, mount.z - 0.02),
        mount,
      ]),
      48,
      0.02,
      12,
      false,
    );

    const arm = (side: 1 | -1) => ({
      frame: [
        roundedBox(0.16, 0.024, 0.06, 0.008, { position: [side * 0.22, 0.43, -0.02] }),
        roundedBox(0.035, 0.24, 0.06, 0.012, { position: [side * 0.3, 0.55, -0.02] }),
      ],
      pad: roundedBox(0.075, 0.03, 0.25, 0.014, { position: [side * 0.3, 0.68, 0] }),
    });
    const arms = [arm(1), arm(-1)];

    const geometries = {
      aluminium: merge([
        ...angles.map(starArm),
        lathe([
          [0, 0.07],
          [0.05, 0.07],
          [0.062, 0.085],
          [0.062, 0.125],
          [0.05, 0.14],
          [0, 0.14],
        ]),
        spine,
      ]),
      chrome: merge([
        place(new THREE.CylinderGeometry(0.02, 0.02, 0.11, 24), { position: [0, 0.355, 0] }),
      ]),
      plastic: merge([
        // Gas-lift shroud, stepped where the telescoping sections meet.
        lathe([
          [0, 0.13],
          [0.04, 0.13],
          [0.04, 0.2],
          [0.034, 0.21],
          [0.034, 0.305],
          [0, 0.305],
        ]),
        roundedBox(0.2, 0.05, 0.26, 0.012, { position: [0, 0.415, -0.02] }), // mechanism
        roundedBox(0.34, 0.012, 0.34, 0.004, { position: [0, 0.444, 0] }), //   seat plate
        roundedBox(0.5, 0.018, 0.46, 0.008, { position: [0, 0.452, 0] }), //    seat shell
        // Height lever.
        place(new THREE.CylinderGeometry(0.006, 0.006, 0.15, 10), {
          position: [0.16, 0.41, 0.06],
          rotation: [0, 0, Math.PI / 2],
        }),
        roundedBox(0.03, 0.018, 0.022, 0.008, { position: [0.235, 0.41, 0.06] }),
        ...arms.flatMap((a) => a.frame),
        ...angles.flatMap(caster),
        frame,
      ]),
      pad: merge(arms.map((a) => a.pad)),
      fabric: merge([seatCushion()]),
      mesh,
    };

    return { materials, geometries, weave };
  }, [env]);

  useEffect(
    () => () => {
      built.weave.dispose();
      Object.values(built.materials).forEach((m) => m.dispose());
      Object.values(built.geometries).forEach((g) => g.dispose());
    },
    [built],
  );

  const { materials: m, geometries: g } = built;
  return (
    <group>
      <mesh geometry={g.aluminium} material={m.aluminium} castShadow />
      <mesh geometry={g.chrome} material={m.chrome} castShadow />
      <mesh geometry={g.plastic} material={m.plastic} castShadow receiveShadow />
      <mesh geometry={g.pad} material={m.pad} castShadow />
      <mesh geometry={g.fabric} material={m.fabric} castShadow receiveShadow />
      {/* No shadow from the mesh: a shadow map is binary, so a see-through
          back would cast as a solid board. */}
      <mesh geometry={g.mesh} material={m.mesh} />
    </group>
  );
}
