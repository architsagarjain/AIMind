/**
 * The ARCHIT.OS wallpaper: soft layered waves in the manner of the recent
 * macOS wallpapers, kept light so windows, labels and the frosted dock stay
 * easy to read over it. One SVG, scaled to cover the screen like a desktop
 * picture. It is static, so it paints once and costs nothing afterwards.
 *
 * Shown on the desktop and behind the full-page chat (/ask).
 */

/** Each band: its top edge (a path across a 1600×1000 frame) and two colours, left to right. */
const BANDS = [
  { top: 'M0 360 C 300 300 520 210 820 230 S 1340 330 1600 170', from: '#b9d0f5', to: '#cdbff2', alpha: 0.9 },
  { top: 'M0 520 C 280 430 600 380 900 420 S 1380 470 1600 330', from: '#93b6f0', to: '#b29ce9', alpha: 0.85 },
  { top: 'M0 650 C 320 600 560 520 860 560 S 1360 660 1600 520', from: '#f4c2d2', to: '#f8d3bd', alpha: 0.9 },
  { top: 'M0 770 C 260 700 600 680 920 720 S 1400 760 1600 660', from: '#6f95e6', to: '#9a84e4', alpha: 0.9 },
  { top: 'M0 900 C 340 850 640 830 960 860 S 1420 880 1600 800', from: '#f7d6c6', to: '#f1b9cf', alpha: 0.95 },
] as const;

export function Wallpaper() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d6e4f8" />
            <stop offset="0.55" stopColor="#ebe6f6" />
            <stop offset="1" stopColor="#f6e8ee" />
          </linearGradient>
          <radialGradient id="wp-glow" cx="0.72" cy="0.18" r="0.6">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          {BANDS.map((b, i) => (
            <linearGradient key={i} id={`wp-band-${i}`} x1="0" y1="0" x2="1" y2="0.35">
              <stop offset="0" stopColor={b.from} />
              <stop offset="1" stopColor={b.to} />
            </linearGradient>
          ))}
          {/* Each band casts a soft shadow up onto the one behind it. */}
          <filter id="wp-lift" x="-5%" y="-20%" width="110%" height="140%">
            <feDropShadow dx="0" dy="-10" stdDeviation="18" floodColor="#34407a" floodOpacity="0.16" />
          </filter>
        </defs>

        <rect width="1600" height="1000" fill="url(#wp-sky)" />
        <rect width="1600" height="1000" fill="url(#wp-glow)" />
        {BANDS.map((b, i) => (
          <g key={i}>
            <path d={`${b.top} L1600 1000 L0 1000 Z`} fill={`url(#wp-band-${i})`} opacity={b.alpha} filter="url(#wp-lift)" />
            {/* A thin light catch along the crest. */}
            <path d={b.top} fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" />
          </g>
        ))}
      </svg>
    </div>
  );
}
