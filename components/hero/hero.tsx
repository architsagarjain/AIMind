'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, MessageSquare, Play } from 'lucide-react';
import { heroStats, profile } from '@/content/profile';
import { EASE_OUT_EXPO } from '@/lib/utils';

/**
 * Hero overlay: the copy layer on top of the 3D canvas.
 *
 * The figures do the persuading here, so they are given real hierarchy rather
 * than being tucked under the fold — the headline number appears inline in the
 * summary, and the stat strip uses the accent colour instead of plain white.
 *
 * `fade` is driven by scroll progress so the text dissolves as the camera
 * begins its push; by the dive, only the 3D scene is left.
 */

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.2 + i * 0.075, ease: EASE_OUT_EXPO },
  }),
};

interface HeroProps {
  onTalk: () => void;
  onExplore: () => void;
  /** 1 → fully visible, 0 → fully faded. */
  fade: number;
}

interface ActionsProps {
  onTalk: () => void;
  onExplore: () => void;
  className?: string;
}

function Actions({ onTalk, onExplore, className = '' }: ActionsProps) {
  return (
    <motion.div
      custom={6}
      variants={rise}
      initial="hidden"
      animate="show"
      className={`pointer-events-auto items-center gap-3 md:gap-4 ${className}`}
    >
      <button
        onClick={onTalk}
        // Must hold one line at 360px: the arrow drops and padding tightens on
        // phones, where "Talk To Archit" otherwise wrapped onto two lines.
        className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 text-[10px] whitespace-nowrap font-bold tracking-[0.14em] text-void uppercase transition-all duration-300 hover:bg-accent hover:shadow-[var(--shadow-glow)] active:scale-[0.98] md:h-14 md:flex-none md:gap-3 md:px-7 md:text-[11px] md:tracking-[0.16em]"
      >
        <MessageSquare className="h-4 w-4" strokeWidth={2.4} />
        Talk To Archit
        <ArrowRight className="hidden h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:block" />
      </button>

      <button
        onClick={onExplore}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-hairline-strong bg-white/5 px-4 whitespace-nowrap sm:px-5 text-[10px] font-bold tracking-[0.14em] text-ink uppercase backdrop-blur-xl transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 md:h-14 md:gap-3 md:px-7 md:text-[11px] md:tracking-[0.16em]"
      >
        <span className="md:hidden">Explore</span>
        <span className="hidden md:inline">Explore My Work</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
      </button>
    </motion.div>
  );
}

