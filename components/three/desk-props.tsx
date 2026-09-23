'use client';

import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { merge, place, roundedBox, tint } from './set-geometry';
import { mulberry32, pageEdgeTexture, snakeLeafTexture, soilTexture } from './set-textures';

/**
 * The things on the desk: a stack of books, a mug of coffee and a snake plant.
 *
 * Each component's origin is its footprint on the desk surface (y = 0 is the
 * top of the walnut), so `office.tsx` places them without knowing their size.
 * They are modelled at real-world size and scaled up by the same art-direction
 * factor as the laptop, so they stay in proportion with it.
 *
 * Environment intensities here are deliberately far lower than on the desk.
 * An envMap adds diffuse light as well as reflections, and on props this
 * small, sitting under the warm practical, the desk's values flooded them:
 * oxblood covers rendered coral and a dark glazed mug read as brushed metal.
 */

/** Matches the laptop's PRESENCE; see laptop.tsx. */
export const PROP_SCALE = 1.45;

type Disposable = { dispose(): void };

/** Disposes everything in a memoised bundle of geometries, materials and textures. */
function useDisposeAll(items: Disposable[]) {
  useEffect(() => () => items.forEach((d) => d.dispose()), [items]);
}

// ======================================================================= books

interface BookSpec {
  length: number;
  width: number;
  thickness: number;
  cover: string;
  rotation: number;
  offset: [number, number];
}

const BOOKS: BookSpec[] = [
  { length: 0.3, width: 0.225, thickness: 0.034, cover: '#1f2a44', rotation: 0.05, offset: [0, 0] },
  { length: 0.28, width: 0.21, thickness: 0.042, cover: '#5a1f24', rotation: -0.08, offset: [0.01, -0.004] },
  { length: 0.26, width: 0.19, thickness: 0.026, cover: '#1f3a2e', rotation: 0.11, offset: [-0.006, 0.006] },
  { length: 0.245, width: 0.175, thickness: 0.03, cover: '#8a7a5c', rotation: -0.02, offset: [0.004, 0.002] },
  { length: 0.22, width: 0.155, thickness: 0.02, cover: '#2a2a30', rotation: 0.16, offset: [-0.004, -0.006] },
];

/**
 * A book lying flat, spine facing +z (toward camera).
 *
 * Built the way a hardback is: two thin boards and a spine wrapped round a
 * page block that stops 3mm short of the head, tail and fore-edge. That
 * overhang, and the striped page edges it exposes, is what makes it a book
 * and not a coloured brick.
 */
function book(spec: BookSpec, y: number) {
  const { length: L, width: W, thickness: T, cover } = spec;
  const board = 0.0025;
  const inset = 0.003;
  const placement = { position: [spec.offset[0], y, spec.offset[1]], rotation: [0, spec.rotation, 0] } as const;
  const bake = (g: THREE.BufferGeometry) => place(g, placement);

  const covers = [
    roundedBox(L, board, W, 0.001, { position: [0, board / 2, 0] }),
    roundedBox(L, board, W, 0.001, { position: [0, T - board / 2, 0] }),
    // A rounded spine, slightly proud of the boards.
    roundedBox(L, T, 0.008, 0.004, { position: [0, T / 2, W / 2 - 0.003] }),
  ].map((g) => bake(tint(g, cover)));

  const pages = bake(
    roundedBox(L - inset * 2, T - board * 2, W - inset - 0.006, 0.001, {
      position: [0, T / 2, -inset / 2 + 0.0015],
    }),
  );

  // Foil: a title block and two rules across the spine.
  const foil = [
    roundedBox(L * 0.26, T * 0.24, 0.0012, 0.0005, { position: [-L * 0.08, T / 2, W / 2 + 0.001] }),
    roundedBox(0.006, T * 0.62, 0.0012, 0.0005, { position: [L / 2 - 0.028, T / 2, W / 2 + 0.001] }),
    roundedBox(0.006, T * 0.62, 0.0012, 0.0005, { position: [-L / 2 + 0.028, T / 2, W / 2 + 0.001] }),
  ].map(bake);

  return { covers, pages, foil };
}

