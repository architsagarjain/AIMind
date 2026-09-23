import * as THREE from 'three';
import { paintWallpaper } from '@/components/desktop/wallpaper';
import {
  LOCK_HINT,
  LOCK_INITIALS,
  LOCK_NAME,
  LOCK_STATS,
  formatLockDate,
  formatLockTime,
} from '@/lib/lock-screen';

/**
 * The laptop's screen: the ARCHIT.OS lock screen, drawn live on a canvas.
 *
 * It used to be an image baked into the GLB, which had two problems. The
 * numbers on it were typed in by hand and went stale when the CV arrived, and
 * a baked clock could never show the visitor's actual time, which matters
 * because the dive lands on the full-screen lock screen with a live clock, and
 * a time that jumps on arrival gives the trick away. Drawn here, it reads the
 * same content as everything else and redraws once a minute: one 1280×800
 * texture upload a minute, which is nothing.
 *
 * Layout mirrors components/hero/boot-sequence.tsx. Nothing sits in the top
 * ~6% of the canvas, where the model's camera notch covers the panel.
 */

const W = 1280;
const H = 800;
const INK = '11, 26, 51';

function fontStack(): string {
  // next/font renames families ("__Inter_Tight_…"); the CSS variable holds the real name.
  const inter =
    typeof document !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue('--font-inter-tight').trim()
      : '';
  return `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", ${inter || 'sans-serif'}, sans-serif`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Frosted-glass panel, as macOS draws widgets and pills on the lock screen. */
function glass(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.save();
  ctx.shadowColor = `rgba(${INK}, 0.10)`;
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fill();
  ctx.restore();
  roundRect(ctx, x + 0.75, y + 0.75, w - 1.5, h - 1.5, r);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function tracking(ctx: CanvasRenderingContext2D, px: number) {
  // Not in every engine yet; without it text is simply untracked.
  if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = `${px}px`;
}

export function drawLockScreen(ctx: CanvasRenderingContext2D, now: Date) {
  const font = fontStack();
  ctx.clearRect(0, 0, W, H);
  paintWallpaper(ctx, W, H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Date, then the clock: large, heavy and slightly tight, as a lock screen sets it.
  tracking(ctx, 0.5);
  ctx.font = `600 27px ${font}`;
  ctx.fillStyle = `rgba(${INK}, 0.6)`;
  ctx.fillText(formatLockDate(now), W / 2, 142);

  tracking(ctx, -6);
  ctx.font = `700 188px ${font}`;
  ctx.fillStyle = `rgba(${INK}, 0.84)`;
  ctx.fillText(formatLockTime(now), W / 2, 318);

  // Stat widgets.
  const tileW = 196;
  const tileH = 88;
  const gap = 16;
  const rowW = LOCK_STATS.length * tileW + (LOCK_STATS.length - 1) * gap;
  LOCK_STATS.forEach((s, i) => {
    const x = (W - rowW) / 2 + i * (tileW + gap);
    const y = 372;
    glass(ctx, x, y, tileW, tileH, 20);
    tracking(ctx, -0.5);
    ctx.font = `800 33px ${font}`;
    ctx.fillStyle = '#0a6f93';
    ctx.fillText(s.value, x + tileW / 2, y + 45);
    tracking(ctx, 1.4);
    ctx.font = `600 11.5px ${font}`;
    ctx.fillStyle = `rgba(${INK}, 0.55)`;
    ctx.fillText(s.label.toUpperCase(), x + tileW / 2, y + 70, tileW - 20);
  });

  // Avatar: monogram in the brand gradient, inside the ring that fills as the
  // full-screen version unlocks. Here it waits, empty.
  const cx = W / 2;
  const cy = 590;
  const avatar = ctx.createLinearGradient(cx - 48, cy - 48, cx + 48, cy + 48);
  avatar.addColorStop(0, '#1d9bf0');
  avatar.addColorStop(1, '#5e5ce6');
  ctx.beginPath();
  ctx.arc(cx, cy, 48, 0, Math.PI * 2);
  ctx.fillStyle = avatar;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 57, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 3;
  ctx.stroke();
  tracking(ctx, 0);
  ctx.font = `700 36px ${font}`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(LOCK_INITIALS, cx, cy + 1);
  ctx.textBaseline = 'alphabetic';

  ctx.font = `600 24px ${font}`;
  ctx.fillStyle = `rgba(${INK}, 0.86)`;
  ctx.fillText(LOCK_NAME, cx, 682);

  // Hint pill with a chevron.
  tracking(ctx, 0.3);
  ctx.font = `500 16px ${font}`;
  const hintW = ctx.measureText(LOCK_HINT).width + 64;
  glass(ctx, cx - hintW / 2, 710, hintW, 40, 20);
  ctx.fillStyle = `rgba(${INK}, 0.66)`;
  ctx.fillText(LOCK_HINT, cx + 10, 736);
  ctx.beginPath();
  const chevX = cx - hintW / 2 + 26;
  ctx.moveTo(chevX - 6, 727);
  ctx.lineTo(chevX, 733);
  ctx.lineTo(chevX + 6, 727);
  ctx.strokeStyle = `rgba(${INK}, 0.6)`;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

export interface LockScreenTexture {
  texture: THREE.CanvasTexture;
  dispose(): void;
}

/** A live lock-screen texture. Redraws on each minute boundary and once fonts have loaded. */
export function createLockScreenTexture(): LockScreenTexture {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('lock-screen-texture: 2D canvas unavailable');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  // The screen's UVs run bottom-up relative to the image; the old baked
  // texture had to be flipped by hand for exactly this reason (see
  // scripts/optimize-laptop.mjs). A canvas gets that from flipY, which is
  // three's default for canvas textures but is stated here on purpose.
  texture.flipY = true;
  texture.anisotropy = 8;

  let disposed = false;
  const draw = () => {
    if (disposed) return;
    drawLockScreen(ctx, new Date());
    texture.needsUpdate = true;
  };
  draw();

  // The first draw may use a fallback face; redraw once the real one is in.
  document.fonts?.ready.then(draw).catch(() => {});

  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    const ms = 60_000 - (Date.now() % 60_000) + 50;
    timer = setTimeout(() => {
      draw();
      schedule();
    }, ms);
  };
  schedule();

  return {
    texture,
    dispose() {
      disposed = true;
      clearTimeout(timer);
      texture.dispose();
    },
  };
}