/** Inline emphasis for a figure inside running copy. */
function Figure({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-ink">{children}</span>;
}

export function Hero({ onTalk, onExplore, fade }: HeroProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between px-6 pt-20 pb-5 md:px-12 md:pt-28 md:pb-10"
      style={{
        opacity: fade,
        // Copy drifts up and back as it fades — a parallax depth cue.
        transform: `translate3d(0, ${(1 - fade) * -40}px, 0) scale(${1 - (1 - fade) * 0.04})`,
        filter: fade < 0.98 ? `blur(${(1 - fade) * 6}px)` : undefined,
        willChange: 'opacity, transform',
      }}
    >
      {/* ------------------------------------------------------------- copy */}
      <div className="max-w-xl lg:max-w-2xl">
        {/* Status pill: what he is doing *right now*, which the rest of the
            page can only tell you by implication. */}
        <motion.div
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mb-6 inline-flex max-w-[calc(100%-5.25rem)] items-center gap-2.5 rounded-full border border-hairline-strong bg-white/[0.04] py-1.5 pr-3 pl-2.5 backdrop-blur-xl sm:max-w-none sm:pr-4"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {/* Phones: one clause, slightly tighter tracking, and a max-width
              that stops short of the Skip button sharing this row. Measured,
              not guessed: this fits one line down to 360px, and below that
              the pill wraps inside its own box instead of running under the
              button. */}
          <span className="text-[10px] font-semibold tracking-[0.1em] text-muted uppercase sm:tracking-[0.14em]">
            <span className="hidden sm:inline">{profile.currently.split(',')[0]} · </span>
            {profile.alsoCurrently.split(',')[0]}
          </span>
        </motion.div>

        <motion.p
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="text-[11px] font-semibold tracking-[0.34em] text-muted uppercase"
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-3 font-display text-[clamp(2.6rem,10vw,6.8rem)] leading-[0.86] font-extrabold md:mt-4"
        >
          <span className="block text-ink">ARCHIT</span>{' '}
          {/* The space keeps the heading's text "ARCHIT JAIN" for crawlers and screen readers. */}
          <span className="text-gradient-accent block">JAIN</span>
        </motion.h1>

        <motion.p
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8.5px] font-semibold tracking-[0.14em] text-ink uppercase sm:gap-x-3 sm:text-[10px] sm:tracking-[0.2em] md:mt-6 md:text-[11px]"
        >
          {profile.roles.map((role, i) => (
            <span key={role} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && <span className="text-accent">•</span>}
              {role}
            </span>
          ))}
        </motion.p>

        {/* The summary carries the two numbers worth remembering. */}
        <motion.p
          custom={4}
          variants={rise}
          initial="hidden"
          animate="show"
          // Phones drop it: the stat row carries the same numbers, and the
          // paragraph was what landed across the subject's face.
          className="mt-5 hidden max-w-lg text-[13.5px] leading-relaxed text-muted sm:text-[15px] md:mt-6 md:block md:text-base"
        >
          I turn ambiguous problems into decisions, systems and outcomes.{' '}
          <Figure>₹6+ Cr</Figure> in client cost savings at PwC India, and ZenCabs from launch to a{' '}
          <Figure>₹3 Cr</Figure> annualised run-rate in four months.
        </motion.p>

        {/* Credibility strip — the names do work that adjectives cannot. */}
        <motion.p
          custom={5}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-5 hidden flex-wrap items-center gap-x-3 gap-y-2 text-[9px] font-semibold tracking-[0.2em] text-faint uppercase sm:flex md:mt-6 md:text-[10px]"
        >
          {profile.affiliations.map((org, i) => (
            <span key={org} className="flex items-center gap-3">
              {i > 0 && <span className="h-3 w-px bg-hairline-strong" />}
              {org}
            </span>
          ))}
        </motion.p>

        {/* ---------------------------------------------------------- actions */}
        {/* Desktop: under the copy. Phones get the same buttons at the bottom
            of the frame instead (below), clear of the subject's face. */}
        <Actions onTalk={onTalk} onExplore={onExplore} className="mt-7 hidden md:mt-9 md:flex" />

        <motion.p
          custom={7}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-5 hidden text-xs text-faint sm:block md:mt-6"
        >
          Ask me anything about my journey, projects, experiences or ideas.
        </motion.p>
      </div>

      {/* ------------------------------------------------------------ bottom */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <Actions onTalk={onTalk} onExplore={onExplore} className="flex md:hidden" />
        <motion.dl
          custom={8}
          variants={rise}
          initial="hidden"
          animate="show"
          // Phones: one compact row of four; two rows of two ate a fifth of
          // the screen and sat over the subject's legs and hands.
          className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-9 sm:gap-y-4"
        >
          {heroStats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4 sm:gap-9">
              {i > 0 && <span className="hidden h-9 w-px bg-hairline-strong sm:block" />}
              <div>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-gradient-accent font-display text-lg font-extrabold tabular-nums sm:text-2xl md:text-[30px]">
                  {stat.value}
                </dd>
                <p className="mt-1 text-[8px] font-semibold tracking-[0.12em] text-faint uppercase sm:text-[9px] sm:tracking-[0.16em]">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.dl>

        <motion.button
          custom={9}
          variants={rise}
          initial="hidden"
          animate="show"
          onClick={onTalk}
          className="pointer-events-auto hidden items-center gap-4 rounded-full border border-hairline-strong bg-surface-raised/70 py-2.5 pr-2.5 pl-4 backdrop-blur-2xl transition-all duration-300 hover:border-accent/40 hover:shadow-[var(--shadow-glow-sm)] xl:flex"
        >
          <div className="flex -space-x-2.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="relative h-9 w-9 rounded-full border-2 border-surface-raised bg-gradient-to-br from-[#2a3550] to-[#121a2c]"
              >
                {i === 0 && (
                  <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-surface-raised bg-accent" />
                )}
              </span>
            ))}
          </div>
          <span className="text-left">
            <span className="block text-[10px] font-bold tracking-[0.18em] text-ink uppercase">
              Meet Archit AI
            </span>
            <span className="mt-0.5 block text-[11px] text-faint">
              Same thoughts. Always available.
            </span>
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-void">
            <Play className="h-3.5 w-3.5 fill-current" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}

/** Scroll affordance — a mouse glyph over a draining progress line. */
export function ScrollCue({ progress, fade }: { progress: number; fade: number }) {
  return (
    <div
      className="pointer-events-none absolute top-1/2 right-6 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:right-10 lg:flex"
      style={{ opacity: fade }}
    >
      <span className="flex h-7 w-[18px] items-start justify-center rounded-full border border-hairline-strong pt-1.5">
        <motion.span
          className="h-1.5 w-0.5 rounded-full bg-accent"
          animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
      <span className="text-[9px] font-semibold tracking-[0.28em] text-faint uppercase [writing-mode:vertical-rl]">
        Scroll
      </span>
      <span className="relative h-16 w-px bg-hairline-strong">
        <span
          className="absolute top-0 left-0 w-px bg-accent shadow-[var(--shadow-glow-sm)] transition-[height] duration-150"
          style={{ height: `${progress * 100}%` }}
        />
      </span>
    </div>
  );
}
