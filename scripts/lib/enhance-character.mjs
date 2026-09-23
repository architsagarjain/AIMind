/**
 * Realism pass for the character, run by rig-character.mjs before the
 * textures are compressed.
 *
 * The Meshy export has one material and a single flat response: roughness
 * ~0.64 everywhere, no metal, no sheen, so skin, wool, silk and leather all
 * reflect light identically, which is most of what makes it read as a figurine.
 * Its face is also a soft, low-detail guess with lighter skin than the real
 * person. This pass:
 *
 *  1. Rasterises every triangle into texture space, so each texel knows its
 *     position and normal on the body.
 *  2. Classifies texels into skin, hair, suit, shirt, tie and shoes by colour
 *     AND position (hair, suit and shoes are all near-black; height is what
 *     separates them).
 *  3. Matches the skin tone to the reference photo (Lab mean/std transfer).
 *  4. Projects the reference front-head photo onto the face, aligned by a
 *     least-squares affine fit on five landmarks, blended by how squarely each
 *     texel faces the camera and feathered to an ellipse inside the hairline.
 *     Because the projection is a function of 3D position, it stays
 *     continuous across the atlas's many separate face islands.
 *  5. Writes per-region roughness, a sheen colour map (wool, silk, hair, and a
 *     warm skin rim standing in for subsurface scattering) and a clearcoat mask
 *     (polished shoes), as glTF extensions three.js loads natively.
 */
