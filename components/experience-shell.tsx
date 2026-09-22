'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Nav, type NavTarget } from '@/components/hero/nav';
import { Hero, ScrollCue } from '@/components/hero/hero';
import { BootSequence } from '@/components/hero/boot-sequence';
import { SceneFallback } from '@/components/three/scene-fallback';
import { Desktop } from '@/components/desktop/desktop';
import { useExperience } from '@/lib/store/experience';
import { useWindows } from '@/lib/store/windows';
import { useCanRender3D, useReducedMotion } from '@/lib/hooks/use-preferences';
import { useTelemetry } from '@/lib/hooks/use-telemetry';
import { clamp } from '@/lib/utils';
import type { WindowId } from '@/types';

/**
 * The 3D scene is code-split and only requested once the device has been judged
 * capable. three + R3F + drei is ~600KB gzipped — keeping it out of the initial
 * bundle is most of what holds the Lighthouse performance score up.
 */
const Scene = dynamic(() => import('@/components/three/scene'), {
  ssr: false,
  loading: () => <SceneFallback />,
});

/** Scroll runway for the hero cinematic, as a multiple of viewport height.
 *  Collapses to a single screen when the cinematic cannot play, so there is no
 *  dead scroll to wade through before the buttons do anything. */
const TRACK_VH = 3.4;

const NAV_TO_WINDOW: Partial<Record<NavTarget, WindowId>> = {
  about: 'about',
  projects: 'projects',
  resume: 'resume',
};

export function ExperienceShell() {
  const phase = useExperience((s) => s.phase);
  const { setProgress, setPhase, enterDesktop, skipIntro, returnToHero } = useExperience();
  const openWindow = useWindows((s) => s.open);
  const closeAll = useWindows((s) => s.closeAll);

  const reduced = useReducedMotion();
  const can3D = useCanRender3D();
  const track = useTelemetry();

  const trackRef = useRef<HTMLDivElement>(null);
  /** Local mirror of scroll progress; drives the copy fade and the scroll cue. */
  const [scrolled, setScrolled] = useState(0);

  // Copy clears well before the dive so the last beat is pure camera.
  const fade = 1 - clamp((scrolled - 0.06) / 0.34, 0, 1);
  const flash = clamp((scrolled - 0.86) / 0.14, 0, 1);

  // ---------------------------------------------------------------- scroll
  useEffect(() => {
    if (phase !== 'hero') return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      // Coalesce to one update per frame — scroll fires far more often than paint.
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = trackRef.current;
        if (!el) return;
        const distance = el.offsetHeight - window.innerHeight;
        const p = distance > 0 ? clamp(window.scrollY / distance, 0, 1) : 0;

        setProgress(p);
        setScrolled(p);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [phase, setProgress]);

  // ------------------------------------------------------- dive → boot → OS
  useEffect(() => {
    if (phase !== 'diving') return;
    const timer = setTimeout(() => setPhase('booting'), 520);
    return () => clearTimeout(timer);
  }, [phase, setPhase]);

  // Lock the page once the desktop owns the viewport.
  useEffect(() => {
    const locked = phase === 'booting' || phase === 'desktop';
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  // --------------------------------------------------------------- actions
  const goToDesktop = useCallback(
    (windowId?: WindowId) => {
      skipIntro();
      if (windowId) {
        openWindow(windowId);
        track('window_opened', { window: windowId, source: 'hero' });
      }
      window.scrollTo({ top: 0 });
    },
    [openWindow, skipIntro, track],
  );

  const explore = useCallback(() => {
    // Without motion, scrolling a 3.4-screen runway is just friction.
    if (reduced || !can3D) {
      goToDesktop('projects');
      return;
    }
    const el = trackRef.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetHeight - window.innerHeight, behavior: 'smooth' });
  }, [can3D, goToDesktop, reduced]);

  const onNavigate = useCallback(
    (target: NavTarget) => {
      if (target === 'home') {
        returnToHero();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (target === 'contact') {
        window.location.href = 'mailto:hello@architjain.ai';
        return;
      }
      const windowId = NAV_TO_WINDOW[target];
      if (windowId) goToDesktop(windowId);
    },
    [goToDesktop, returnToHero],
  );

  const exitDesktop = useCallback(() => {
    closeAll();
    returnToHero();
    window.scrollTo({ top: 0 });
  }, [closeAll, returnToHero]);

  const showHero = phase === 'hero' || phase === 'diving';
  /** The cinematic only plays when the device can render it and motion is welcome. */
  const cinematic = can3D && !reduced;

  return (
    <>
      {/* ============================================================== HERO */}
      {showHero && (
        <div
          ref={trackRef}
          style={{ height: cinematic ? `${TRACK_VH * 100}vh` : '100vh' }}
          className="relative w-full"
          aria-hidden={phase !== 'hero'}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* 3D layer */}
            <div className="absolute inset-0">
              {can3D ? <Scene /> : <SceneFallback animated={!reduced} />}
            </div>

            {/* Readability scrim.
                On phones the copy column sits directly over the subject's face,
                so the left side needs a real gradient behind it. On wide
                screens the copy has its own empty third and only needs a hint. */}
            <div
              className="pointer-events-none absolute inset-0 md:hidden"
              style={{
                opacity: fade,
                background:
                  'linear-gradient(175deg, #050816f2 0%, #050816d9 34%, #05081699 58%, #05081633 78%, transparent 100%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 hidden md:block"
              style={{
                opacity: fade,
                background:
                  'linear-gradient(100deg, #050816e6 0%, #050816b3 26%, #0508164d 44%, transparent 62%)',
              }}
            />

            {/* Cinematic grade: vignette + a hint of grain over the render */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 45%, transparent 38%, #05081699 78%, #050816 100%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />

            <main id="main">
              <Nav onNavigate={onNavigate} onTalk={() => goToDesktop('ask')} fade={fade} />
              <Hero onTalk={() => goToDesktop('ask')} onExplore={explore} fade={fade} />
              {cinematic && <ScrollCue progress={scrolled} fade={fade} />}
            </main>

            {/* Screen-fill flash as the lens enters the laptop */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: flash,
                background:
                  'radial-gradient(ellipse at 62% 52%, #cffaff 0%, #6ef2ff 34%, #0a1524 72%)',
                willChange: 'opacity',
              }}
            />

            {/* Escape hatch for anyone who would rather not scroll the cinematic */}
            {phase === 'hero' && fade > 0.2 && (
              <button
                onClick={() => goToDesktop()}
                style={{ opacity: fade }}
                className="absolute top-24 right-6 z-30 rounded-full border border-hairline-strong bg-white/5 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase backdrop-blur-xl transition-colors hover:border-accent/40 hover:text-ink md:top-28 md:right-12"
              >
                Skip intro →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== BOOT */}
      <AnimatePresence>
        {phase === 'booting' && (
          <BootSequence
            onComplete={() => {
              enterDesktop();
              track('boot_completed');
            }}
          />
        )}
      </AnimatePresence>

      {/* =========================================================== DESKTOP */}
      <AnimatePresence>
        {phase === 'desktop' && (
          <motion.div key="desktop" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Desktop onExit={exitDesktop} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
