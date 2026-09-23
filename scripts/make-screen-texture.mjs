/**
 * Renders the fallback screen image baked into `public/models/macbook.glb`.
 *
 * The laptop's screen is drawn live at runtime: ARCHIT.OS on standby, with
 * the visitor's clock and the figures from `content/` (see
 * components/three/standby-texture.ts). This image is only what the panel
 * shows for the instant before that first draw, so it is the standby screen's
 * night-blue field alone, with no text and no numbers. An earlier version
 * baked a desktop with a hand-typed "20K+" on it, which went stale when the
 * CV arrived; a fallback with no data in it cannot.
 *
 * Usage: node scripts/make-screen-texture.mjs [out.png]
 * Then re-run scripts/optimize-laptop.mjs to bake it into the model.
 */
import { createRequire } from 'module';

const sharp = createRequire(import.meta.url)('sharp');
const OUT = process.argv[2] ?? 'assets/screen.png';
const W = 1280;
const H = 800;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" gradientUnits="userSpaceOnUse" cx="${W / 2}" cy="${H * 0.46}" r="${W * 0.7}">
      <stop offset="0" stop-color="#0f2140"/>
      <stop offset="0.55" stop-color="#081028"/>
      <stop offset="1" stop-color="#050816"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`wrote ${OUT} (${W}x${H}, standby field only)`);
