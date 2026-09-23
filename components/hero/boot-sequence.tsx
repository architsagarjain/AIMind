'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallpaper } from '@/components/desktop/wallpaper';
import {
  LOCK_INITIALS,
  LOCK_NAME,
  LOCK_STATS,
  UNLOCK_STEPS,
  formatLockDate,
  formatLockTime,
} from '@/lib/lock-screen';
import { EASE_OUT_EXPO } from '@/lib/utils';

/**
 * The ARCHIT.OS lock screen, unlocking. Plays once the camera has flown into
 * the laptop, and hands over to the desktop.
 *
 * It is the same screen the laptop shows in the hero, at full size: same
 * wallpaper, same clock, same widgets, same avatar (the laptop draws it on a
 * canvas from the same content; see lib/lock-screen.ts). So the dive lands on
 * exactly what the visitor was flying towards, and the unlock then clears to a
 * desktop on that same wallpaper. The boot this replaced was a dark terminal
 * log between a light laptop screen and a light desktop.
 *
 * About 2.3s end to end. Enter, Space or Escape skips, as does the button.
 */

const STEP_MS = 440;
const TOTAL_MS = UNLOCK_STEPS.length * STEP_MS + 260;
const RING = 2 * Math.PI * 58;

const rise = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.05 + i * 0.06, ease: EASE_OUT_EXPO },
});

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const completed = useRef(false);

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    onComplete();
  };

  useEffect(() => {
    const timers = UNLOCK_STEPS.map((_, i) => setTimeout(() => setStep(i), i * STEP_MS));
    timers.push(setTimeout(finish, TOTAL_MS));
    const clock = setInterval(() => setNow(new Date()), 15_000);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(clock);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // The desktop fades in over this on the same wallpaper, so only the
      // lock screen's own content visibly leaves.
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.15 } }}
      transition={{ duration: 0.35 }}
      className="os-light fixed inset-0 z-1000 overflow-hidden bg-void font-sans text-ink"
      role="status"
      aria-live="polite"
      aria-label="Unlocking the interactive desktop"
    >
      <Wallpaper />

      <motion.div
        exit={{ opacity: 0, y: -28, transition: { duration: 0.45, ease: EASE_OUT_EXPO } }}
        className="relative flex h-full flex-col items-center px-6 pt-[9vh] pb-[6vh]"
      >
        {/* Date and clock */}
        <motion.p {...rise(0)} className="text-lg font-semibold text-[#0b1a33]/60 md:text-xl">
          {formatLockDate(now)}
        </motion.p>
        <motion.p
          {...rise(1)}
          className="font-display text-[clamp(5.5rem,17vw,11.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-[#0b1a33]/85 tabular-nums"
        >
          {formatLockTime(now)}
        </motion.p>

        {/* Stat widgets */}
        <motion.ul {...rise(2)} className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4" aria-label="Highlights">
          {LOCK_STATS.map((s) => (
            <li
              key={s.label}
              className="rounded-[20px] border border-white/80 bg-white/50 px-4 py-4 text-center shadow-[0_10px_30px_-12px_#0b1a3326] backdrop-blur-xl"
            >
              <p className="font-display text-2xl font-extrabold tracking-tight text-[#0a6f93] md:text-[1.7rem]">
                {s.value}
              </p>
              <p className="mt-1 text-[10px] leading-tight font-semibold tracking-[0.14em] text-[#0b1a33]/55 uppercase">
                {s.label}
              </p>
            </li>
          ))}
        </motion.ul>

        <div className="flex-1" />

        {/* Avatar with the unlock ring */}
        <motion.div {...rise(3)} className="relative h-[136px] w-[136px]">
          <svg viewBox="0 0 136 136" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="68" cy="68" r="58" fill="none" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="3" />
            <motion.circle
              cx="68"
              cy="68"
              r="58"
              fill="none"
              stroke="url(#unlock)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={RING}
              initial={{ strokeDashoffset: RING }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: TOTAL_MS / 1000 - 0.1, ease: [0.45, 0, 0.2, 1] }}
            />
            <defs>
              <linearGradient id="unlock" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1d9bf0" />
                <stop offset="100%" stopColor="#5e5ce6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-[20px] flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d9bf0,#5e5ce6)] shadow-[0_12px_30px_-10px_#5e5ce680]">
            <span className="font-display text-[2.1rem] font-bold text-white">{LOCK_INITIALS}</span>
          </div>
        </motion.div>

        <motion.p {...rise(4)} className="mt-4 text-xl font-semibold text-[#0b1a33]/85">
          {LOCK_NAME}
        </motion.p>

        {/* Current step, crossfading in place */}
        <div className="relative mt-3 h-8 w-full max-w-sm">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-x-0 mx-auto w-fit rounded-full border border-white/80 bg-white/45 px-4 py-1.5 text-[13px] font-medium text-[#0b1a33]/65 shadow-[0_8px_24px_-12px_#0b1a3333] backdrop-blur-xl"
          >
            {UNLOCK_STEPS[step]}
          </motion.p>
        </div>

        <button
          onClick={finish}
          className="mt-6 text-[11px] font-semibold tracking-[0.2em] text-[#0b1a33]/40 uppercase transition-colors hover:text-[#0b1a33]/75"
        >
          Skip
        </button>
      </motion.div>
    </motion.div>
  );
}
