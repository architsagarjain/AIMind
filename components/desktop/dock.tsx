'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/content/profile';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import { useTelemetry } from '@/lib/hooks/use-telemetry';
import { cn } from '@/lib/utils';
import { AppIcon, type AppIconId } from './app-icons';
import { WINDOW_META } from './icons';

/**
 * The dock, laid out as on a Mac: the apps, a divider, then LinkedIn and
 * Mail (which open Archit's profile and a new email), and the Trash at the
 * end. Open apps carry a dot; clicking the app in front minimises it.
 *
 * With a mouse or trackpad the icons swell under the pointer and an app
 * bounces as it launches. The magnification follows React Bits' Dock
 * (github.com/DavidHDev/react-bits, MIT + Commons Clause, © David Haz): a
 * cos² falloff measured from each icon's resting position, so growing icons
 * never shift the curve under the pointer, eased by a damped spring. Sizes
 * are written straight to the DOM, so moving the pointer re-renders nothing.
 */

type Slot =
  | { kind: 'app'; app: AppIconId; label: string }
  | { kind: 'divider' };

const SLOTS: Slot[] = [
  ...WINDOW_IDS.map((id) => ({ kind: 'app' as const, app: id, label: WINDOW_META[id].label })),
  { kind: 'divider' },
  { kind: 'app', app: 'linkedin', label: 'LinkedIn' },
  { kind: 'app', app: 'mail', label: 'Mail' },
  { kind: 'app', app: 'trash', label: 'Trash' },
];

/** Phones have room for the apps and LinkedIn; Mail and the Trash wait for a wider screen. */
const DESKTOP_ONLY = new Set<AppIconId>(['mail', 'trash']);

const BASE = 52;
const PEAK = 80;
const REACH = 160;
const GAP = 6;
/** The divider's width including its margins (1px line + 2 × 5px). */
const DIVIDER = 11;
const STIFFNESS = 520;
const DAMPING = 38;

function useMagnify() {
  const dockRef = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 640px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Resting centres, measured from the dock's centre, which stays put as it grows.
    const widths = SLOTS.map((s) => (s.kind === 'divider' ? DIVIDER : BASE));
    const total = widths.reduce((a, b) => a + b, 0) + GAP * (widths.length - 1);
    let cursor = -total / 2;
    const rest = widths.map((w) => {
      const centre = cursor + w / 2;
      cursor += w + GAP;
      return centre;
    });
    const sizes = SLOTS.map(() => ({ size: BASE, velocity: 0 }));
    let pointerX: number | null = null;
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
      last = now;
      const rect = dock.getBoundingClientRect();
      const focus = pointerX === null ? null : pointerX - (rect.left + rect.width / 2);
      let moving = false;
      SLOTS.forEach((slot, i) => {
        if (slot.kind === 'divider') return;
        const state = sizes[i]!;
        const reach = focus === null ? 1 : Math.abs(focus - rest[i]!) / REACH;
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
  }, []);

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
  const { open, focus, minimize, closeAll } = useWindows();
  const track = useTelemetry();
  const { dockRef, tiles } = useMagnify();
  const anyOpen = WINDOW_IDS.some((id) => windows[id].open);

  const launch = (app: AppIconId, index: number) => {
    const tile = tiles.current[index] ?? null;
    if (app === 'linkedin') {
      hop(tile);
      track('link_clicked', { link: 'linkedin', source: 'dock' });
      window.open(profile.links.linkedin, '_blank', 'noopener');
      return;
    }
    if (app === 'mail') {
      hop(tile);
      track('link_clicked', { link: 'email', source: 'dock' });
      window.location.href = `mailto:${profile.links.email}`;
      return;
    }
    if (app === 'trash') {
      // Dragging a window to the Trash is not a thing a page can do, so
      // clicking it clears the desktop instead.
      closeAll();
      return;
    }
    const win = windows[app];
    if (win.open && !win.minimized && focused === app) {
      minimize(app);
      return;
    }
    if (win.open) {
      focus(app);
      return;
    }
    hop(tile);
    open(app);
    track('window_opened', { window: app, source: 'dock' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-1.5 left-1/2 z-900 -translate-x-1/2"
    >
      {/* macOS dock: a frosted slab that lets the wallpaper through, with a
          light rim, and the icons standing on its floor. */}
      <div
        ref={dockRef}
        role="toolbar"
        aria-label="Dock"
        className="dock-glass flex items-end gap-[6px] rounded-[18px] px-[6px] pt-[6px] pb-[4px] sm:rounded-[22px]"
      >
        {SLOTS.map((slot, index) => {
          if (slot.kind === 'divider') {
            return <span key="divider" aria-hidden className="mx-[5px] mb-[9px] h-[38px] w-px self-end bg-black/15 sm:h-[44px]" />;
          }
          const { app, label } = slot;
          const isWindow = app in windows;
          const running = isWindow && windows[app as keyof typeof windows].open;
          const name = app === 'trash' ? (anyOpen ? 'Trash: close all windows' : 'Trash') : label;

          return (
            <button
              key={app}
              type="button"
              onClick={() => launch(app, index)}
              aria-label={app === 'linkedin' ? 'LinkedIn: open Archit’s profile' : app === 'mail' ? `Mail: email ${profile.links.email}` : name}
              aria-pressed={isWindow ? running : undefined}
              className={cn('group relative flex-col items-center', DESKTOP_ONLY.has(app) ? 'hidden sm:flex' : 'flex')}
            >
              {/* The name floats above the icon, as on a Mac. */}
              <span className="pointer-events-none absolute -top-9 rounded-[7px] border border-black/10 bg-[#f0f0f2]/95 px-2.5 py-[3px] text-[12.5px] font-medium whitespace-nowrap text-[#1d1d1f] opacity-0 shadow-[0_4px_14px_-4px_#0000004d] backdrop-blur-xl transition-opacity duration-100 group-hover:opacity-100">
                {app === 'trash' ? 'Trash' : label}
              </span>

              <span
                ref={(el) => {
                  tiles.current[index] = el;
                }}
                className={cn(
                  // Phones: a little smaller, so the apps and LinkedIn fit a 360px screen.
                  'block h-[40px] w-[40px] sm:h-[52px] sm:w-[52px]',
                  'drop-shadow-[0_1.5px_2px_#0000002e] transition-transform duration-150 ease-out active:brightness-75',
                )}
              >
                <AppIcon app={app} className="h-full w-full" />
              </span>

              <span
                className={cn(
                  'mt-[3px] h-[4px] w-[4px] rounded-full transition-colors duration-200',
                  running ? 'bg-black/60' : 'bg-transparent',
                )}
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
