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
