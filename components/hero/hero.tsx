'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, MessageSquare, Play } from 'lucide-react';
import { heroStats, profile } from '@/content/profile';
import { EASE_OUT_EXPO } from '@/lib/utils';

/**
 * Hero overlay: the copy layer that sits on top of the 3D canvas.
 *
 * `fade` is driven by scroll progress so the text dissolves as the camera
 * begins its push — the 3D scene should be the only thing left by the dive.
 */

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.25 + i * 0.09, ease: EASE_OUT_EXPO },
  }),
};

interface HeroProps {
  onTalk: () => void;
  onExplore: () => void;
  /** 1 → fully visible, 0 → fully faded. */
  fade: number;
}

export function Hero({ onTalk, onExplore, fade }: HeroProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between px-6 pt-24 pb-5 md:px-12 md:pt-36 md:pb-10"
      style={{
        opacity: fade,
        // Copy drifts up and back slightly as it fades — a parallax depth cue.
        transform: `translate3d(0, ${(1 - fade) * -40}px, 0) scale(${1 - (1 - fade) * 0.04})`,
        filter: fade < 0.98 ? `blur(${(1 - fade) * 6}px)` : undefined,
        willChange: 'opacity, transform',
      }}
    >
      {/* ------------------------------------------------------------- copy */}
      <div className="max-w-xl lg:max-w-2xl">
        <motion.p
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="text-[11px] font-semibold tracking-[0.34em] text-muted uppercase"
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-3 font-display text-[clamp(2.6rem,11vw,7.5rem)] leading-[0.86] font-extrabold md:mt-4"
        >
          <span className="block text-ink">ARCHIT</span>
          <span className="block text-gradient-accent">JAIN</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8.5px] font-semibold tracking-[0.14em] text-ink uppercase sm:gap-x-3 sm:text-[10px] sm:tracking-[0.2em] md:mt-7 md:text-[11px]"
        >
          {profile.roles.map((role, i) => (
            <span key={role} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && <span className="text-accent">•</span>}
              {role}
            </span>
          ))}
        </motion.p>

        <motion.p
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-5 max-w-lg text-[13.5px] leading-relaxed text-muted sm:text-[15px] md:mt-7 md:text-base"
        >
          I build, market and scale ideas. From consulting at PwC to launching ZenCabs in Jammu, to
          studying at Masters&apos; Union — I&apos;m always curious about what&apos;s next.
        </motion.p>

        {/* ---------------------------------------------------------- actions */}
        <motion.div
          custom={4}
          variants={rise}
          initial="hidden"
          animate="show"
          className="pointer-events-auto mt-7 flex flex-wrap items-center gap-3 md:mt-10 md:gap-4"
        >
          <button
            onClick={onTalk}
            className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-[10px] font-bold tracking-[0.14em] text-void uppercase transition-all duration-300 hover:bg-accent hover:shadow-[var(--shadow-glow)] active:scale-[0.98] md:h-14 md:gap-3 md:px-7 md:text-[11px] md:tracking-[0.16em]"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={2.4} />
            Talk To Archit
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExplore}
            className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-hairline-strong bg-white/5 px-6 text-[10px] font-bold tracking-[0.14em] text-ink uppercase backdrop-blur-xl transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 md:h-14 md:gap-3 md:px-7 md:text-[11px] md:tracking-[0.16em]"
          >
            Explore My Work
            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
          </button>
        </motion.div>

        <motion.p
          custom={5}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-5 hidden text-xs text-faint sm:block md:mt-6"
        >
          Ask me anything about my journey, projects, experiences or ideas.
        </motion.p>
      </div>

      {/* ------------------------------------------------------------ bottom */}
      <div className="flex items-end justify-between gap-8">
        {/* Stats */}
        <motion.dl
          custom={6}
          variants={rise}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-10 sm:gap-y-4"
        >
          {heroStats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4 sm:gap-10">
              {i > 0 && <span className="hidden h-8 w-px bg-hairline-strong sm:block" />}
              <div>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-lg font-extrabold text-ink tabular-nums sm:text-2xl md:text-[28px]">
                  {stat.value}
                </dd>
                <p className="mt-1 text-[8px] font-semibold tracking-[0.12em] text-faint uppercase sm:text-[9px] sm:tracking-[0.18em]">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.dl>

        {/* Meet-the-AI card */}
        <motion.button
          custom={7}
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

/**
 * Scroll affordance — a mouse glyph over a draining progress line.
 *
 * Lives on the right edge rather than under the copy: the left column already
 * carries the headline, buttons and stat strip, and anything placed there
 * collides with the description at common viewport heights.
 */
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
