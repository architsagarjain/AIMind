'use client';

import { motion } from 'framer-motion';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import { WINDOW_META } from './icons';
import { useTelemetry } from '@/lib/hooks/use-telemetry';
import { cn } from '@/lib/utils';

/**
 * The dock. Open windows carry an indicator dot; clicking an open-but-focused
 * window minimises it, matching the platform convention people already know.
 */
export function Dock() {
  const windows = useWindows((s) => s.windows);
  const focused = useWindows((s) => s.focused);
  const { open, focus, minimize } = useWindows();
  const track = useTelemetry();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-4 left-1/2 z-900 -translate-x-1/2"
    >
      <div className="glass-strong flex items-end gap-1.5 rounded-2xl px-2.5 py-2.5 shadow-[var(--shadow-window)]">
        {WINDOW_IDS.map((id) => {
          const { label, Icon, accent } = WINDOW_META[id];
          const win = windows[id];
          const isActive = win.open && !win.minimized;

          return (
            <button
              key={id}
              onClick={() => {
                if (isActive && focused === id) {
                  minimize(id);
                  return;
                }
                if (win.open) {
                  focus(id);
                  return;
                }
                open(id);
                track('window_opened', { window: id, source: 'dock' });
              }}
              aria-label={label}
              aria-pressed={isActive}
              className="group relative flex flex-col items-center"
            >
              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-10 rounded-lg border border-hairline-strong bg-surface-raised px-2.5 py-1.5 text-[10px] font-semibold whitespace-nowrap text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {label}
              </span>

              <span
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300',
                  'bg-gradient-to-br from-white/10 to-white/[0.02]',
                  'group-hover:-translate-y-1.5 group-hover:scale-105',
                  isActive ? 'border-accent/40' : 'border-hairline-strong',
                )}
                style={isActive ? { boxShadow: `0 6px 20px -8px ${accent}99` } : undefined}
              >
                <Icon className="h-5 w-5" style={{ color: accent }} strokeWidth={1.7} />
              </span>

              <span
                className={cn(
                  'mt-1.5 h-1 w-1 rounded-full transition-all duration-300',
                  win.open ? 'bg-accent' : 'bg-transparent',
                )}
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