export function Books({ env }: { env: THREE.Texture }) {
  const bundle = useMemo(() => {
    let y = 0;
    const built = BOOKS.map((spec) => {
      const b = book(spec, y);
      y += spec.thickness;
      return b;
    });

    const pageMap = pageEdgeTexture();
    const materials = {
      cover: new THREE.MeshStandardMaterial({
        vertexColors: true,
        // Book cloth takes light softly; the multiplier keeps saturated
        // covers from glowing under the desk lamp's warm fill.
        color: '#a6a6a6',
        roughness: 0.78,
        envMap: env,
        envMapIntensity: 0.12,
      }),
      pages: new THREE.MeshStandardMaterial({
        map: pageMap,
        color: '#b9b0a0',
        roughness: 0.92,
        envMap: env,
        envMapIntensity: 0.08,
      }),
      foil: new THREE.MeshStandardMaterial({
        color: '#c9a45c',
        metalness: 1,
        roughness: 0.32,
        envMap: env,
        envMapIntensity: 0.6,
      }),
    };
    const geometries = {
      cover: merge(built.flatMap((b) => b.covers)),
      pages: merge(built.map((b) => b.pages)),
      foil: merge(built.flatMap((b) => b.foil)),
    };
    return { materials, geometries, all: [pageMap, ...Object.values(materials), ...Object.values(geometries)] };
  }, [env]);
  useDisposeAll(bundle.all);

  const { materials: m, geometries: g } = bundle;
  return (
    <group scale={PROP_SCALE}>
      <mesh geometry={g.cover} material={m.cover} castShadow receiveShadow />
      <mesh geometry={g.pages} material={m.pages} castShadow receiveShadow />
      <mesh geometry={g.foil} material={m.foil} />
    </group>
  );
}

// ========================================================================= mug

const MUG_HEIGHT = 0.096;
const COFFEE_Y = 0.078;

function lathe(profile: Array<[number, number]>, segments = 48) {
  return new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
}

const STEAM_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Two wisps of rising noise, faded at every edge. */
const STEAM_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  void main() {
    vec2 p = vUv;
    // The column sways more the higher it rises, as warm air does.
    p.x += sin(p.y * 5.0 + uTime * 0.9 + uSeed) * 0.12 * p.y;
    float n = noise(vec2(p.x * 3.5, p.y * 2.2 - uTime * 0.45 + uSeed));
    n *= noise(vec2(p.x * 7.0 + 3.1, p.y * 4.0 - uTime * 0.7));
    float column = smoothstep(0.5, 0.0, abs(p.x - 0.5));
    float fade = smoothstep(0.0, 0.18, p.y) * smoothstep(1.0, 0.35, p.y);
    gl_FragColor = vec4(vec3(0.82, 0.86, 0.95), n * column * fade * 0.55);
  }
