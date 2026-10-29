'use client';

import { motion } from 'framer-motion';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import { WINDOW_META } from './icons';
import { FolderIcon } from './app-icons';
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
        const { label } = WINDOW_META[id];
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
            <FolderIcon app={id} className="h-[64px] w-[64px] transition-transform duration-200 group-hover:-translate-y-0.5" />
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
