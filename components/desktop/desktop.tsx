'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuBar } from './menu-bar';
import { FolderGrid } from './folder-grid';
import { Dock } from './dock';
import { DesktopWindow } from './window';
import { WINDOW_META } from './icons';
import { AboutWindow } from '@/components/windows/about-window';
import { ProjectsWindow } from '@/components/windows/projects-window';
import { TimelineWindow } from '@/components/windows/timeline-window';
import { ResumeWindow } from '@/components/windows/resume-window';
import { AskWindow } from '@/components/windows/ask-window';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import type { WindowId } from '@/types';
import { profile } from '@/content/profile';

const BODIES: Record<WindowId, React.ComponentType> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  timeline: TimelineWindow,
  resume: ResumeWindow,
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
  const { open, close, focused } = useWindows();

  // Keyboard: ⌘/Ctrl+1..5 open windows, Escape closes the focused one.
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
      className="fixed inset-0 z-500 overflow-hidden bg-void"
    >
      {/* ------------------------------------------------------------ wallpaper */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_18%,#0f1c38_0%,#050816_55%)]" />
        <div className="bloom top-[-14%] left-[8%] h-[46rem] w-[46rem] animate-[breathe_9s_ease-in-out_infinite]" />
        <div
          className="bloom right-[4%] bottom-[-18%] h-[34rem] w-[34rem]"
          style={{ background: 'radial-gradient(circle,#1d9bf033 0%,transparent 70%)' }}
        />
        {/* Faint grid, the Linear/Arc texture cue */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(#6ef2ff 1px,transparent 1px),linear-gradient(90deg,#6ef2ff 1px,transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <MenuBar onExit={onExit} />
      <FolderGrid />

      {/* Wallpaper wordmark */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-[clamp(3rem,12vw,9rem)] leading-none font-extrabold tracking-tight text-white/[0.025]">
          ARCHIT.AI
        </p>
        <p className="mt-4 text-[10px] font-semibold tracking-[0.34em] text-white/10 uppercase">
          {profile.altTagline}
        </p>
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
