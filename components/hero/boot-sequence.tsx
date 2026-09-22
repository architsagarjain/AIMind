'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/content/profile';

/**
 * The OS boot that plays once the camera has flown into the laptop screen.
 *
 * Total runtime is kept near 2.4s: long enough to feel like a system coming up,
 * short enough that nobody reaches for the skip button. The skip is there anyway.
 */

const LINES = [
  'Initialising ARCHIT.OS v1.0',
  'Mounting /experience/consulting … ok',
  'Mounting /experience/startups … ok',
  'Loading ZenCabs growth dataset … 20,000+ users',
  'Loading Cairros engagements … 7+ clients',
  "Syncing Masters' Union coursework … ok",
  'Calibrating personality model … ok',
  'Waking Archit AI …',
];

const LINE_DELAY = 190;

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(0);
  const completed = useRef(false);

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    onComplete();
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisible(i + 1), i * LINE_DELAY));
    });
    timers.push(setTimeout(finish, LINES.length * LINE_DELAY + 620));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-void"
      role="status"
      aria-live="polite"
      aria-label="Starting the interactive desktop"
    >
      {/* Ambient bloom behind the mark */}
      <div className="bloom top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 animate-[breathe_6s_ease-in-out_infinite]" />

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Reactor-style mark */}
        <div className="relative mb-10 h-20 w-20">
          <motion.span
            className="absolute inset-0 rounded-full border border-accent/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="absolute inset-2 rounded-full border border-t-accent border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
          />
          <span className="absolute inset-[30%] rounded-full bg-accent shadow-[var(--shadow-glow)]" />
        </div>

        <p className="font-display text-xl font-extrabold tracking-[0.3em] text-ink">ARCHIT.AI</p>
        <p className="mt-2 text-[10px] font-semibold tracking-[0.3em] text-faint uppercase">
          {profile.tagline}
        </p>
      </motion.div>

      {/* Boot log */}
      <div className="relative z-10 mt-12 h-40 w-[min(30rem,86vw)] font-mono text-[11px] leading-relaxed">
        {LINES.slice(0, visible).map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i === visible - 1 ? 1 : 0.42, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-muted"
          >
            <span className="mr-2 text-accent">›</span>
            {line}
            {i === visible - 1 && (
              <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-accent animate-[caret_1.1s_steps(1)_infinite]" />
            )}
          </motion.p>
        ))}
      </div>

      {/* Progress */}
      <div className="relative z-10 mt-4 h-px w-[min(30rem,86vw)] bg-hairline-strong">
        <motion.span
          className="absolute inset-y-0 left-0 bg-accent shadow-[var(--shadow-glow-sm)]"
          initial={{ width: '0%' }}
          animate={{ width: `${(visible / LINES.length) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <button
        onClick={finish}
        className="relative z-10 mt-10 text-[10px] font-semibold tracking-[0.24em] text-faint uppercase transition-colors hover:text-accent"
      >
        Skip →
      </button>
    </motion.div>
  );
}
