/**
 * Renders the laptop screen texture used by `public/models/macbook.glb`.
 *
 * The supplied MacBook model ships a macOS wallpaper at emissive strength 8.
 * That is the surface the scroll cinematic flies into, so it shows ARCHIT.OS
 * instead — the desktop the visitor is about to land on.
 *
 * Baked into the GLB rather than drawn at runtime: the screen quad already has
 * UVs, so a swapped image maps correctly with no extra geometry, no canvas
 * texture upload, and no per-frame cost.
 *
 * Usage: node scripts/make-screen-texture.mjs [out.png]
 * Then re-run scripts/optimize-laptop.mjs to bake it into the model.
 */
import { createRequire } from 'module';

const sharp = createRequire(import.meta.url)('sharp');
const OUT = process.argv[2] ?? 'assets/screen.png';
const W = 1280;
const H = 800;

const copyLines = Array.from({ length: 5 }, (_, i) =>
  `<rect x="86" y="${300 + i * 34}" width="${330 - i * 46}" height="9" rx="4.5" fill="#6ef2ff" opacity="${(0.5 - i * 0.06).toFixed(2)}"/>`,
).join('');

const dockIcons = Array.from({ length: 5 }, (_, i) =>
  `<rect x="${W / 2 - 190 + i * 82}" y="${H - 82}" width="56" height="40" rx="11" fill="#ffffff" opacity="0.07" stroke="#6ef2ff" stroke-opacity="0.32"/>`,
).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="28%" cy="20%" r="72%">
      <stop offset="0%" stop-color="#12284d"/>
      <stop offset="100%" stop-color="#050816"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6ef2ff"/>
      <stop offset="100%" stop-color="#1d9bf0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <rect width="${W}" height="34" fill="#0d1228" opacity="0.88"/>
  <text x="24" y="23" font-family="Helvetica,Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="3" fill="#ffffff">ARCHIT.OS</text>
  <circle cx="${W - 30}" cy="17" r="4" fill="#6ef2ff"/>

  <rect x="56" y="96" width="${W - 420}" height="${H - 230}" rx="14" fill="#0d1228" opacity="0.74" stroke="#ffffff" stroke-opacity="0.12"/>
  <rect x="56" y="96" width="${W - 420}" height="42" rx="14" fill="#ffffff" opacity="0.04"/>
  <circle cx="82" cy="117" r="6" fill="#ff5f57"/>
  <circle cx="102" cy="117" r="6" fill="#febc2e"/>
  <circle cx="122" cy="117" r="6" fill="#28c840"/>

  <text x="86" y="200" font-family="Helvetica,Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="5" fill="#6ef2ff" opacity="0.8">SELECTED WORK</text>
  <text x="84" y="258" font-family="Helvetica,Arial,sans-serif" font-size="46" font-weight="800" fill="#ffffff">Projects</text>
  ${copyLines}

  <rect x="${W - 560}" y="296" width="190" height="136" rx="10" fill="url(#accent)" opacity="0.2" stroke="#6ef2ff" stroke-opacity="0.42"/>
  <text x="${W - 540}" y="348" font-family="Helvetica,Arial,sans-serif" font-size="30" font-weight="800" fill="#6ef2ff">20K+</text>
  <text x="${W - 540}" y="376" font-family="Helvetica,Arial,sans-serif" font-size="11" letter-spacing="2" fill="#9ca3af">ZENCABS USERS</text>

  <rect x="${W / 2 - 210}" y="${H - 96}" width="420" height="68" rx="18" fill="#0d1228" opacity="0.82" stroke="#ffffff" stroke-opacity="0.12"/>
  ${dockIcons}
  <text x="${W / 2}" y="${H - 14}" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="11" letter-spacing="4" fill="#ffffff" opacity="0.3">TALK. EXPLORE. KNOW ME.</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`wrote ${OUT} (${W}x${H})`);
