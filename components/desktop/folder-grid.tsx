'use client';

import { motion } from 'framer-motion';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import { WINDOW_META } from './icons';
import { useTelemetry } from '@/lib/hooks/use-telemetry';

/**
 * Desktop folder icons.
 *
 * Single click opens — a desktop metaphor would use double-click, but on the
 * web that costs half the visitors a "nothing happened" moment. Keyboard users
 * get the same behaviour through Enter/Space on the button.
 */
export function FolderGrid() {
  const open = useWindows((s) => s.open);
  const track = useTelemetry();

  return (
    // Top right, where a Mac puts desktop items. Phones: hidden; the dock
    // opens the same windows, and this column would sit on the prompt panel.
    <div className="absolute top-9 right-3 z-10 hidden grid-cols-1 gap-0.5 md:right-4 md:grid">
      {WINDOW_IDS.map((id, i) => {
        const { label, Icon } = WINDOW_META[id];
        return (
          <motion.button
            key={id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              open(id);
              track('window_opened', { window: id, source: 'desktop' });
            }}
            className="group flex w-[86px] flex-col items-center gap-1.5 rounded-lg px-2 py-2.5 transition-colors hover:surface-2 focus-visible:surface-2"
          >
            {/* A macOS folder: a darker back panel with its tab, a lighter
                front, and the folder's symbol embossed into it. */}
            <span className="relative block h-[54px] w-[64px] drop-shadow-[0_2px_3px_#0b1a3340] transition-transform duration-200 group-hover:-translate-y-0.5">
              <svg viewBox="0 0 64 54" className="absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <linearGradient id={`fb-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4fa3e6" />
                    <stop offset="1" stopColor="#3a8bd6" />
                  </linearGradient>
                  <linearGradient id={`ff-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#8fd0fb" />
                    <stop offset="1" stopColor="#58b0f0" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 7.5 Q2 4 5.5 4 H22 Q24 4 25.3 5.6 L27.6 8.5 H58.5 Q62 8.5 62 12 V48 Q62 51 59 51 H5 Q2 51 2 48 Z"
                  fill={`url(#fb-${id})`}
                />
                <rect x="2" y="13.5" width="60" height="37.5" rx="3.5" fill={`url(#ff-${id})`} />
                <rect x="2.5" y="13.8" width="59" height="1" rx="0.5" fill="#ffffff" opacity="0.65" />
              </svg>
              <span className="absolute inset-x-0 top-[15px] bottom-0 flex items-center justify-center">
                <Icon className="h-[20px] w-[20px] text-[#2f7fc8] opacity-75 [filter:drop-shadow(0_1px_0_#ffffff8c)]" strokeWidth={2} />
              </span>
            </span>
            {/* Label sits on the wallpaper, so it needs its own contrast. */}
            <span className="rounded px-1.5 py-0.5 text-center text-[11px] leading-tight font-medium text-ink [text-shadow:0_1px_2px_#ffffffcc]">
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
