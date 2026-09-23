/**
 * Turns the static character scan into a skinned, rigged GLB.
 *
 * The supplied mesh has POSITION/NORMAL/TEXCOORD_0 and nothing else — no
 * skeleton, no weights, no morph targets. This script adds a humanoid skeleton
 * and computes skin weights, so the figure can turn its head toward the cursor
 * and breathe from the spine instead of being scaled bodily.
 *
 * WHY THIS WORKS ON THIS MODEL AND NOT THE LAST ONE
 * An earlier export stood with hands in pockets and arms flush to the torso.
 * Weight solvers cannot separate what was scanned as one surface, so bending an
 * elbow smeared the jacket. This export is a relaxed A-pose: slicing the mesh
 * horizontally shows three distinct X clusters (arm / torso / arm) from
 * y=-0.165 to y=+0.309, which is exactly the air gap a solver needs.
 *
 * SKINNING METHOD
 * Bone-envelope weighting. For each vertex, distance to each bone's segment is
 * mapped through a compact falloff, the best few influences are kept and
 * normalised. Envelopes (rather than raw inverse distance) are what stop a
 * shoulder vertex picking up the far arm.
 *
 * Two corrections matter:
 *  - Limb sidedness. Left-arm and right-arm envelopes overlap across the chest,
 *    so limb bones reject vertices on the opposite side of the body outright.
 *  - Head/neck blend. The head is the one joint that must look right, so its
 *    weight is a smoothstep up the neck rather than a distance falloff, giving
 *    a clean vertical gradient instead of a spherical one.
 *
 * Usage: node scripts/rig-character.mjs <source.glb> [out.glb]
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, quantize, textureCompress, weld } from '@gltf-transform/functions';
import { enhanceCharacter } from './lib/enhance-character.mjs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { statSync } = require('fs');

const SRC = process.argv[2];
const OUT = process.argv[3] ?? 'public/models/archit.glb';
if (!SRC) {
  console.error('usage: node scripts/rig-character.mjs <source.glb> [out.glb]');
  process.exit(1);
}

// ---------------------------------------------------------------- skeleton
/**
 * Joint positions in model space, derived from the horizontal slice analysis
 * of this mesh (see the landmarks in docs/ARCHITECTURE.md §9). `r` is the
 * envelope radius: how far the bone's influence reaches.
 *
 * Re-measure these if the source model is replaced.
 */
const SKELETON = [
  { name: 'hips',       parent: null,        pos: [0, -0.06, 0],        r: 0.26 },
  { name: 'spine',      parent: 'hips',      pos: [0, 0.12, 0],         r: 0.26 },
  { name: 'chest',      parent: 'spine',     pos: [0, 0.36, 0],         r: 0.30 },
  { name: 'neck',       parent: 'chest',     pos: [0, 0.62, 0],         r: 0.12 },
  { name: 'head',       parent: 'neck',      pos: [0, 0.70, 0],         r: 0.20, tail: [0, 0.95, 0] },

  { name: 'shoulderL',  parent: 'chest',     pos: [-0.10, 0.55, 0],     r: 0.13, side: -1 },
  { name: 'upperArmL',  parent: 'shoulderL', pos: [-0.25, 0.52, 0],     r: 0.11, side: -1 },
  { name: 'lowerArmL',  parent: 'upperArmL', pos: [-0.30, 0.24, 0],     r: 0.09, side: -1 },
  { name: 'handL',      parent: 'lowerArmL', pos: [-0.37, -0.05, 0],    r: 0.09, side: -1, tail: [-0.38, -0.19, 0] },

  { name: 'shoulderR',  parent: 'chest',     pos: [0.10, 0.55, 0],      r: 0.13, side: 1 },
  { name: 'upperArmR',  parent: 'shoulderR', pos: [0.25, 0.52, 0],      r: 0.11, side: 1 },
  { name: 'lowerArmR',  parent: 'upperArmR', pos: [0.30, 0.24, 0],      r: 0.09, side: 1 },
  { name: 'handR',      parent: 'lowerArmR', pos: [0.37, -0.05, 0],     r: 0.09, side: 1, tail: [0.38, -0.19, 0] },

  { name: 'upperLegL',  parent: 'hips',      pos: [-0.09, -0.06, 0],    r: 0.15, side: -1 },
  { name: 'lowerLegL',  parent: 'upperLegL', pos: [-0.13, -0.41, 0],    r: 0.13, side: -1 },
  { name: 'footL',      parent: 'lowerLegL', pos: [-0.17, -0.88, 0],    r: 0.13, side: -1, tail: [-0.18, -0.95, 0.09] },

  { name: 'upperLegR',  parent: 'hips',      pos: [0.09, -0.06, 0],     r: 0.15, side: 1 },
  { name: 'lowerLegR',  parent: 'upperLegR', pos: [0.13, -0.41, 0],     r: 0.13, side: 1 },
  { name: 'footR',      parent: 'lowerLegR', pos: [0.17, -0.88, 0],     r: 0.13, side: 1, tail: [0.18, -0.95, 0.09] },
];

