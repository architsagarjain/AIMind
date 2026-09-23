/**
 * Renders the fallback screen image baked into `public/models/macbook.glb`.
 *
 * The laptop's screen is drawn live at runtime: the ARCHIT.OS lock screen,
 * with the visitor's clock and the figures from `content/` (see
 * components/three/lock-screen-texture.ts). This image is only what the panel
 * shows for the instant before that first draw, so it is the wallpaper alone,
 * with no text and no numbers. An earlier version baked a desktop with a
 * hand-typed "20K+" on it, which went stale when the CV arrived; a fallback
 * with no data in it cannot.
 *
 * The colours mirror WALLPAPER_BASE / WALLPAPER_POOLS in
 * components/desktop/wallpaper.tsx (a .tsx this script cannot import).
 *
 * Usage: node scripts/make-screen-texture.mjs [out.png]
 * Then re-run scripts/optimize-laptop.mjs to bake it into the model.
 */
import { createRequire } from 'module';

const sharp = createRequire(import.meta.url)('sharp');
const OUT = process.argv[2] ?? 'assets/screen.png';
const W = 1280;
const H = 800;

const pools = [
  { color: '#9cc4f2', alpha: 0.55, cx: 0.2, cy: 0.23, r: 0.3 },
  { color: '#c9b6ee', alpha: 0.5, cx: 0.88, cy: 0.86, r: 0.27 },
  { color: '#a8e5e5', alpha: 0.5, cx: 0.68, cy: 0.45, r: 0.19 },
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="base" x1="0.33" y1="0" x2="0.67" y2="1">
      <stop offset="0" stop-color="#dfe9f7"/>
      <stop offset="0.38" stop-color="#eef1f8"/>
      <stop offset="0.7" stop-color="#f6f2f7"/>
      <stop offset="1" stop-color="#e9eef9"/>
    </linearGradient>
    ${pools
      .map(
        (p, i) => `<radialGradient id="p${i}" gradientUnits="userSpaceOnUse" cx="${p.cx * W}" cy="${p.cy * H}" r="${p.r * W * 1.35}">
      <stop offset="0" stop-color="${p.color}" stop-opacity="${p.alpha}"/>
      <stop offset="1" stop-color="${p.color}" stop-opacity="0"/>
    </radialGradient>`,
      )
      .join('\n    ')}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#base)"/>
  ${pools.map((_, i) => `<rect width="${W}" height="${H}" fill="url(#p${i})"/>`).join('\n  ')}
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`wrote ${OUT} (${W}x${H}, wallpaper only)`);
