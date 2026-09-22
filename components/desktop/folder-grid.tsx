'use client';

import { motion } from 'framer-motion';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import { FOLDER_BLUE, WINDOW_META } from './icons';
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
    <div className="absolute top-10 left-3 z-10 grid grid-cols-1 gap-1 md:left-5">
      {WINDOW_IDS.map((id, i) => {
        const { label, Icon } = WINDOW_META[id];
        return (
          <motion.button
            key={id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              open(id);
              track('window_opened', { window: id, source: 'desktop' });
            }}
            className="group flex w-[86px] flex-col items-center gap-1.5 rounded-lg px-2 py-2.5 transition-colors hover:surface-2 focus-visible:surface-2"
          >
            {/* macOS folder: a tab above a rounded body, in the system blue,
                with the app glyph knocked out of it. */}
            <span className="relative block h-[52px] w-[62px] transition-transform duration-200 group-hover:-translate-y-1">
              <span
                className="absolute top-0 left-0 h-3 w-[26px] rounded-t-[5px]"
                style={{ background: `linear-gradient(180deg, ${FOLDER_BLUE}e6, ${FOLDER_BLUE}cc)` }}
              />
              <span
                className="absolute inset-x-0 top-[7px] bottom-0 flex items-center justify-center rounded-[7px]"
                style={{
                  background: `linear-gradient(170deg, ${FOLDER_BLUE}f2 0%, ${FOLDER_BLUE}bf 100%)`,
                  boxShadow: 'inset 0 1px 0 #ffffff66, 0 3px 8px -3px #0b1a3359',
                }}
              >
                <Icon className="h-[22px] w-[22px] text-white/90" strokeWidth={1.7} />
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