import { KHRMaterialsClearcoat, KHRMaterialsSheen } from '@gltf-transform/extensions';

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// ------------------------------------------------------------- colour maths
function rgbToHsv(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d > 1e-6) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function rgbToLab(r, g, b) {
  const R = toLin(r);
  const G = toLin(g);
  const B = toLin(b);
  const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047;
  const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  const Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
function labToRgb(L, a, b) {
  const fy = (L + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;
  const inv = (t) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787);
  const X = inv(fx) * 0.95047;
  const Y = inv(fy);
  const Z = inv(fz) * 1.08883;
  const R = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  const G = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  const B = 0.0557 * X - 0.204 * Y + 1.057 * Z;
  return [toSrgb(clamp01(R)), toSrgb(clamp01(G)), toSrgb(clamp01(B))];
}

// ---------------------------------------------------------------- regions
export const REGION = { none: 0, skin: 1, hair: 2, suit: 3, shirt: 4, tie: 5, shoes: 6 };

/** Region from the texel's original colour and its place on the body. */
function classify(r, g, b, x, y) {
  const [h, s, v] = rgbToHsv(r, g, b);
  const head = y > 0.655;
  if (v > 0.3 && s > 0.13 && s < 0.8 && (h < 48 || h > 345) && r >= g && g >= b * 0.85) {
    // Warm and saturated. Below the head, a deep red on the chest is the tie.
    if (!head && Math.abs(x) < 0.09 && y > 0.15 && s > 0.45 && v < 0.7) return REGION.tie;
    return REGION.skin;
  }
  if (!head && (h < 20 || h > 330) && s > 0.4 && v > 0.1 && Math.abs(x) < 0.09 && y > 0.15) return REGION.tie;
  // White: the collar below the jaw, teeth and eye whites above it.
  if (v > 0.72 && s < 0.2) return head && y > 0.7 ? REGION.skin : REGION.shirt;
  if (y < -0.8) return REGION.shoes;
  if (head) return REGION.hair;
  return REGION.suit;
}

/** Roughness, sheen colour (sRGB 0–1) and clearcoat per region. */
const SURFACE = {
  [REGION.skin]: { rough: 0.5, sheen: [0.42, 0.2, 0.15], coat: 0 },
  // Rough with a strong sheen: glossier than this and it reads as a moulded helmet.
  [REGION.hair]: { rough: 0.7, sheen: [0.3, 0.26, 0.24], coat: 0 },
  [REGION.suit]: { rough: 0.8, sheen: [0.19, 0.21, 0.26], coat: 0 },
  [REGION.shirt]: { rough: 0.62, sheen: [0.22, 0.22, 0.24], coat: 0 },
  [REGION.tie]: { rough: 0.4, sheen: [0.4, 0.12, 0.18], coat: 0 },
  [REGION.shoes]: { rough: 0.24, sheen: [0, 0, 0], coat: 1 },
  [REGION.none]: { rough: 0.7, sheen: [0, 0, 0], coat: 0 },
};

// ------------------------------------------------------------ rasteriser
/**
 * For every texel covered by a triangle: its interpolated position and
 * normal, and which texels are covered at all.
 */
function rasterise(pos, nrm, uv, idx, W, H) {
  const P = new Float32Array(W * H * 3);
  const N = new Float32Array(W * H * 3);
  const covered = new Uint8Array(W * H);
  const triCount = idx ? idx.length / 3 : pos.length / 9;
  for (let t = 0; t < triCount; t++) {
    const i0 = idx ? idx[t * 3] : t * 3;
    const i1 = idx ? idx[t * 3 + 1] : t * 3 + 1;
    const i2 = idx ? idx[t * 3 + 2] : t * 3 + 2;
    const x0 = uv[i0 * 2] * W - 0.5, y0 = uv[i0 * 2 + 1] * H - 0.5;
    const x1 = uv[i1 * 2] * W - 0.5, y1 = uv[i1 * 2 + 1] * H - 0.5;
    const x2 = uv[i2 * 2] * W - 0.5, y2 = uv[i2 * 2 + 1] * H - 0.5;
    const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
    if (Math.abs(area) < 1e-9) continue;
    const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2)));
    const maxX = Math.min(W - 1, Math.ceil(Math.max(x0, x1, x2)));
    const minY = Math.max(0, Math.floor(Math.min(y0, y1, y2)));
    const maxY = Math.min(H - 1, Math.ceil(Math.max(y0, y1, y2)));
    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const w0 = ((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)) / area;
        const w1 = ((x2 - px) * (y0 - py) - (x0 - px) * (y2 - py)) / area;
        const w2 = 1 - w0 - w1;
        if (w0 < -1e-4 || w1 < -1e-4 || w2 < -1e-4) continue;
        const o = py * W + px;
        covered[o] = 1;
        for (let k = 0; k < 3; k++) {
          P[o * 3 + k] = w0 * pos[i0 * 3 + k] + w1 * pos[i1 * 3 + k] + w2 * pos[i2 * 3 + k];
          N[o * 3 + k] = w0 * nrm[i0 * 3 + k] + w1 * nrm[i1 * 3 + k] + w2 * nrm[i2 * 3 + k];
        }
      }
    }
  }
  return { P, N, covered };
}

/**
 * Pushes edited colours outward into uncovered texels. Island borders are
 * sampled by bilinear filtering and mipmaps; left at their original colour
 * they would draw a thin seam of the old skin round every edited island.
 */
function dilate(buf, channels, covered, W, H, passes) {
  let mask = covered.slice();
  for (let pass = 0; pass < passes; pass++) {
    const next = mask.slice();
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const o = y * W + x;
        if (mask[o]) continue;
        let n = 0;
        const acc = [0, 0, 0, 0];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
          const q = yy * W + xx;
          if (!mask[q]) continue;
          for (let c = 0; c < channels; c++) acc[c] += buf[q * channels + c];
          n++;
        }
        if (!n) continue;
        for (let c = 0; c < channels; c++) buf[o * channels + c] = acc[c] / n;
        next[o] = 1;
      }
    }
    mask = next;
  }
}

