import * as THREE from 'three';
import { WALNUT_AVERAGE, walnutPixels, type WalnutPixels } from './walnut-grain';

/**
 * Procedural textures for the set pieces.
 *
 * Generated rather than shipped: a walnut texture pair and a mesh weave would
 * be ~1.5MB of image downloads for surfaces that sit in the dark at the edge
 * of frame. The weave is a few hundred canvas fills and costs next to
 * nothing. The walnut is a per-pixel noise field (~80ms), so it is generated
 * in a worker; see `loadWalnutMaps`.
 */

function canvas(width: number, height: number) {
  const el = document.createElement('canvas');
  el.width = width;
  el.height = height;
  const ctx = el.getContext('2d');
  if (!ctx) throw new Error('set-textures: 2D canvas unavailable');
  return { el, ctx };
}

export interface WoodMaps {
  map: THREE.Texture;
  roughnessMap: THREE.Texture;
}

const WOOD_SIZE = { width: 1024, height: 512 } as const;

function dataTexture(data: Uint8Array, width: number, height: number, srgb: boolean) {
  const t = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.UnsignedByteType);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  // DataTexture defaults to nearest filtering with no mipmaps, which would
  // shimmer badly on a surface seen at a grazing angle.
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

function toMaps({ color, roughness, width, height }: WalnutPixels): WoodMaps {
  return {
    map: dataTexture(color, width, height, true),
    roughnessMap: dataTexture(roughness, width, height, false),
  };
}

/**
 * 1×1 maps at the grain's average colour and roughness.
 *
 * The material is created with these so it already has both map slots filled:
 * swapping one texture for another is free, but going from no map to a map
 * changes the shader's defines and forces a recompile mid-scene.
 */
export function placeholderWoodMaps(): WoodMaps {
  const [r, g, b] = WALNUT_AVERAGE.color;
  const rough = Math.round(WALNUT_AVERAGE.roughness * 255);
  return toMaps({
    width: 1,
    height: 1,
    color: new Uint8Array([r, g, b, 255]),
    roughness: new Uint8Array([rough, rough, rough, 255]),
  });
}

/**
 * Generates the walnut maps in a worker and hands them over when ready
 * (~100ms after mount). Returns a cancel function.
 *
 * Falls back to the main thread only if a worker cannot be started, deferred
 * past the current task so it at least does not extend it.
 */
export function loadWalnutMaps(onReady: (maps: WoodMaps) => void): () => void {
  let cancelled = false;
  let worker: Worker | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const deliver = (pixels: WalnutPixels) => {
    if (!cancelled) onReady(toMaps(pixels));
  };
  const fallback = () => {
    worker?.terminate();
    worker = undefined;
    timer = setTimeout(() => deliver(walnutPixels(WOOD_SIZE.width, WOOD_SIZE.height)), 0);
  };

  try {
    worker = new Worker(new URL('./walnut.worker.ts', import.meta.url));
    worker.onmessage = (e: MessageEvent<WalnutPixels>) => {
      deliver(e.data);
      worker?.terminate();
      worker = undefined;
    };
    worker.onerror = fallback;
    worker.postMessage(WOOD_SIZE);
  } catch {
    fallback();
  }

  return () => {
    cancelled = true;
    worker?.terminate();
    if (timer) clearTimeout(timer);
  };
}

/**
 * Chair-back silhouette in normalised space: x ∈ [-0.5, 0.5], y ∈ [0, 1].
 *
 * Shared by the mesh texture and the frame tube so the weave always ends
 * exactly at the frame. Pinched at the lumbar, widest across the shoulders.
 */
export const BACK_OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [0, 0.0],
  [0.34, 0.012],
  [0.42, 0.09],
  [0.4, 0.3],
  [0.455, 0.6],
  [0.47, 0.84],
  [0.41, 0.975],
  [0, 1.0],
  [-0.41, 0.975],
  [-0.47, 0.84],
  [-0.455, 0.6],
  [-0.4, 0.3],
  [-0.42, 0.09],
  [-0.34, 0.012],
];

