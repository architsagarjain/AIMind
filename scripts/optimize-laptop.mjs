/**
 * Prepares the supplied MacBook GLB for the web.
 *
 * The source export is ~10MB: roughly 7MB of float32 geometry across 121k
 * vertices and 2.8MB of PNG textures. That is fine for a turntable render and
 * far too heavy for a hero asset, so this does three things:
 *
 *  1. Swaps the macOS wallpaper on the screen for the ARCHIT.OS texture. The
 *     screen is what the scroll cinematic flies into, so it should not be a
 *     stock desktop. Baked in rather than drawn at runtime because the quad
 *     already has UVs — no extra geometry, no canvas upload, no per-frame cost.
 *  2. Compresses textures (resize + WebP).
 *  3. Quantizes vertex attributes from float32 to integers.
 *
 * Quantization rather than Draco is deliberate. Draco needs a ~200KB wasm
 * decoder fetched at runtime (drei defaults to a Google CDN, which is an
 * external dependency on every page load). `KHR_mesh_quantization` is decoded
 * natively by three with no decoder at all, and gets most of the saving.
 *
 * The screen source lives in `assets/`, not `public/` — it is an input to
 * this script, not something the site serves.
 *
 * Usage: node scripts/optimize-laptop.mjs <source.glb> [out.glb] [screen.png]
 */
import { createRequire } from 'module';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, quantize, textureCompress, weld } from '@gltf-transform/functions';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { readFileSync, statSync } = require('fs');

const SRC = process.argv[2];
const OUT = process.argv[3] ?? 'public/models/macbook.glb';
const SCREEN = process.argv[4] ?? 'assets/screen.png';

if (!SRC) {
  console.error('usage: node scripts/optimize-laptop.mjs <source.glb> [out.glb] [screen.png]');
  process.exit(1);
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(SRC);
const root = doc.getRoot();

// --- 1. Replace the screen wallpaper ---------------------------------------
// The display is the only material carrying an emissive texture; the model
// drives it at emissiveStrength 8 so it reads as a lit panel.
const screenMats = root.listMaterials().filter((m) => m.getEmissiveTexture());
if (screenMats.length !== 1) {
  console.warn(`expected exactly 1 emissive material, found ${screenMats.length}`);
}
for (const mat of screenMats) {
  const tex = mat.getEmissiveTexture();

  // The screen UVs run bottom-up relative to the image, so the texture has to
  // be flipped before baking. Symptom when it is not: every glyph is upside
  // down while the reading order stays correct ("Projects" -> "bɿojɘcƚƨ"), and
  // the menu bar renders along the bottom edge.
  const flipped = await sharp(readFileSync(SCREEN)).flip().png().toBuffer();
  tex.setImage(flipped).setMimeType('image/png').setName('archit-os-screen');

  // 8 blows out to pure white under ACES; this keeps the UI legible on the dive.
  const strength = mat.getExtension('KHR_materials_emissive_strength');
  if (strength) strength.setEmissiveStrength(2.2);
  mat.setEmissiveFactor([1, 1, 1]);

  // The panel ships as metal 0.9 / rough 0.1, i.e. a mirror. Against a point
  // light that is two blown specular blobs across the UI at exactly the moment
  // the camera arrives. An emissive display should not be reflective.
  mat.setMetallicFactor(0).setRoughnessFactor(0.42);

  console.log(`screen material: ${mat.getName()} -> ARCHIT.OS (flipped, matte)`);
}

const before = statSync(SRC).size;

// --- 2 & 3. Clean up, compress, quantize -----------------------------------
await doc.transform(
  dedup(),
  prune({ keepAttributes: false }),
  weld(),
  textureCompress({
    encoder: sharp,
    targetFormat: 'webp',
    resize: [1024, 1024],
    quality: 82,
  }),
  // Explicit bit depths: 14-bit positions keep the panel gaps and key edges
  // crisp, while normals and UVs tolerate less without visible error.
  quantize({
    quantizePosition: 14,
    quantizeNormal: 10,
    quantizeTexcoord: 12,
  }),
);

await io.write(OUT, doc);

const after = statSync(OUT).size;
const verts = root
  .listMeshes()
  .flatMap((m) => m.listPrimitives())
  .reduce((n, p) => n + p.getAttribute('POSITION').getCount(), 0);

console.log(`meshes ${root.listMeshes().length}  verts ${verts}  textures ${root.listTextures().length}`);
console.log(
  `${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB  (-${(100 - (after / before) * 100).toFixed(0)}%)`,
);