// ------------------------------------------------------------ projection
/** Least-squares affine map from model (x, y) to photo (u, v). */
function fitAffine(pairs) {
  // Solve [x y 1] * [a b c]^T = u (and likewise v) via the normal equations.
  const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const U = [0, 0, 0];
  const V = [0, 0, 0];
  for (const { model: [x, y], photo: [u, v] } of pairs) {
    const row = [x, y, 1];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) M[i][j] += row[i] * row[j];
      U[i] += row[i] * u;
      V[i] += row[i] * v;
    }
  }
  const solve = (A, bv) => {
    const m = A.map((r, i) => [...r, bv[i]]);
    for (let c = 0; c < 3; c++) {
      let p = c;
      for (let r = c + 1; r < 3; r++) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r;
      [m[c], m[p]] = [m[p], m[c]];
      for (let r = 0; r < 3; r++) {
        if (r === c) continue;
        const f = m[r][c] / m[c][c];
        for (let k = c; k < 4; k++) m[r][k] -= f * m[c][k];
      }
    }
    return m.map((r, i) => r[3] / r[i]);
  };
  const [a, b, c] = solve(M, U);
  const [d, e, f] = solve(M, V);
  return { map: (x, y) => [a * x + b * y + c, d * x + e * y + f], residual: pairs.map(({ model: [x, y], photo: [u, v] }) => Math.hypot(a * x + b * y + c - u, d * x + e * y + f - v)) };
}

function sampleBilinear(img, W, H, u, v) {
  const x = Math.min(W - 1.001, Math.max(0, u - 0.5));
  const y = Math.min(H - 1.001, Math.max(0, v - 0.5));
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  const px = (xx, yy, c) => img[(yy * W + xx) * 4 + c] / 255;
  const out = [0, 0, 0];
  for (let c = 0; c < 3; c++) {
    const top = px(x0, y0, c) * (1 - fx) + px(x0 + 1, y0, c) * fx;
    const bot = px(x0, y0 + 1, c) * (1 - fx) + px(x0 + 1, y0 + 1, c) * fx;
    out[c] = top * (1 - fy) + bot * fy;
  }
  return out;
}

// ------------------------------------------------------------------ main
/**
 * @param {object} o
 * @param {import('@gltf-transform/core').Document} o.doc
 * @param {import('@gltf-transform/core').Primitive} o.prim
 * @param {import('@gltf-transform/core').Material} o.material
 * @param {any} o.sharp
 * @param {{ image: string, landmarks: Array<{ model: [number, number], photo: [number, number] }>, ellipse: { cx: number, cy: number, rx: number, ry: number } }} o.face
 * @param {string} [o.debugDir] writes region / weight maps here when set
 */