/** The outline as a smooth closed curve, sampled evenly. */
export function backOutlinePoints(samples = 220): THREE.Vector2[] {
  const curve = new THREE.CatmullRomCurve3(
    BACK_OUTLINE.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    true,
    'centripetal',
  );
  return curve.getSpacedPoints(samples).map((p) => new THREE.Vector2(p.x, p.y));
}

/**
 * Tensioned mesh weave for the chair back, with alpha.
 *
 * A mesh back is what makes a modern task chair read as one — and, for this
 * frame specifically, it stops the chair behind the subject being a solid
 * black mass that merges with a charcoal suit. The city shows through it.
 */
export function meshWeaveTexture(size = 1024): THREE.CanvasTexture {
  const { el, ctx } = canvas(size, size);
  const outline = backOutlinePoints();

  const path = new Path2D();
  outline.forEach((p, i) => {
    const px = (p.x + 0.5) * size;
    const py = (1 - p.y) * size;
    if (i === 0) path.moveTo(px, py);
    else path.lineTo(px, py);
  });
  path.closePath();

  ctx.save();
  ctx.clip(path);

  // The gaps: mostly see-through.
  ctx.fillStyle = 'rgba(22, 24, 32, 0.28)';
  ctx.fillRect(0, 0, size, size);

  // Weft runs across, warp runs up; the weft is the heavier strand, as in real
  // elastomeric mesh, which is what gives it direction under a highlight.
  const pitch = 5;
  ctx.fillStyle = 'rgba(38, 41, 54, 0.9)';
  for (let y = 0; y < size; y += pitch) ctx.fillRect(0, y, size, 2);
  ctx.fillStyle = 'rgba(30, 33, 44, 0.62)';
  for (let x = 0; x < size; x += pitch) ctx.fillRect(x, 0, 1.4, size);
  ctx.restore();

  // Where the mesh is gripped by the frame it bunches and turns opaque.
  ctx.strokeStyle = 'rgba(16, 17, 23, 0.96)';
  ctx.lineWidth = 16;
  ctx.stroke(path);

  const texture = new THREE.CanvasTexture(el);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Deterministic PRNG so every visit draws the same props. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function finish(el: HTMLCanvasElement, srgb = true): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(el);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Page edges: fine horizontal layers with irregular tone, the way a book's
 * page block reads side-on. Lines run across the canvas, varying along V,
 * which is the height axis on every side face of a rounded box.
 */
export function pageEdgeTexture(): THREE.CanvasTexture {
  const { el, ctx } = canvas(64, 256);
  const rand = mulberry32(11);
  ctx.fillStyle = '#e6dcc8';
  ctx.fillRect(0, 0, 64, 256);
  for (let y = 0; y < 256; y += 2) {
    const shade = 200 + Math.floor(rand() * 40);
    ctx.fillStyle = `rgba(${shade - 30}, ${shade - 40}, ${shade - 58}, ${0.25 + rand() * 0.35})`;
    ctx.fillRect(0, y, 64, 1);
  }
  return finish(el);
}

/**
 * Sansevieria leaf: dark green with the pale transverse banding the plant is
 * recognised by, and the yellow margin of the 'Laurentii' variety. U runs
 * across the blade, V from base to tip.
 */
export function snakeLeafTexture(): THREE.CanvasTexture {
  const w = 128;
  const h = 512;
  const { el, ctx } = canvas(w, h);
  const rand = mulberry32(5);

  ctx.fillStyle = '#16301d';
  ctx.fillRect(0, 0, w, h);

  // Wavy transverse bands.
  for (let y = 0; y < h; y += 7 + rand() * 9) {
    ctx.beginPath();
    const amp = 2 + rand() * 4;
    const phase = rand() * Math.PI * 2;
    for (let x = 0; x <= w; x += 4) {
      const yy = y + Math.sin(x * 0.09 + phase) * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.strokeStyle = `rgba(104, 136, 98, ${0.18 + rand() * 0.24})`;
    ctx.lineWidth = 1.5 + rand() * 2.5;
    ctx.stroke();
  }

  // Midrib shading and the yellow margins.
  const across = ctx.createLinearGradient(0, 0, w, 0);
  // The margin is a thin line on the real plant; wider, the whole blade reads cream.
  across.addColorStop(0, 'rgba(184, 170, 80, 0.95)');
  across.addColorStop(0.035, 'rgba(160, 156, 76, 0.55)');
  across.addColorStop(0.06, 'rgba(0, 0, 0, 0)');
  across.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
  across.addColorStop(0.94, 'rgba(0, 0, 0, 0)');
  across.addColorStop(0.965, 'rgba(160, 156, 76, 0.55)');
  across.addColorStop(1, 'rgba(184, 170, 80, 0.95)');
  ctx.fillStyle = across;
  ctx.fillRect(0, 0, w, h);

  // Browned, dried tip, as real snake plants almost always have.
  const tip = ctx.createLinearGradient(0, 0, 0, 40);
  tip.addColorStop(0, 'rgba(120, 96, 60, 0.9)');
  tip.addColorStop(1, 'rgba(120, 96, 60, 0)');
  ctx.fillStyle = tip;
  ctx.fillRect(0, 0, w, 40);

  return finish(el);
}

/** Potting soil: dark, speckled with perlite. */
export function soilTexture(): THREE.CanvasTexture {
  const { el, ctx } = canvas(128, 128);
  const rand = mulberry32(3);
  ctx.fillStyle = '#20150e';
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 900; i += 1) {
    const light = rand() < 0.06;
    ctx.fillStyle = light
      ? `rgba(220, 214, 200, ${0.5 + rand() * 0.4})`
      : `rgba(${50 + rand() * 40}, ${34 + rand() * 24}, ${22 + rand() * 14}, 0.8)`;
    const s = light ? 1.5 : 1 + rand() * 2.5;
    ctx.fillRect(rand() * 128, rand() * 128, s, s);
  }
  return finish(el);
}

/**
 * A strategy sketch in marker, for the glass board: a growth curve on axes, a
 * three-stage funnel and a small flow of boxes and arrows, with scribbled
 * notes. Drawn as an emissive map, so the marker glows on dark glass.
 *
 * Strokes are hand-drawn rather than ruled: each line is subdivided and pushed
 * off course by a small drift, and overshoots its end slightly, the way a
 * marker does. That wobble is what reads as handwriting from across the room;
 * perfectly straight bars (what the board had before) read as a glitch.
 */
export function boardSketchTexture(): THREE.CanvasTexture {
  const W = 1536;
  const H = 848;
  const { el, ctx } = canvas(W, H);
  const rand = mulberry32(8);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const CYAN = 'rgba(110, 242, 255, 0.95)';
  const WHITE = 'rgba(225, 236, 255, 0.85)';
  const AMBER = 'rgba(255, 196, 120, 0.9)';

  /** A wobbly polyline through the given points. */
  const stroke = (pts: Array<[number, number]>, color: string, width = 5) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    let drift = 0;
    pts.forEach(([x, y], i) => {
      if (i === 0) {
        ctx.moveTo(x, y);
        return;
      }
      const [px, py] = pts[i - 1]!;
      const len = Math.hypot(x - px, y - py);
      const steps = Math.max(2, Math.round(len / 24));
      const nx = -(y - py) / (len || 1);
      const ny = (x - px) / (len || 1);
      for (let s = 1; s <= steps; s += 1) {
        const t = s / steps;
        drift = drift * 0.7 + (rand() - 0.5) * 2.2;
        // Overshoot the final point a touch, as a marker does.
        const over = i === pts.length - 1 && s === steps ? 1.04 : 1;
        ctx.lineTo(px + (x - px) * t * over + nx * drift, py + (y - py) * t * over + ny * drift);
      }
    });
    ctx.stroke();
  };

  /** A line of "handwriting": short connected loops of varying height. */
  const scribble = (x: number, y: number, length: number, color: string, size = 14) => {
    const pts: Array<[number, number]> = [];
    let cx = x;
    while (cx < x + length) {
      const word = 30 + rand() * 60;
      for (let w = 0; w < word; w += 7) {
        pts.push([cx + w, y - rand() * size * (w % 14 < 7 ? 1 : 0.35)]);
      }
      stroke(pts.splice(0), color, 3.5);
      cx += word + 14 + rand() * 12;
    }
  };

  const box = (x: number, y: number, w: number, h: number, color: string) =>
    stroke([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y + 2]], color, 4.5);

  const arrow = (x0: number, y0: number, x1: number, y1: number, color: string) => {
    stroke([[x0, y0], [x1, y1]], color, 4.5);
    const a = Math.atan2(y1 - y0, x1 - x0);
    const head = (d: number) => [x1 - 22 * Math.cos(a + d), y1 - 22 * Math.sin(a + d)] as [number, number];
    stroke([head(0.45), [x1, y1], head(-0.45)], color, 4.5);
  };

  // -- Left: growth curve on axes, with a circled inflection point.
  scribble(90, 110, 330, WHITE, 18);
  stroke([[110, 170], [110, 560], [620, 560]], WHITE, 5);
  const curve: Array<[number, number]> = [];
  for (let i = 0; i <= 20; i += 1) {
    const t = i / 20;
    curve.push([130 + t * 470, 540 - 360 * Math.pow(t, 2.4)]);
  }
  stroke(curve, CYAN, 7);
  const cx = 130 + 0.62 * 470;
  const cy = 540 - 360 * Math.pow(0.62, 2.4);
  const ring: Array<[number, number]> = [];
  for (let i = 0; i <= 26; i += 1) {
    const a = (i / 24) * Math.PI * 2;
    ring.push([cx + Math.cos(a) * 42, cy + Math.sin(a) * 30]);
  }
  stroke(ring, AMBER, 4);
  scribble(cx + 60, cy + 12, 150, AMBER, 12);
  for (let i = 0; i < 3; i += 1) scribble(130, 610 + i * 44, 300 + rand() * 120, WHITE, 12);

  // -- Middle: a three-stage funnel.
  const fx = 760;
  const bands: Array<[number, number]> = [
    [300, 90],
    [230, 70],
    [150, 55],
  ];
  let fy = 190;
  bands.forEach(([w, h], i) => {
    const next = bands[i + 1]?.[0] ?? w * 0.6;
    stroke([[fx - w / 2, fy], [fx + w / 2, fy], [fx + next / 2, fy + h], [fx - next / 2, fy + h], [fx - w / 2, fy + 2]], i === 2 ? CYAN : WHITE, 4.5);
    scribble(fx + w / 2 + 30, fy + h / 2 + 6, 120, WHITE, 11);
    fy += h + 18;
  });
  arrow(fx, fy, fx, fy + 90, CYAN);
  scribble(fx - 70, fy + 140, 150, CYAN, 14);

  // -- Right: a small flow, boxes and arrows.
  box(1110, 170, 170, 90, WHITE);
  box(1110, 360, 170, 90, CYAN);
  box(1320, 360, 150, 90, WHITE);
  arrow(1195, 265, 1195, 350, WHITE);
  arrow(1285, 405, 1312, 405, WHITE);
  scribble(1128, 222, 120, WHITE, 11);
  scribble(1128, 412, 120, CYAN, 11);
  scribble(1335, 412, 100, WHITE, 11);
  stroke([[1090, 520], [1480, 520]], WHITE, 3);
  for (let i = 0; i < 4; i += 1) scribble(1100, 580 + i * 46, 220 + rand() * 150, WHITE, 12);

  return finish(el);
}