/** Neck blend band: below is all chest, above is all head. */
const NECK_BOTTOM = 0.60;
const NECK_TOP = 0.74;
/** Limb bones ignore vertices this far onto the opposite side of the body. */
const SIDE_MARGIN = 0.03;
const MAX_INFLUENCES = 4;

const byName = new Map(SKELETON.map((b) => [b.name, b]));
const children = new Map(SKELETON.map((b) => [b.name, []]));
for (const b of SKELETON) if (b.parent) children.get(b.parent).push(b.name);

/** Each bone's influence segment: its own joint to its first child (or tail). */
for (const b of SKELETON) {
  const kids = children.get(b.name);
  b.segEnd = b.tail ?? (kids.length ? byName.get(kids[0]).pos : b.pos);
}

const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Squared distance from point p to segment ab. */
function distToSegment(p, a, b) {
  const abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2];
  const apx = p[0] - a[0], apy = p[1] - a[1], apz = p[2] - a[2];
  const len2 = abx * abx + aby * aby + abz * abz;
  const t = len2 > 0 ? Math.min(1, Math.max(0, (apx * abx + apy * aby + apz * abz) / len2)) : 0;
  const dx = apx - abx * t, dy = apy - aby * t, dz = apz - abz * t;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ---------------------------------------------------------------- document
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(SRC);
const root = doc.getRoot();
const scene = root.listScenes()[0];
const meshNode = root.listNodes().find((n) => n.getMesh());
const mesh = meshNode.getMesh();
const prim = mesh.listPrimitives()[0];
const position = prim.getAttribute('POSITION');
const positions = position.getArray();
const vertexCount = position.getCount();

// ------------------------------------------------------------- bone nodes
const nodes = new Map();
for (const b of SKELETON) {
  const node = doc.createNode(b.name);
  const parentPos = b.parent ? byName.get(b.parent).pos : [0, 0, 0];
  // glTF node translations are relative to the parent joint.
  node.setTranslation([b.pos[0] - parentPos[0], b.pos[1] - parentPos[1], b.pos[2] - parentPos[2]]);
  nodes.set(b.name, node);
}
for (const b of SKELETON) {
  if (b.parent) nodes.get(b.parent).addChild(nodes.get(b.name));
  else scene.addChild(nodes.get(b.name));
}

// --------------------------------------------------------------- weighting
const joints = new Uint16Array(vertexCount * MAX_INFLUENCES);
const weights = new Float32Array(vertexCount * MAX_INFLUENCES);
const index = new Map(SKELETON.map((b, i) => [b.name, i]));
const stats = new Map(SKELETON.map((b) => [b.name, 0]));

for (let v = 0; v < vertexCount; v++) {
  const p = [positions[v * 3], positions[v * 3 + 1], positions[v * 3 + 2]];
  const candidates = [];

  for (const b of SKELETON) {
    // A left-arm envelope reaches across the chest to right-side vertices;
    // rejecting the opposite side outright is cheaper and safer than tuning
    // radii small enough to avoid it.
    if (b.side && Math.sign(p[0]) !== b.side && Math.abs(p[0]) > SIDE_MARGIN) continue;

    let w;
    if (b.name === 'head') {
      // The one joint that has to look right: a vertical gradient up the neck
      // reads as a head turning, where a spherical falloff shears the jaw.
      w = smoothstep(NECK_BOTTOM, NECK_TOP, p[1]);
    } else if (b.name === 'neck') {
      w = smoothstep(NECK_BOTTOM - 0.1, NECK_BOTTOM + 0.04, p[1]) * (1 - smoothstep(NECK_BOTTOM, NECK_TOP, p[1]));
    } else {
      const d = distToSegment(p, b.pos, b.segEnd);
      if (d >= b.r) continue;
      const t = 1 - (d / b.r) * (d / b.r);
      w = t * t;
      // Nothing below the neck should claim head vertices.
      if (p[1] > NECK_BOTTOM) w *= 1 - smoothstep(NECK_BOTTOM, NECK_TOP, p[1]);
    }

    if (w > 1e-4) candidates.push([index.get(b.name), w, b.name]);
  }

  // Orphans (inside no envelope) fall back to the nearest bone outright.
  if (!candidates.length) {
    let best = null;
    for (const b of SKELETON) {
      if (b.side && Math.sign(p[0]) !== b.side && Math.abs(p[0]) > SIDE_MARGIN) continue;
      const d = distToSegment(p, b.pos, b.segEnd);
      if (!best || d < best[1]) best = [index.get(b.name), d, b.name];
    }
    candidates.push([best[0], 1, best[2]]);
  }

  candidates.sort((a, b) => b[1] - a[1]);
  const kept = candidates.slice(0, MAX_INFLUENCES);
  const total = kept.reduce((s, c) => s + c[1], 0);
  kept.forEach((c, i) => {
    joints[v * MAX_INFLUENCES + i] = c[0];
    weights[v * MAX_INFLUENCES + i] = c[1] / total;
  });
  stats.set(kept[0][2], stats.get(kept[0][2]) + 1);
}

