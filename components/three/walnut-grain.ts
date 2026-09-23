/**
 * Walnut grain as raw pixels. Pure maths: no DOM, no three.js, so it runs
 * unchanged inside `walnut.worker.ts`.
 *
 * Grain runs along x (the desk's length). Four layers, the way flat-sawn
 * walnut actually looks: a broad "cathedral" figure where growth rings are cut
 * at a shallow angle and arch, fine grain lines that wander along the board,
 * open pores stretched into streaks, and a low-frequency tone shift that stops
 * the slab looking printed. Roughness follows the grain: the dark lines are
 * slightly rougher, so the lacquer highlight breaks up across them instead of
 * sitting on the surface like plastic.
 */

export interface WalnutPixels {
  width: number;
  height: number;
  /** RGBA, sRGB. */
  color: Uint8Array;
  /** RGBA, roughness in every channel (three samples G). */
  roughness: Uint8Array;
}

/**
 * Integer hash → [0, 1).
 *
 * The usual `fract(sin(x) * 43758)` shader hash costs a `Math.sin` per call,
 * and at twenty calls per pixel that alone made the texture take ~230ms to
 * generate. Integer mixing is several times cheaper and just as uniform.
 */
function hash(x: number, y: number): number {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smooth 2D value noise in [0, 1]. */
function noise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

const LIGHT = [90, 60, 42] as const;
const DARK = [36, 23, 15] as const;

export function walnutPixels(width = 1024, height = 512): WalnutPixels {
  const color = new Uint8Array(width * height * 4);
  const roughness = new Uint8Array(width * height * 4);

  // Depends on x alone; hoisted out of the pixel loop.
  const sway = new Float32Array(width);
  for (let x = 0; x < width; x += 1) sway[x] = 34 * Math.sin(x * 0.0029);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cathedral =
        0.5 + 0.5 * Math.sin((y + 70 * noise(x * 0.0021, y * 0.004) + sway[x]!) * 0.05);

      // The warp needs a strong gradient *across* the board, not just along
      // it: a warp that shifts neighbouring lines together keeps their
      // spacing, and evenly spaced lines read as ruled paper, not timber.
      const line =
        0.5 +
        0.5 *
          Math.sin(
            (y + 22 * noise(x * 0.0038, y * 0.032) + 9 * noise(x * 0.019, y * 0.07)) * 0.5,
          );
      // Sharpened into thin dark lines rather than broad bands.
      const l3 = line * line * line;
      const lines = l3 * l3;

      // Pores are elongated along the grain: slow in x, fast in y.
      const pores = noise(x * 0.04 + 3.7, y * 0.7);
      const tone = noise(x * 0.0016 + 7.1, y * 0.0032);

      const t = Math.min(1, 0.34 * cathedral + 0.2 * lines + 0.2 * pores + 0.3 * tone);
      const i = (y * width + x) * 4;
      color[i] = LIGHT[0] + (DARK[0] - LIGHT[0]) * t;
      color[i + 1] = LIGHT[1] + (DARK[1] - LIGHT[1]) * t;
      color[i + 2] = LIGHT[2] + (DARK[2] - LIGHT[2]) * t;
      color[i + 3] = 255;

      const r = 255 * (0.4 + 0.16 * lines + 0.14 * pores);
      roughness[i] = roughness[i + 1] = roughness[i + 2] = r;
      roughness[i + 3] = 255;
    }
  }

  return { width, height, color, roughness };
}

/** Flat stand-ins used until the real maps arrive: the grain's average values. */
export const WALNUT_AVERAGE = { color: [62, 41, 28], roughness: 0.5 } as const;