`;

export function Mug({ env, still = false }: { env: THREE.Texture; still?: boolean }) {
  const bundle = useMemo(() => {
    // One continuous profile: foot ring, belly, rolled lip, then down the
    // inside wall. A lathe gives the wall real thickness at the rim, which is
    // where you actually see that a mug is a mug.
    const body = lathe([
      [0, 0.002],
      [0.03, 0.002],
      [0.032, 0],
      [0.036, 0.001],
      [0.0395, 0.006],
      [0.0415, 0.03],
      [0.0425, 0.07],
      [0.0428, MUG_HEIGHT - 0.003],
      [0.0422, MUG_HEIGHT],
      [0.0395, MUG_HEIGHT - 0.0005],
      [0.0388, MUG_HEIGHT - 0.004],
      [0.0382, 0.03],
      [0.0368, 0.01],
      [0, 0.008],
    ]);

    // D-shaped handle: a tube along a closed-ish curve, attached at two points.
    const handle = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.04, 0.078, 0),
        new THREE.Vector3(0.062, 0.08, 0),
        new THREE.Vector3(0.071, 0.06, 0),
        new THREE.Vector3(0.068, 0.032, 0),
        new THREE.Vector3(0.056, 0.022, 0),
        new THREE.Vector3(0.04, 0.024, 0),
      ]),
      40,
      0.0055,
      10,
      false,
    );

    const coffee = place(new THREE.CircleGeometry(0.0384, 40), {
      position: [0, COFFEE_Y, 0],
      rotation: [-Math.PI / 2, 0, 0],
    });

    const materials = {
      // Deep glaze: a clearcoat over a darker, rougher body, like fired ceramic.
      glaze: new THREE.MeshPhysicalMaterial({
        color: '#23262d',
        roughness: 0.6,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMap: env,
        envMapIntensity: 0.22,
      }),
      coffee: new THREE.MeshPhysicalMaterial({
        color: '#2a160a',
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMap: env,
        envMapIntensity: 0.5,
      }),
    };

    const geometries = { glaze: merge([body, handle]), coffee };
    const wisp = new THREE.PlaneGeometry(0.05, 0.12);
    const steamMaterials = [0, 1].map(
      (i) =>
        new THREE.ShaderMaterial({
          vertexShader: STEAM_VERTEX,
          fragmentShader: STEAM_FRAGMENT,
          uniforms: { uTime: { value: 0 }, uSeed: { value: i * 17.3 } },
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
    );
    return {
      materials,
      geometries,
      wisp,
      steamMaterials,
      all: [...Object.values(materials), ...Object.values(geometries), wisp, ...steamMaterials],
    };
  }, [env]);
  useDisposeAll(bundle.all);

  useFrame((_, delta) => {
    if (still) return;
    for (const m of bundle.steamMaterials) m.uniforms.uTime!.value += delta;
  });

  const { materials: m, geometries: g } = bundle;
  return (
    // Handle turned toward the camera's right, where it reads as a handle.
    <group scale={PROP_SCALE} rotation={[0, -0.7, 0]}>
      <mesh geometry={g.glaze} material={m.glaze} castShadow receiveShadow />
      <mesh geometry={g.coffee} material={m.coffee} />
      {/* Crossed planes rather than a billboard: from any angle one of them
          is side-on enough to read as a column of steam. */}
      {bundle.steamMaterials.map((mat, i) => (
        <mesh
          key={i}
          geometry={bundle.wisp}
          material={mat}
          position={[0, COFFEE_Y + 0.064, 0]}
          rotation={[0, i * (Math.PI / 2), 0]}
          renderOrder={2}
        />
      ))}
    </group>
  );
}

// ======================================================================= plant

const SOIL_Y = 0.104;

interface LeafSpec {
  height: number;
  width: number;
  azimuth: number;
  lean: number;
  twist: number;
  base: [number, number];
}

/**
 * One sword leaf as a ribbon with a V cross-section (a raised midrib), so it
 * has visible thickness at grazing angles and a highlight down its centre.
 * Width swells from a narrow base and tapers to a point; the blade leans out
 * along a quadratic curve and twists as it rises.
 */
function leaf(spec: LeafSpec): THREE.BufferGeometry {
  const rows = 20;
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];

  const outward = new THREE.Vector3(Math.cos(spec.azimuth), 0, Math.sin(spec.azimuth));
  const up = new THREE.Vector3(0, 1, 0);
  const across = new THREE.Vector3();
  const facing = new THREE.Vector3();
  const center = new THREE.Vector3();

  for (let i = 0; i <= rows; i += 1) {
    const t = i / rows;
    center
      .set(spec.base[0], SOIL_Y - 0.01, spec.base[1])
      .addScaledVector(up, spec.height * t)
      .addScaledVector(outward, spec.lean * t * t);

    const w =
      spec.width *
      (0.35 + 0.65 * THREE.MathUtils.smoothstep(t, 0, 0.22)) *
      (1 - 0.96 * THREE.MathUtils.smoothstep(t, 0.45, 1));

    const angle = spec.azimuth + Math.PI / 2 + spec.twist * t;
    across.set(Math.cos(angle), 0, Math.sin(angle));
    facing.crossVectors(across, up).normalize();

    const left = center.clone().addScaledVector(across, -w / 2);
    const mid = center.clone().addScaledVector(facing, w * 0.14);
    const right = center.clone().addScaledVector(across, w / 2);
    positions.push(...left.toArray(), ...mid.toArray(), ...right.toArray());
    uvs.push(0, t, 0.5, t, 1, t);

    if (i > 0) {
      const a = (i - 1) * 3;
      const b = i * 3;
      index.push(a, b, a + 1, a + 1, b, b + 1, a + 1, b + 1, a + 2, a + 2, b + 1, b + 2);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

export function Plant({ env }: { env: THREE.Texture }) {
  const bundle = useMemo(() => {
    const rand = mulberry32(21);
    const leaves: LeafSpec[] = Array.from({ length: 11 }, (_, i) => {
      const azimuth = (i / 11) * Math.PI * 2 + rand() * 0.5;
      const r = 0.012 + rand() * 0.028;
      // Inner leaves stand tallest and straightest, outer ones lean further.
      const inner = r < 0.024;
      return {
        azimuth,
        base: [Math.cos(azimuth) * r, Math.sin(azimuth) * r],
        height: inner ? 0.36 + rand() * 0.12 : 0.24 + rand() * 0.1,
        width: 0.034 + rand() * 0.016,
        lean: inner ? 0.02 + rand() * 0.03 : 0.06 + rand() * 0.06,
        twist: (rand() - 0.5) * 1.6,
      };
    });

    // Tapered ceramic pot with a rolled rim, soil set just below it.
    const pot = lathe([
      [0, 0.003],
      [0.05, 0.003],
      [0.053, 0],
      [0.058, 0.004],
      [0.066, 0.1],
      [0.07, 0.112],
      [0.0708, 0.118],
      [0.0684, 0.1205],
      [0.066, 0.114],
      [0.063, SOIL_Y],
      [0.06, SOIL_Y - 0.004],
      [0, SOIL_Y - 0.004],
    ]);
    const soil = place(new THREE.CircleGeometry(0.0632, 36), {
      position: [0, SOIL_Y, 0],
      rotation: [-Math.PI / 2, 0, 0],
    });

    const leafMap = snakeLeafTexture();
    const soilMap = soilTexture();
    const materials = {
      // Charcoal stone, not white. A white pot was the brightest thing at the
      // edge of frame and pulled the eye off the subject; even mid-grey read
      // as white, because the right end of the desk collects the rim light,
      // the ambient and the hemisphere fill together.
      pot: new THREE.MeshStandardMaterial({
        color: '#42403c',
        roughness: 0.82,
        envMap: env,
        envMapIntensity: 0.15,
      }),
      soil: new THREE.MeshStandardMaterial({ map: soilMap, roughness: 1 }),
      // Snake plant leaves are waxy; a fairly low roughness gives them the
      // long specular streak that sells them as succulent rather than paper.
      leaf: new THREE.MeshStandardMaterial({
        map: leafMap,
        roughness: 0.42,
        side: THREE.DoubleSide,
        envMap: env,
        envMapIntensity: 0.18,
      }),
    };
    const geometries = { pot, soil, leaves: merge(leaves.map(leaf)) };
    return {
      materials,
      geometries,
      all: [leafMap, soilMap, ...Object.values(materials), ...Object.values(geometries)],
    };
  }, [env]);
  useDisposeAll(bundle.all);

  const { materials: m, geometries: g } = bundle;
  return (
    <group scale={PROP_SCALE}>
      <mesh geometry={g.pot} material={m.pot} castShadow receiveShadow />
      <mesh geometry={g.soil} material={m.soil} receiveShadow />
      <mesh geometry={g.leaves} material={m.leaf} castShadow />
    </group>
  );
}
