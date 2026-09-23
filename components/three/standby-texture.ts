import * as THREE from 'three';
import {
  INITIALS,
  OS_NAME,
  STATS,
  WAKE_HINT,
  formatClock,
  formatDate,
} from '@/lib/boot-content';

/**
 * The laptop's screen: ARCHIT.OS on standby, drawn live on a canvas.
 *
 * The same arc-reactor mark the boot opens with (components/hero/
 * boot-sequence.tsx), idling, with the visitor's clock and the CV's headline
 * figures, so the dive flies into exactly what the boot then brings online.
 * Drawn rather than baked: it reads the same content as everything else and
 * shows the real time. It redraws on each minute boundary, which is one
 * 1280×800 texture upload a minute.
 *
 * Nothing sits in the top ~6% of the canvas, where the model's camera notch
 * covers the panel.
 */

const W = 1280;
const H = 800;
const CYAN = '110, 242, 255';

function fontStack(kind: 'display' | 'mono'): string {
  if (kind === 'mono') return 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  // next/font renames families ("__Inter_Tight_…"); the CSS variable holds the real name.
  const inter =
    typeof document !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue('--font-inter-tight').trim()
      : '';
  return `${inter || '"Helvetica Neue"'}, -apple-system, BlinkMacSystemFont, sans-serif`;
}

function tracking(ctx: CanvasRenderingContext2D, px: number) {
  if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = `${px}px`;
}

function ring(ctx: CanvasRenderingContext2D, r: number, width: number, alpha: number, dash?: [number, number]) {
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.setLineDash(dash ?? []);
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgba(${CYAN}, ${alpha})`;
  ctx.stroke();
  ctx.setLineDash([]);
}

export function drawStandby(ctx: CanvasRenderingContext2D, now: Date) {
  const display = fontStack('display');
  const mono = fontStack('mono');

  // Night-blue field with a faint HUD grid.
  const bg = ctx.createRadialGradient(W / 2, H * 0.46, 0, W / 2, H * 0.46, W * 0.7);
  bg.addColorStop(0, '#0f2140');
  bg.addColorStop(0.55, '#081028');
  bg.addColorStop(1, '#050816');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(${CYAN}, 0.05)`;
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }

  // HUD corners.
  ctx.textBaseline = 'alphabetic';
  tracking(ctx, 3);
  ctx.font = `600 15px ${mono}`;
  ctx.textAlign = 'left';
  ctx.fillStyle = `rgba(${CYAN}, 0.9)`;
  ctx.fillText(OS_NAME, 48, 86);
  ctx.fillStyle = 'rgba(156, 163, 175, 0.8)';
  ctx.fillText('SYS // STANDBY', 48, 110);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.font = `600 15px ${mono}`;
  ctx.fillText(formatClock(now), W - 48, 86);
  tracking(ctx, 1.5);
  ctx.fillStyle = 'rgba(156, 163, 175, 0.8)';
  ctx.fillText(formatDate(now).toUpperCase(), W - 48, 110);

  // Reactor, idling: the boot's rings, still.
  const cx = W / 2;
  const cy = 330;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.shadowColor = `rgba(${CYAN}, 0.8)`;
  ctx.shadowBlur = 18;
  ring(ctx, 150, 6, 0.4, [2.5, (2 * Math.PI * 150) / 90 - 2.5]);
  ctx.lineCap = 'round';
  for (const a of [0, 90, 180, 270]) {
    ctx.beginPath();
    ctx.arc(0, 0, 131, ((a + 8) * Math.PI) / 180, ((a + 62) * Math.PI) / 180);
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = `rgba(${CYAN}, 0.8)`;
    ctx.stroke();
  }
  ring(ctx, 110, 3.5, 0.16);
  ctx.beginPath();
  ctx.arc(0, 0, 110, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.18);
  ctx.lineWidth = 4;
  ctx.strokeStyle = `rgba(${CYAN}, 0.95)`;
  ctx.stroke();
  ring(ctx, 88, 2, 0.6, [11, (2 * Math.PI * 88) / 24 - 11]);
  const core = ctx.createRadialGradient(0, -8, 0, 0, 0, 50);
  core.addColorStop(0, '#e9feff');
  core.addColorStop(0.45, '#6ef2ff');
  core.addColorStop(1, '#1d9bf0');
  ctx.beginPath();
  ctx.arc(0, 0, 49, 0, Math.PI * 2);
  ctx.fillStyle = core;
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.restore();

  tracking(ctx, -1);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 40px ${display}`;
  ctx.fillStyle = '#050816';
  ctx.fillText(INITIALS, cx, cy + 2);
  ctx.textBaseline = 'alphabetic';

  // Wordmark.
  tracking(ctx, 14);
  ctx.font = `800 34px ${display}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillText(OS_NAME, cx + 7, 556);

  // Wake hint, in a cyan pill.
  tracking(ctx, 3);
  ctx.font = `600 15px ${mono}`;
  const hint = WAKE_HINT.toUpperCase();
  const hw = ctx.measureText(hint).width + 56;
  ctx.beginPath();
  ctx.roundRect?.(cx - hw / 2, 590, hw, 42, 21);
  ctx.fillStyle = `rgba(${CYAN}, 0.08)`;
  ctx.fill();
  ctx.strokeStyle = `rgba(${CYAN}, 0.55)`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = `rgba(${CYAN}, 0.95)`;
  ctx.fillText(hint, cx + 1.5, 617);

  // The CV's headline figures along the bottom, HUD-style.
  const colW = (W - 96) / STATS.length;
  STATS.forEach((s, i) => {
    const x = 48 + colW * i + colW / 2;
    tracking(ctx, -0.5);
    ctx.font = `800 30px ${display}`;
    ctx.fillStyle = `rgba(${CYAN}, 0.95)`;
    ctx.fillText(s.value, x, 712);
    tracking(ctx, 2);
    ctx.font = `600 11px ${mono}`;
    ctx.fillStyle = 'rgba(156, 163, 175, 0.85)';
    ctx.fillText(s.label.toUpperCase(), x, 738, colW - 24);
  });
}

export interface StandbyTexture {
  texture: THREE.CanvasTexture;
  dispose(): void;
}

/** A live standby texture. Redraws on each minute boundary and once fonts have loaded. */
export function createStandbyTexture(): StandbyTexture {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('standby-texture: 2D canvas unavailable');

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
    drawStandby(ctx, new Date());
    texture.needsUpdate = true;
  };
  draw();
  // The first draw may use a fallback face; redraw once the real one is in.
  document.fonts?.ready.then(draw).catch(() => {});

  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    timer = setTimeout(() => {
      draw();
      schedule();
    }, 60_000 - (Date.now() % 60_000) + 50);
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
