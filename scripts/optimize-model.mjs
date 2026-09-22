/**
 * Repacks a GLB with smaller textures.
 *
 * Geometry is untouched. Each embedded image is resized and re-encoded, then
 * every bufferView is relaid out contiguously with 4-byte alignment (accessors
 * require it) and the JSON/BIN chunks are rebuilt with their own padding.
 *
 * The supplied character model was 4.21MB, ~3MB of which was three 2048²
 * JPEGs; at 1024² it is 1.44MB with no visible loss at hero size.
 *
 * Re-run this whenever the source model is replaced — do not commit a raw
 * export straight into public/.
 */
import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

// sharp ships as CJS with Next; createRequire avoids an ESM interop shim.
const sharp = createRequire(import.meta.url)('sharp');

// Usage: node scripts/optimize-model.mjs <source.glb> [out.glb] [size]
const SRC = process.argv[2];
const OUT = process.argv[3] ?? 'public/models/archit.glb';
const SIZE = Number(process.argv[4] ?? 1024);

if (!SRC) {
  console.error('usage: node scripts/optimize-model.mjs <source.glb> [out.glb] [size]');
  process.exit(1);
}

const buf = readFileSync(SRC);
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.toString('utf8', 20, 20 + jsonLen));
const binStart = 20 + jsonLen + 8;
const bin = buf.subarray(binStart, binStart + buf.readUInt32LE(20 + jsonLen));

const viewData = json.bufferViews.map((bv) =>
  Buffer.from(bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength)),
);

// Resize each image in place.
for (let i = 0; i < json.images.length; i++) {
  const idx = json.images[i].bufferView;
  const before = viewData[idx].length;
  // Normal maps tolerate JPEG poorly, so they keep more quality than albedo.
  const isNormal = json.materials.some((m) => m.normalTexture?.index === i);
  viewData[idx] = await sharp(viewData[idx])
    .resize(SIZE, SIZE, { fit: 'fill' })
    .jpeg({ quality: isNormal ? 90 : 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer();
  console.log(`image[${i}]${isNormal ? ' (normal)' : ''} ${(before / 1024).toFixed(0)}KB -> ${(viewData[idx].length / 1024).toFixed(0)}KB`);
}

// Relay out the binary chunk, keeping accessors valid via 4-byte alignment.
const parts = [];
let offset = 0;
json.bufferViews.forEach((bv, i) => {
  const pad = (4 - (offset % 4)) % 4;
  if (pad) { parts.push(Buffer.alloc(pad)); offset += pad; }
  bv.byteOffset = offset;
  bv.byteLength = viewData[i].length;
  parts.push(viewData[i]);
  offset += viewData[i].length;
});
const newBin = Buffer.concat(parts);
json.buffers[0].byteLength = newBin.length;
json.asset.generator = `${json.asset.generator} + texture repack (${SIZE}px)`;

// Reassemble: 12-byte header, padded JSON chunk, padded BIN chunk.
let jsonBuf = Buffer.from(JSON.stringify(json), 'utf8');
if (jsonBuf.length % 4) jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc(4 - (jsonBuf.length % 4), 0x20)]);
let binBuf = newBin;
if (binBuf.length % 4) binBuf = Buffer.concat([binBuf, Buffer.alloc(4 - (binBuf.length % 4))]);

const total = 12 + 8 + jsonBuf.length + 8 + binBuf.length;
const header = Buffer.alloc(12);
header.write('glTF', 0, 'ascii'); header.writeUInt32LE(2, 4); header.writeUInt32LE(total, 8);
const jsonHdr = Buffer.alloc(8); jsonHdr.writeUInt32LE(jsonBuf.length, 0); jsonHdr.write('JSON', 4, 'ascii');
const binHdr = Buffer.alloc(8); binHdr.writeUInt32LE(binBuf.length, 0); binHdr.write('BIN\0', 4, 'ascii');

writeFileSync(OUT, Buffer.concat([header, jsonHdr, jsonBuf, binHdr, binBuf]));
console.log(`\n${(buf.length / 1048576).toFixed(2)}MB -> ${(total / 1048576).toFixed(2)}MB`);
