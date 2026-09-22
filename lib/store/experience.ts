'use client';

import { create } from 'zustand';

/**
 * The cinematic state machine.
 *
 *   hero → diving → booting → desktop
 *
 * `hero`    scroll-driven camera push toward the avatar's laptop
 * `diving`  the laptop screen has taken over the viewport
 * `booting` the OS boot sequence plays
 * `desktop` the interactive desktop is live and page scroll is released
 *
 * Scroll progress (0→1) drives the 3D camera; crossing the threshold latches
 * the phase forward so a stray scroll-up cannot re-trigger the transition.
 */
export type Phase = 'hero' | 'diving' | 'booting' | 'desktop';

interface ExperienceState {
  phase: Phase;
  /** 0 → 1 across the hero scroll track. */
  progress: number;
  /** True once the user has reached the desktop at least once this session. */
  hasBooted: boolean;
  /** Set when the visitor skips the intro or prefers reduced motion. */
  skipped: boolean;

  setProgress: (p: number) => void;
  setPhase: (p: Phase) => void;
  enterDesktop: () => void;
  skipIntro: () => void;
  returnToHero: () => void;
}

export const useExperience = create<ExperienceState>((set, get) => ({
  phase: 'hero',
  progress: 0,
  hasBooted: false,
  skipped: false,

  setProgress: (p) => {
    const progress = Math.min(1, Math.max(0, p));
    const { phase } = get();

    // Latch forward only. Going back to the hero is an explicit action.
    if (phase === 'hero' && progress >= 0.98) {
      set({ progress, phase: 'diving' });
      return;
    }
    set({ progress });
  },

  setPhase: (phase) => set({ phase }),

  enterDesktop: () => set({ phase: 'desktop', hasBooted: true, progress: 1 }),

  skipIntro: () => set({ phase: 'desktop', hasBooted: true, skipped: true, progress: 1 }),

  returnToHero: () => set({ phase: 'hero', progress: 0 }),
}));
