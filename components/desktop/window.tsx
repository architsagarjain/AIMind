'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';
import { useWindows } from '@/lib/store/windows';
import type { WindowId } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Window chrome: traffic lights, drag, resize, focus and maximise.
 *
 * Drag and resize run on refs + direct style writes during the gesture and only
 * commit to the store on pointerup. Writing every pointermove into zustand
 * would re-render the window subtree ~120 times a second and visibly stutter
 * the chat and project lists.
 */

const TOP_INSET = 34; // menu bar height — windows cannot be dragged under it
const DOCK_INSET = 96;

interface DesktopWindowProps {
  id: WindowId;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function DesktopWindow({ id, title, subtitle, icon, children }: DesktopWindowProps) {
  const win = useWindows((s) => s.windows[id]);
  const focused = useWindows((s) => s.focused === id);
  const { close, focus, minimize, toggleMaximize, move, resize } = useWindows();

  const ref = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    mode: 'move' | 'resize';
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    originW: number;
    originH: number;
  } | null>(null);

  /** Shared pointermove/up handling for both drag and resize. */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const g = gesture.current;
      const el = ref.current;
      if (!g || !el) return;

      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;

      if (g.mode === 'move') {
        const maxX = window.innerWidth - 120;
        const maxY = window.innerHeight - DOCK_INSET;
        const x = Math.min(maxX, Math.max(-g.originW + 120, g.originX + dx));
        const y = Math.min(maxY, Math.max(TOP_INSET, g.originY + dy));
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      } else {
        const w = Math.max(360, Math.min(window.innerWidth - g.originX - 16, g.originW + dx));
        const h = Math.max(280, Math.min(window.innerHeight - g.originY - 16, g.originH + dy));
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
      }
    };

    const onUp = () => {
      const g = gesture.current;
      const el = ref.current;
      gesture.current = null;
      if (!g || !el) return;

      document.body.style.userSelect = '';
      document.body.style.cursor = '';

      // Commit the final geometry once, so the store stays the source of truth.
      if (g.mode === 'move') {
        move(id, parseFloat(el.style.left), parseFloat(el.style.top));
      } else {
        resize(id, parseFloat(el.style.width), parseFloat(el.style.height));
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [id, move, resize]);

  const startGesture = useCallback(
    (mode: 'move' | 'resize') => (e: React.PointerEvent) => {
      if (win.maximized && mode === 'move') return;
      e.preventDefault();
      focus(id);
      gesture.current = {
        mode,
        startX: e.clientX,
        startY: e.clientY,
        originX: win.x,
        originY: win.y,
        originW: win.width,
        originH: win.height,
      };
      document.body.style.userSelect = 'none';
      document.body.style.cursor = mode === 'resize' ? 'nwse-resize' : 'grabbing';
    },
    [focus, id, win],
  );

  if (!win.open) return null;

  const maximizedStyle = {
    left: 8,
    top: TOP_INSET + 6,
    width: 'calc(100vw - 16px)',
    height: `calc(100vh - ${TOP_INSET + DOCK_INSET}px)`,
  };

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label={title}
      aria-modal={false}
      initial={{ opacity: 0, scale: 0.94, y: 18 }}
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: win.minimized ? 0.86 : 1,
        y: win.minimized ? 60 : 0,
        pointerEvents: win.minimized ? 'none' : 'auto',
      }}
      exit={{ opacity: 0, scale: 0.94, y: 18 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.7 }}
      onPointerDown={() => focus(id)}
      className={cn(
        'glass-strong absolute flex flex-col overflow-hidden rounded-[var(--radius-window)]',
        'shadow-[var(--shadow-window)]',
        focused ? 'ring-1 ring-accent/25' : 'ring-0',
      )}
      style={{
        zIndex: win.z,
        ...(win.maximized
          ? maximizedStyle
          : { left: win.x, top: win.y, width: win.width, height: win.height }),
      }}
    >
      {/* ------------------------------------------------------------ title bar */}
      <div
        onPointerDown={startGesture('move')}
        onDoubleClick={() => toggleMaximize(id)}
        className={cn(
          'flex shrink-0 items-center gap-3 border-b border-hairline px-4 py-3',
          'bg-gradient-to-b from-white/[0.06] to-transparent',
          win.maximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        )}
      >
        {/* Traffic lights */}
        <div className="group flex items-center gap-2">
          <button
            onClick={() => close(id)}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`Close ${title}`}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] transition-transform hover:scale-110"
          >
            <X className="h-2 w-2 text-black/60 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={3} />
          </button>
          <button
            onClick={() => minimize(id)}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`Minimise ${title}`}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] transition-transform hover:scale-110"
          >
            <Minus className="h-2 w-2 text-black/60 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={4} />
          </button>
          <button
            onClick={() => toggleMaximize(id)}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`${win.maximized ? 'Restore' : 'Maximise'} ${title}`}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840] transition-transform hover:scale-110"
          >
            <Square className="h-1.5 w-1.5 text-black/60 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={4} />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 pr-16">
          {icon}
          <p className="truncate text-[12px] font-semibold text-ink">{title}</p>
          {subtitle && (
            <p className="hidden truncate text-[11px] text-faint sm:block">— {subtitle}</p>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------------- body */}
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

      {/* ------------------------------------------------------------- resizer */}
      {!win.maximized && (
        <div
          onPointerDown={startGesture('resize')}
          className="absolute right-0 bottom-0 z-10 h-4 w-4 cursor-nwse-resize"
          aria-hidden="true"
        >
          <span className="absolute right-1 bottom-1 h-2 w-2 border-r border-b border-white/25" />
        </div>
      )}
    </motion.div>
  );
}
