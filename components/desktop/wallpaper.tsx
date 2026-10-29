/**
 * The ARCHIT.OS wallpaper, defined once.
 *
 * Three surfaces show it: the desktop, the lock screen that plays as the
 * desktop comes up, and the laptop's own screen in the 3D scene, drawn on a
 * canvas. The dive only reads as flying *into* that laptop if all three are
 * the same image, so they all render from these numbers rather than each
 * keeping its own copy.
 *
 * Pools are placed in fractions of the surface and sized in fractions of its
 * longer side, which is what `vmax` is in CSS; the canvas does the same sum.
 */

/** Base gradient: CSS angle and colour stops (0–1). */
export const WALLPAPER_BASE = {
  angle: 160,
  stops: [
    ['#dfe9f7', 0],
    ['#eef1f8', 0.38],
    ['#f6f2f7', 0.7],
    ['#e9eef9', 1],
  ],
} as const;

/** Soft colour pools: centre (fractions), radius (fraction of the long side), alpha. */
export const WALLPAPER_POOLS = [
  { color: '#9cc4f2', alpha: 0.55, cx: 0.2, cy: 0.23, r: 0.3 },
  { color: '#c9b6ee', alpha: 0.5, cx: 0.88, cy: 0.86, r: 0.27 },
  { color: '#a8e5e5', alpha: 0.5, cx: 0.68, cy: 0.45, r: 0.19 },
] as const;

const hexAlpha = (a: number) =>
  Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');

export function Wallpaper() {
  const base = `linear-gradient(${WALLPAPER_BASE.angle}deg, ${WALLPAPER_BASE.stops
    .map(([c, p]) => `${c} ${p * 100}%`)
    .join(', ')})`;
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: base }} />
      {WALLPAPER_POOLS.map((p) => (
        <div
          key={p.color}
          className="absolute rounded-full blur-[100px]"
          style={{
            left: `calc(${p.cx * 100}% - ${p.r * 100}vmax)`,
            top: `calc(${p.cy * 100}% - ${p.r * 100}vmax)`,
            width: `${p.r * 200}vmax`,
            height: `${p.r * 200}vmax`,
            background: `radial-gradient(circle, ${p.color}${hexAlpha(p.alpha)} 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}

/** Paints the same wallpaper on a 2D canvas (for the laptop screen). */
export function paintWallpaper(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // CSS gradient angles run clockwise from "to top"; the gradient line passes
  // through the centre and is long enough to reach the far corners.
  const a = (WALLPAPER_BASE.angle * Math.PI) / 180;
  const dx = Math.sin(a);
  const dy = -Math.cos(a);
  const half = (Math.abs(width * dx) + Math.abs(height * dy)) / 2;
  const g = ctx.createLinearGradient(
    width / 2 - dx * half,
    height / 2 - dy * half,
    width / 2 + dx * half,
    height / 2 + dy * half,
  );
  for (const [c, p] of WALLPAPER_BASE.stops) g.addColorStop(p, c);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  // The DOM pools are blurred; a longer transparent tail stands in for that.
  const long = Math.max(width, height);
  for (const p of WALLPAPER_POOLS) {
    const r = p.r * long * 1.35;
    const pool = ctx.createRadialGradient(p.cx * width, p.cy * height, 0, p.cx * width, p.cy * height, r);
    pool.addColorStop(0, `${p.color}${hexAlpha(p.alpha)}`);
    pool.addColorStop(1, `${p.color}00`);
    ctx.fillStyle = pool;
    ctx.fillRect(0, 0, width, height);
  }
}
