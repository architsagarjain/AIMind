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
    <div className="absolute top-14 left-4 z-10 grid grid-cols-1 gap-2 md:left-6">
      {WINDOW_IDS.map((id, i) => {
        const { label, Icon, accent } = WINDOW_META[id];
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
            className="group flex w-[88px] flex-col items-center gap-1.5 rounded-xl px-2 py-3 transition-colors hover:bg-white/5 focus-visible:bg-white/5"
          >
            <span
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline-strong bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/40"
              style={{ boxShadow: `0 8px 24px -12px ${accent}66` }}
            >
              <Icon className="h-6 w-6" style={{ color: accent }} strokeWidth={1.6} />
              {/* Folder tab detail */}
              <span className="absolute -top-px left-3 h-px w-6 bg-white/25" />
            </span>
            <span className="text-center text-[10px] leading-tight font-semibold tracking-wide text-ink/90">
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
