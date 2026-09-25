'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { STARTER_PROMPTS } from '@/lib/ai/prompts';
import { INITIALS } from '@/lib/boot-content';
import { useReducedMotion } from '@/lib/hooks/use-preferences';
import { useChatHandoff } from '@/lib/store/chat-handoff';
import { EASE_OUT_EXPO, cn } from '@/lib/utils';

/**
 * The hero's moving parts. Each one keeps its full text in the DOM from the
 * first render, so crawlers and screen readers get the content, and each one
 * falls back to a still version under prefers-reduced-motion.
 */

// ------------------------------------------------------------------- name

/** Letters rise out of a mask one after another, then the surname lands with a sheen. */
export function HeroName({ first, last, delay = 0.35 }: { first: string; last: string; delay?: number }) {
  const reduced = useReducedMotion();
  const letters = [...first];
  return (
    <>
      <span className="block text-ink" aria-label={first}>
        {letters.map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden pt-[0.06em] pb-[0.02em] align-bottom" aria-hidden>
            <motion.span
              className="inline-block"
              initial={reduced ? false : { y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: delay + i * 0.05, ease: EASE_OUT_EXPO }}
            >
              {ch}
            </motion.span>
          </span>
        ))}
      </span>{' '}
      {/* The space keeps the heading's text "ARCHIT JAIN" for crawlers and screen readers. */}
      <span className="block overflow-hidden pt-[0.06em] pb-[0.02em]">
        <motion.span
          className="hero-sheen inline-block"
          initial={reduced ? false : { y: '105%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: delay + letters.length * 0.05 + 0.05, ease: EASE_OUT_EXPO }}
        >
          {last}
        </motion.span>
      </span>
    </>
  );
}

// ------------------------------------------------------------------ roles

/** One role at a time in a rolling slot, with a counter and a timer bar. */
export function RoleRoller({ roles, interval = 2600 }: { roles: readonly string[]; interval?: number }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || roles.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), interval);
    return () => window.clearInterval(id);
  }, [interval, reduced, roles.length]);

  if (reduced) {
    return (
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {roles.map((role, i) => (
          <span key={role} className="flex items-center gap-3">
            {i > 0 && <span className="text-accent">•</span>}
            {role}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-3 sm:gap-4">
      <span className="sr-only">{roles.join(', ')}</span>
      <span className="font-mono text-accent tabular-nums" aria-hidden>
        {String(index + 1).padStart(2, '0')}
        <span className="text-faint">/{String(roles.length).padStart(2, '0')}</span>
      </span>
      <span className="relative h-px w-10 overflow-hidden bg-hairline-strong sm:w-14" aria-hidden>
        <motion.span
          key={index}
          className="absolute inset-y-0 left-0 bg-accent"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: interval / 1000, ease: 'linear' }}
        />
      </span>
      {/* Every role sits in one column; the slot shows a single line and the
          column slides up by one line per step. The column's own width is the
          longest role, so no role is ever clipped. */}
      <span className="relative block h-[1.4em] overflow-hidden leading-[1.4em]" aria-hidden>
        <motion.span
          className="flex flex-col whitespace-nowrap"
          initial={false}
          animate={{ y: `${-index * 1.4}em` }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          {roles.map((role, i) => (
            <motion.span
              key={role}
              className="block h-[1.4em]"
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {role}
            </motion.span>
          ))}
        </motion.span>
      </span>
    </span>
  );
}

// ------------------------------------------------------------------ stats

const SPLIT = /^(\D*)([\d.]+)(.*)$/;

/**
 * Counts a stat up from zero. The prefix and suffix ("₹", "+ Cr", "K+") stay
 * fixed so the width barely moves while the number runs.
 */
export function CountUp({ value, delay = 0.9, duration = 1.6 }: { value: string; delay?: number; duration?: number }) {
  const reduced = useReducedMotion();
  const match = SPLIT.exec(value);
  const target = match ? Number(match[2]) : NaN;
  const decimals = match?.[2]?.includes('.') ? match[2].split('.')[1]!.length : 0;
  // The final value renders first, so the server HTML carries the real figure.
  const [shown, setShown] = useState(target);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced || !Number.isFinite(target)) return;
    setShown(0);
    let start = 0;
    const timer = window.setTimeout(() => {
      const tick = (t: number) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / (duration * 1000));
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(target * eased);
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [delay, duration, reduced, target]);

  if (!match) return <>{value}</>;
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden>
        {match[1]}
        {shown.toFixed(decimals)}
        {match[3]}
      </span>
    </>
  );
}

// ----------------------------------------------------------------- ticker

/** The affiliations drift past as a slow ticker, faded at both edges. */
export function Marquee({ items }: { items: readonly string[] }) {
  const reduced = useReducedMotion();
  const row = (hidden: boolean) => (
    <span className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((org) => (
        <span key={org} className="flex items-center">
          <span className="px-5">{org}</span>
          <span className="h-1 w-1 rounded-full bg-accent/60" />
        </span>
      ))}
    </span>
  );

  if (reduced) {
    return <span className="flex flex-wrap items-center gap-y-2">{row(false)}</span>;
  }
  return (
    <span className="hero-marquee-mask group relative flex max-w-lg overflow-hidden">
      <span className="hero-marquee flex w-max group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </span>
    </span>
  );
}

// ----------------------------------------------------------------- prompt

/**
 * A prompt bar that types real starter questions. Clicking it asks that
 * question: it parks it with the chat hand-off and opens Ask Archit, which
 * sends it on arrival.
 */
export function PromptTicker({ onTalk, className }: { onTalk: () => void; className?: string }) {
  const reduced = useReducedMotion();
  const questions: string[] = STARTER_PROMPTS.slice(0, 5).map((p) => p.label);
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState<string>(questions[0]!);
  const ask = useChatHandoff((s) => s.ask);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let timer = 0;
    let i = 0;
    let q = 0;
    let text = '';
    const wait = (ms: number, fn: () => void) => {
      timer = window.setTimeout(() => !cancelled && fn(), ms);
    };
    const type = () => {
      const full = questions[q]!;
      if (text.length < full.length) {
        text = full.slice(0, ++i);
        setTyped(text);
        wait(42, type);
      } else wait(1800, erase);
    };
    const erase = () => {
      if (text.length > 0) {
        text = text.slice(0, -1);
        i = text.length;
        setTyped(text);
        wait(18, erase);
      } else {
        q = (q + 1) % questions.length;
        setQi(q);
        wait(250, type);
      }
    };
    setTyped('');
    wait(1400, type);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // questions is derived from a constant list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const question = questions[qi]!;
  return (
    <button
      type="button"
      onClick={() => {
        ask(question);
        onTalk();
      }}
      aria-label={`Ask Archit AI: ${question}`}
      className={cn(
        'group pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-hairline-strong bg-surface-raised/60 py-2 pr-2 pl-2.5 text-left backdrop-blur-2xl transition-all duration-300 hover:border-accent/40 hover:shadow-[var(--shadow-glow-sm)]',
        className,
      )}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d9bf0,#5e5ce6)]">
        <span className="font-display text-[10px] font-bold text-white">{INITIALS}</span>
        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-raised bg-[#34c759]" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink/90">
        {typed}
        {!reduced && <span className="ml-0.5 inline-block h-[1.05em] w-px translate-y-[0.15em] animate-caret bg-accent" />}
      </span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ink text-void transition-colors group-hover:bg-accent">
        <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
      </span>
    </button>
  );
}