prim.setAttribute('JOINTS_0', doc.createAccessor().setType('VEC4').setArray(joints));
prim.setAttribute('WEIGHTS_0', doc.createAccessor().setType('VEC4').setArray(weights));

// ------------------------------------------------------------------- skin
// Bind pose is the rest pose, so each inverse bind matrix is just a
// translation by the negated world joint position.
const ibm = new Float32Array(SKELETON.length * 16);
SKELETON.forEach((b, i) => {
  const m = [1,0,0,0, 0,1,0,0, 0,0,1,0, -b.pos[0], -b.pos[1], -b.pos[2], 1];
  ibm.set(m, i * 16);
});

const skin = doc.createSkin('archit-rig');
SKELETON.forEach((b) => skin.addJoint(nodes.get(b.name)));
skin.setSkeleton(nodes.get('hips'));
skin.setInverseBindMatrices(doc.createAccessor().setType('MAT4').setArray(ibm));
meshNode.setSkin(skin);

// ---------------------------------------------------------------- realism
// Per-region materials, skin tone and a face projected from the reference
// photo; see scripts/lib/enhance-character.mjs.
//
// Landmarks were read off an orthographic front render of this mesh (model
// units) and off assets/reference/head-front.png (pixels): eye centres, nose
// tip, mouth centre, chin. Re-measure them if the source model changes. The
// ellipse is in photo pixels and sits just inside the hairline and jaw.
const FACE = {
  image: 'assets/reference/head-front.png',
  landmarks: [
    { model: [-0.0367, 0.7885], photo: [100, 168.8] },
    { model: [0.0311, 0.7893], photo: [168.8, 165.5] },
    { model: [-0.0011, 0.7467], photo: [132.5, 206.3] },
    { model: [-0.0011, 0.724], photo: [131.3, 235] },
    { model: [0, 0.6733], photo: [137.5, 295] },
  ],
  ellipse: { cx: 136, cy: 220, rx: 62, ry: 90 },
};

if (!process.env.NO_ENHANCE) {
  const report = await enhanceCharacter({
    doc,
    prim,
    material: prim.getMaterial(),
    sharp,
    face: FACE,
    debugDir: process.env.ENHANCE_DEBUG,
  });
  console.log('realism pass:', JSON.stringify(report));
}

// --------------------------------------------------- textures + geometry
// Textures go to 2048² — higher than the earlier pass, because the head takes
// only a small slice of UV space and 1024² left the face visibly soft at 2x
// DPR. WebP keeps all three maps under half a megabyte even at that size.
//
// The weight is really in the vertex data (position + normal + uv + joints +
// weights across 38k vertices), so quantization does the heavy lifting.
// As with the laptop: no Draco, so no wasm decoder is fetched at runtime.
await doc.transform(
  dedup(),
  weld(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [2048, 2048], quality: 90 }),
  quantize({
    quantizePosition: 14,
    quantizeNormal: 10,
    quantizeTexcoord: 12,
    quantizeWeight: 16,
  }),
);

await io.write(OUT, doc);

console.log(`bones ${SKELETON.length}  vertices ${vertexCount}`);
console.log('dominant bone per vertex:');
for (const [name, n] of [...stats].filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${name.padEnd(11)} ${String(n).padStart(6)}  ${((n / vertexCount) * 100).toFixed(1)}%`);
}
console.log(
  `${(statSync(SRC).size / 1048576).toFixed(2)}MB -> ${(statSync(OUT).size / 1048576).toFixed(2)}MB`,
);
