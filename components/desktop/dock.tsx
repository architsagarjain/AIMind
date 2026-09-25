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
      className="absolute bottom-2.5 left-1/2 z-900 -translate-x-1/2"
    >
      {/* macOS dock: a translucent slab with a hairline, icons as squircles,
          and a running dot under each open app. */}
      <div className="glass-strong flex items-end gap-1.5 rounded-[22px] px-2.5 py-2.5 shadow-[var(--shadow-window)] sm:gap-2 sm:px-3">
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
              {/* macOS shows the label in a floating bubble above the icon. */}
              <span className="pointer-events-none absolute -top-11 rounded-md border border-hairline bg-surface-raised px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-ink opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                {label}
              </span>

              {/* Squircle-ish radius and a top-lit gradient: the two things
                  that read as a macOS app icon rather than a web button. */}
              <span
                className={cn(
                  // Six apps: slightly smaller on phones so the dock fits a 360px screen.
                  'flex h-[46px] w-[46px] items-center justify-center rounded-[13px] sm:h-[52px] sm:w-[52px] sm:rounded-[14px]',
                  'transition-transform duration-200 ease-out',
                  'group-hover:-translate-y-2 group-hover:scale-110',
                )}
                style={{
                  background: `linear-gradient(160deg, ${accent}f2 0%, ${accent}b8 52%, ${accent}8a 100%)`,
                  boxShadow:
                    'inset 0 1px 0 #ffffff80, inset 0 -1px 0 #00000014, 0 4px 10px -3px #0b1a3359',
                }}
              >
                <Icon className="h-[23px] w-[23px] text-white sm:h-[26px] sm:w-[26px]" strokeWidth={1.7} />
              </span>

              <span
                className={cn(
                  'mt-1 h-[3px] w-[3px] rounded-full transition-colors duration-200',
                  win.open ? 'bg-ink/55' : 'bg-transparent',
                )}
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
