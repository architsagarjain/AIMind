'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuBar } from './menu-bar';
import { Wallpaper } from './wallpaper';
import { AskPanel } from './ask-panel';
import { FolderGrid } from './folder-grid';
import { Dock } from './dock';
import { DesktopWindow } from './window';
import { WINDOW_META } from './icons';
import { AboutWindow } from '@/components/windows/about-window';
import { ProjectsWindow } from '@/components/windows/projects-window';
import { TimelineWindow } from '@/components/windows/timeline-window';
import { ResumeWindow } from '@/components/windows/resume-window';
import { WritingWindow } from '@/components/windows/writing-window';
import { AskWindow } from '@/components/windows/ask-window';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import type { WindowId } from '@/types';

const BODIES: Record<WindowId, React.ComponentType> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  timeline: TimelineWindow,
  resume: ResumeWindow,
  writing: WritingWindow,
  ask: AskWindow,
};

/**
 * The virtual desktop.
 *
 * Windows unmount when closed (rather than hiding) so a closed Projects window
 * is not holding four case studies in the tree, and the chat is not keeping a
 * stream open behind a hidden panel.
 */
export function Desktop({ onExit }: { onExit: () => void }) {
  const windows = useWindows((s) => s.windows);
  // Minimised windows are out of the way, so the prompt comes back for them.
  const anyOpen = WINDOW_IDS.some((id) => windows[id].open && !windows[id].minimized);
  const { open, close, focused } = useWindows();

  // Keyboard: ⌘/Ctrl+1..6 open windows, Escape closes the focused one.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focused) {
        close(focused);
        return;
      }
      if (!(e.metaKey || e.ctrlKey)) return;
      const index = Number(e.key) - 1;
      const id = WINDOW_IDS[index];
      if (id) {
        e.preventDefault();
        open(id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, focused, open]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="os-light fixed inset-0 z-500 overflow-hidden bg-void"
    >
      {/* ------------------------------------------------------------ wallpaper */}
      {/* Shared with the lock screen and the laptop's screen; see wallpaper.tsx. */}
      <Wallpaper />

      <MenuBar onExit={onExit} />
      <FolderGrid />

      {/* ------------------------------------------------------------ the prompt */}
      {/* The conversation is the point of the site, so it is what the desktop
          opens on. It steps aside whenever a window is open. */}
      <div className="pointer-events-none absolute inset-x-0 top-[26px] bottom-[96px] flex items-center justify-center px-3">
        <AnimatePresence>{!anyOpen && <AskPanel key="ask-panel" />}</AnimatePresence>
      </div>

      {/* --------------------------------------------------------------- windows */}
      <AnimatePresence>
        {WINDOW_IDS.filter((id) => windows[id].open).map((id) => {
          const meta = WINDOW_META[id];
          const Body = BODIES[id];
          return (
            <DesktopWindow
              key={id}
              id={id}
              title={meta.label}
              subtitle={meta.subtitle}
              icon={<meta.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: meta.accent }} />}
            >
              <Body />
            </DesktopWindow>
          );
        })}
      </AnimatePresence>

      <Dock />
    </motion.div>
  );
}
