'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import { WINDOW_META } from './icons';
import { useTelemetry } from '@/lib/hooks/use-telemetry';
import { cn } from '@/lib/utils';

/**
 * The dock. Open windows carry an indicator dot; clicking an open-but-focused
 * window minimises it, matching the platform convention people already know.
 *
 * With a mouse or trackpad the icons swell under the pointer and an app
 * bounces as it launches, as on a Mac. The magnification follows React Bits'
 * Dock (github.com/DavidHDev/react-bits, MIT + Commons Clause, © David Haz):
 * a cos² falloff measured from each icon's resting position, so growing
 * icons never shift the curve under the pointer, eased by a damped spring.
 * Sizes are written straight to the DOM, so moving the pointer re-renders
 * nothing.
 */
const BASE = 52;
const PEAK = 76;
const REACH = 150;
const GAP = 8;
const STIFFNESS = 520;
const DAMPING = 38;

function useMagnify(count: number) {
  const dockRef = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 640px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sizes = Array.from({ length: count }, () => ({ size: BASE, velocity: 0 }));
    let pointerX: number | null = null;
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
      last = now;
      const rect = dock.getBoundingClientRect();
      // The dock stays centred while it grows, so its centre is a fixed origin.
      const focus = pointerX === null ? null : pointerX - (rect.left + rect.width / 2);
      let moving = false;
      sizes.forEach((state, i) => {
        const rest = (i - (count - 1) / 2) * (BASE + GAP);
        const reach = focus === null ? 1 : Math.abs(focus - rest) / REACH;
        const target = BASE + (PEAK - BASE) * (reach < 1 ? Math.cos((reach * Math.PI) / 2) ** 2 : 0);
        if (reduce.matches) {
          state.size = target;
          state.velocity = 0;
        } else {
          // Semi-implicit damped spring, stable at any frame rate.
          state.velocity = (state.velocity + dt * STIFFNESS * (target - state.size)) / (1 + dt * DAMPING);
          state.size += state.velocity * dt;
        }
        if (Math.abs(state.velocity) < 0.01 && Math.abs(target - state.size) < 0.05) {
          state.size = target;
          state.velocity = 0;
        } else moving = true;
        const tile = tiles.current[i];
        if (tile) {
          const px = `${state.size.toFixed(2)}px`;
          tile.style.width = px;
          tile.style.height = px;
        }
      });
      if (moving) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType !== 'mouse') return;
      pointerX = e.clientX;
      wake();
    };
    const onLeave = () => {
      pointerX = null;
      wake();
    };
    const onChange = () => {
      if (fine.matches) return;
      // Back to the CSS sizes on a touch screen or a narrow window.
      pointerX = null;
      tiles.current.forEach((t) => t && ((t.style.width = ''), (t.style.height = '')));
      sizes.forEach((st) => ((st.size = BASE), (st.velocity = 0)));
    };

    dock.addEventListener('pointermove', onMove);
    dock.addEventListener('pointerleave', onLeave);
    fine.addEventListener('change', onChange);
    return () => {
      cancelAnimationFrame(raf);
      dock.removeEventListener('pointermove', onMove);
      dock.removeEventListener('pointerleave', onLeave);
      fine.removeEventListener('change', onChange);
    };
  }, [count]);

  return { dockRef, tiles };
}

/** The launch bounce: two hops, the second smaller, as an app opens. */
function hop(el: HTMLElement | null) {
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.animate(
    [
      { translate: '0 0' },
      { translate: '0 -22px', offset: 0.22 },
      { translate: '0 0', offset: 0.45 },
      { translate: '0 -11px', offset: 0.66 },
      { translate: '0 0' },
    ],
    { duration: 820, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)' },
  );
}

export function Dock() {
  const windows = useWindows((s) => s.windows);
  const focused = useWindows((s) => s.focused);
  const { open, focus, minimize } = useWindows();
  const track = useTelemetry();
  const { dockRef, tiles } = useMagnify(WINDOW_IDS.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-2.5 left-1/2 z-900 -translate-x-1/2"
    >
      {/* macOS dock: a translucent slab with a hairline, icons as squircles,
          and a running dot under each open app. */}
      <div
        ref={dockRef}
        className="glass-strong flex items-end gap-1.5 rounded-[22px] px-2.5 py-2.5 shadow-[var(--shadow-window)] sm:gap-2 sm:px-3"
      >
        {WINDOW_IDS.map((id, index) => {
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
                hop(tiles.current[index] ?? null);
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
                ref={(el) => {
                  tiles.current[index] = el;
                }}
                className={cn(
                  // Six apps: slightly smaller on phones so the dock fits a 360px screen.
                  'flex h-[46px] w-[46px] items-center justify-center rounded-[13px] sm:h-[52px] sm:w-[52px] sm:rounded-[27%]',
                  // Touch screens and narrow windows get a press instead of magnification.
                  'transition-transform duration-150 ease-out active:scale-95',
                )}
                style={{
                  background: `linear-gradient(160deg, ${accent}f2 0%, ${accent}b8 52%, ${accent}8a 100%)`,
                  boxShadow:
                    'inset 0 1px 0 #ffffff80, inset 0 -1px 0 #00000014, 0 4px 10px -3px #0b1a3359',
                }}
              >
                <Icon className="h-1/2 w-1/2 text-white" strokeWidth={1.7} />
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