export async function enhanceCharacter({ doc, prim, material, sharp, face, debugDir }) {
  const baseTex = material.getBaseColorTexture();
  const { data: base, info } = await sharp(Buffer.from(baseTex.getImage()))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;

  const pos = prim.getAttribute('POSITION').getArray();
  const nrm = prim.getAttribute('NORMAL').getArray();
  const uv = prim.getAttribute('TEXCOORD_0').getArray();
  const idx = prim.getIndices()?.getArray() ?? null;
  const { P, N, covered } = rasterise(pos, nrm, uv, idx, W, H);

  // --- regions
  const region = new Uint8Array(W * H);
  for (let o = 0; o < W * H; o++) {
    if (!covered[o]) continue;
    region[o] = classify(base[o * 4] / 255, base[o * 4 + 1] / 255, base[o * 4 + 2] / 255, P[o * 3], P[o * 3 + 1]);
  }

  // --- reference photo, its skin statistics, and the projection
  const { data: photo, info: pinfo } = await sharp(face.image).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const PW = pinfo.width;
  const PH = pinfo.height;
  const inEllipse = (u, v) => ((u - face.ellipse.cx) / face.ellipse.rx) ** 2 + ((v - face.ellipse.cy) / face.ellipse.ry) ** 2;
  const refLab = [];
  for (let v = 0; v < PH; v++) {
    for (let u = 0; u < PW; u++) {
      if (inEllipse(u, v) > 0.7) continue;
      const o = (v * PW + u) * 4;
      const [h, s, val] = rgbToHsv(photo[o] / 255, photo[o + 1] / 255, photo[o + 2] / 255);
      // Skin only: not the eyes, brows, teeth or the dark stubble line.
      if (val < 0.35 || val > 0.92 || s < 0.15 || !(h < 45 || h > 345)) continue;
      refLab.push(rgbToLab(photo[o] / 255, photo[o + 1] / 255, photo[o + 2] / 255));
    }
  }
  const modelLab = [];
  for (let o = 0; o < W * H; o += 3) {
    if (region[o] !== REGION.skin) continue;
    const [, s, v] = rgbToHsv(base[o * 4] / 255, base[o * 4 + 1] / 255, base[o * 4 + 2] / 255);
    if (v < 0.35 || v > 0.92 || s < 0.15) continue;
    modelLab.push(rgbToLab(base[o * 4] / 255, base[o * 4 + 1] / 255, base[o * 4 + 2] / 255));
  }
  const stats = (arr) => {
    const m = [0, 1, 2].map((k) => arr.reduce((s, p) => s + p[k], 0) / arr.length);
    const sd = [0, 1, 2].map((k) => Math.sqrt(arr.reduce((s, p) => s + (p[k] - m[k]) ** 2, 0) / arr.length) || 1);
    return { m, sd };
  };
  const ref = stats(refLab);
  const mod = stats(modelLab);

  const { map: toPhoto, residual } = fitAffine(face.landmarks);

  const out = Buffer.from(base);
  const weightDebug = debugDir ? new Uint8Array(W * H) : null;
  let projected = 0;
  for (let o = 0; o < W * H; o++) {
    if (region[o] !== REGION.skin) continue;
    const r = base[o * 4] / 255, g = base[o * 4 + 1] / 255, b = base[o * 4 + 2] / 255;
    // Tone: chroma fully to the reference, lightness most of the way, so the
    // hands and neck agree with the projected face.
    const [L, A, B] = rgbToLab(r, g, b);
    // Mostly a mean shift. Spread ratios are capped: the photo's skin varies
    // more (stubble, studio shading), and scaling by the full ratio turned the
    // model's faint texture noise into forehead blotches and pushed its
    // desaturated neck shadow toward grey-green.
    const k = [0, 1, 2].map((c) => Math.min(1.05, Math.max(0.85, ref.sd[c] / mod.sd[c])));
    const target = [0, 1, 2].map((c) => ref.m[c] + ([L, A, B][c] - mod.m[c]) * k[c]);
    // Gated by saturation, so teeth and eye whites are left alone; pushed
    // through a skin-chroma shift, white comes out cyan.
    const sat = rgbToHsv(r, g, b)[1];
    const tw = smooth(0.08, 0.2, sat);
    const lab = [L + (target[0] - L) * 0.8 * tw, A + (target[1] - A) * tw, B + (target[2] - B) * tw];
    let [nr, ng, nb] = labToRgb(...lab);

    // Face: project the photo where the surface faces the camera.
    const x = P[o * 3], y = P[o * 3 + 1];
    const nz = N[o * 3 + 2] / (Math.hypot(N[o * 3], N[o * 3 + 1], N[o * 3 + 2]) || 1);
    if (y > 0.64) {
      const [pu, pv] = toPhoto(x, y);
      const e = inEllipse(pu, pv);
      // Square-on surfaces only: at oblique angles a flat projection smears
      // the photo's temples and hair across the side of the head.
      const w = smooth(0.42, 0.78, nz) * (1 - smooth(0.5, 0.95, e));
      if (w > 0) {
        const [pr, pg, pb] = sampleBilinear(photo, PW, PH, pu, pv);
        nr += (pr - nr) * w;
        ng += (pg - ng) * w;
        nb += (pb - nb) * w;
        projected++;
        if (weightDebug) weightDebug[o] = Math.round(w * 255);
      }
    }
    out[o * 4] = Math.round(nr * 255);
    out[o * 4 + 1] = Math.round(ng * 255);
    out[o * 4 + 2] = Math.round(nb * 255);
  }
  dilate(out, 4, covered, W, H, 6);

  // --- PBR maps
  const mr = Buffer.alloc(W * H * 4);
  const sheen = Buffer.alloc(W * H * 4);
  const coat = Buffer.alloc(W * H * 4);
  let seed = 7;
  const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * 0.06;
  for (let o = 0; o < W * H; o++) {
    const s = SURFACE[region[o]];
    mr[o * 4] = 255; // occlusion channel unused
    mr[o * 4 + 1] = Math.round(clamp01(s.rough + noise()) * 255);
    mr[o * 4 + 2] = 0; // no metal anywhere on a person
    mr[o * 4 + 3] = 255;
    for (let c = 0; c < 3; c++) sheen[o * 4 + c] = Math.round(s.sheen[c] * 255);
    sheen[o * 4 + 3] = 255;
    coat[o * 4] = coat[o * 4 + 1] = coat[o * 4 + 2] = s.coat * 255;
    coat[o * 4 + 3] = 255;
  }
  dilate(mr, 4, covered, W, H, 6);
  dilate(sheen, 4, covered, W, H, 6);
  dilate(coat, 4, covered, W, H, 6);

  const png = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  baseTex.setImage(await png(out)).setMimeType('image/png');

  const mrTex = material.getMetallicRoughnessTexture() ?? doc.createTexture('metal-rough');
  mrTex.setImage(await png(mr)).setMimeType('image/png');
  material.setMetallicRoughnessTexture(mrTex).setMetallicFactor(1).setRoughnessFactor(1);

  const sheenTex = doc.createTexture('sheen').setImage(await png(sheen)).setMimeType('image/png');
  const sheenExt = doc.createExtension(KHRMaterialsSheen);
  material.setExtension(
    'KHR_materials_sheen',
    sheenExt.createSheen().setSheenColorFactor([1, 1, 1]).setSheenColorTexture(sheenTex).setSheenRoughnessFactor(0.55),
  );

  // The clearcoat mask only needs to find the shoes; a quarter size is plenty.
  const coatPng = await sharp(coat, { raw: { width: W, height: H, channels: 4 } }).resize(Math.round(W / 4)).png().toBuffer();
  const coatTex = doc.createTexture('clearcoat').setImage(coatPng).setMimeType('image/png');
  const ccExt = doc.createExtension(KHRMaterialsClearcoat);
  material.setExtension(
    'KHR_materials_clearcoat',
    ccExt.createClearcoat().setClearcoatFactor(1).setClearcoatTexture(coatTex).setClearcoatRoughnessFactor(0.12),
  );

  if (debugDir) {
    const palette = [[0, 0, 0], [240, 170, 140], [60, 40, 20], [40, 60, 120], [240, 240, 240], [180, 20, 40], [20, 200, 80]];
    const rm = Buffer.alloc(W * H * 3);
    for (let o = 0; o < W * H; o++) rm.set(palette[region[o]], o * 3);
    await sharp(rm, { raw: { width: W, height: H, channels: 3 } }).resize(1024).png().toFile(`${debugDir}/regions.png`);
    await sharp(Buffer.from(weightDebug), { raw: { width: W, height: H, channels: 1 } }).resize(1024).png().toFile(`${debugDir}/face-weight.png`);
  }

  const counts = Object.fromEntries(Object.keys(REGION).map((k) => [k, 0]));
  for (let o = 0; o < W * H; o++) if (covered[o]) counts[Object.keys(REGION)[region[o]]]++;
  return {
    texture: `${W}x${H}`,
    landmarkResidualPx: residual.map((r) => +r.toFixed(2)),
    skinLab: { model: mod.m.map((v) => +v.toFixed(1)), reference: ref.m.map((v) => +v.toFixed(1)) },
    projectedTexels: projected,
    regions: counts,
  };
}
