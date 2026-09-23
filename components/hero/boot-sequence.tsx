'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, type TargetAndTransition } from 'framer-motion';
import { AnimatedGrid } from '@/components/ui/animated-grid';
import {
  BOOT_LINES,
  COUNTS,
  IDENTITY,
  INITIALS,
  OS_NAME,
  OS_VERSION,
  ROLE,
  formatClock,
  formatDate,
  greeting,
} from '@/lib/boot-content';
import { profile } from '@/content/profile';
import { EASE_OUT_EXPO } from '@/lib/utils';

/**
 * The ARCHIT.OS boot: an arc-reactor HUD that brings Archit AI online, then
 * opens like an iris onto the desktop.
 *
 * It keeps what worked in the first version (a dark screen, the reactor mark,
 * a live terminal log) and adds a proper hand-off: once the log finishes, a
 * voice waveform comes up with a greeting, and the reactor's core opens out
 * to reveal the desktop, where the prompt to talk to him is waiting. The AI
 * boots, and then invites you to talk to it.
 *
 * The laptop in the hero shows this same reactor on standby (see
 * components/three/standby-texture.ts), so the dive flies into it.
 *
 * About 3.4s. Enter, Space or Escape skips, as does the button.
 */

const LINE_MS = 260;
const LOG_START = 350;
const LOG_END = LOG_START + BOOT_LINES.length * LINE_MS;
const GREET_AT = LOG_END + 120;
const DONE_AT = GREET_AT + 1150;

/**
 * The iris is a CSS variable driving a radial mask; framer animates custom
 * properties fine but its types only know real CSS keys, hence the casts.
 */
const IRIS_CLOSED = { '--iris': '0vmax' } as unknown as TargetAndTransition;
const IRIS_OPEN = {
  '--iris': '160vmax',
  transition: { duration: 0.9, ease: [0.7, 0, 0.2, 1] },
} as unknown as TargetAndTransition;

/** A ring of short ticks, drawn as a dashed circle. */
function ticks(r: number, count: number, len: number) {
  const c = 2 * Math.PI * r;
  return { r, strokeDasharray: `${len} ${c / count - len}` };
}

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState(0);
  const [online, setOnline] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const completed = useRef(false);

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    onComplete();
  };

  useEffect(() => {
    const timers = BOOT_LINES.map((_, i) => setTimeout(() => setLines(i + 1), LOG_START + i * LINE_MS));
    timers.push(setTimeout(() => setOnline(true), GREET_AT));
    timers.push(setTimeout(finish, DONE_AT));
    const clock = setInterval(() => setNow(new Date()), 1000);

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

  const progress = lines / BOOT_LINES.length;
  const R = 90;
  const C = 2 * Math.PI * R;

  return (
    <motion.div
      initial={{ ...IRIS_CLOSED, opacity: 0 }}
      animate={{ opacity: 1 }}
      // The iris: a hole grows from the reactor's core until the boot is gone,
      // uncovering the desktop fading in beneath it.
      exit={IRIS_OPEN}
      transition={{ duration: 0.35 }}
      style={{
        maskImage: 'radial-gradient(circle at 50% 42%, transparent var(--iris), #000 calc(var(--iris) + 1.5px))',
        WebkitMaskImage: 'radial-gradient(circle at 50% 42%, transparent var(--iris), #000 calc(var(--iris) + 1.5px))',
      }}
      className="fixed inset-0 z-1000 overflow-hidden bg-void text-ink"
      role="status"
      aria-live="polite"
      aria-label={`Starting ${OS_NAME}`}
    >
      <AnimatedGrid size={44} opacity={0.55} color="#6ef2ff1f" accent="#6ef2ff" />
      <div className="bloom top-[42%] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-80" />

      {/* ------------------------------------------------------ HUD corners */}
      <div className="pointer-events-none absolute inset-x-5 top-5 flex justify-between font-mono text-[10px] tracking-[0.2em] text-muted uppercase md:inset-x-8 md:top-7">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <p className="text-accent">
            {OS_NAME} <span className="text-faint">{OS_VERSION}</span>
          </p>
          <p className="mt-1 text-faint">
            SYS // <span className={online ? 'text-[#34c759]' : 'text-[#ffb070]'}>{online ? 'Online' : 'Booting'}</span>
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-right">
          <p className="text-ink tabular-nums">{formatClock(now, true)}</p>
          <p className="mt-1 text-faint normal-case tracking-[0.12em]">{formatDate(now)}</p>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-x-8 bottom-7 hidden justify-between font-mono text-[10px] tracking-[0.2em] text-faint uppercase md:flex">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <p>
            Identity <span className="ml-2 text-ink">{IDENTITY}</span>
          </p>
          <p className="mt-1">
            Role <span className="ml-2 text-ink">{ROLE}</span>
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="text-right">
          <p>
            Case studies <span className="ml-2 text-accent">{String(COUNTS.caseStudies).padStart(2, '0')}</span>
          </p>
          <p className="mt-1">
            Milestones <span className="ml-2 text-accent">{String(COUNTS.milestones).padStart(2, '0')}</span>
          </p>
        </motion.div>
      </div>

      {/* ----------------------------------------------------------- centre */}
      <div className="relative flex h-full flex-col items-center justify-center px-6 pb-[4vh]">
        {/* Reactor */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.7, ease: [0.7, 0, 0.2, 1] } }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          className="relative h-[clamp(190px,34vh,270px)] w-[clamp(190px,34vh,270px)]"
        >
          <svg viewBox="0 0 260 260" className="absolute inset-0 overflow-visible" aria-hidden="true">
            <defs>
              <radialGradient id="core" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="#e9feff" />
                <stop offset="45%" stopColor="#6ef2ff" />
                <stop offset="100%" stopColor="#1d9bf0" />
              </radialGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g transform="translate(130 130)" fill="none" stroke="#6ef2ff">
              {/* Outer tick ring, slow */}
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
                <circle {...ticks(124, 90, 2)} strokeOpacity="0.45" strokeWidth="5" />
              </motion.g>
              {/* Arc segments, counter-rotating */}
              <motion.g animate={{ rotate: -360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
                {[0, 90, 180, 270].map((a) => (
                  <path
                    key={a}
                    d={`M ${108 * Math.cos(((a + 8) * Math.PI) / 180)} ${108 * Math.sin(((a + 8) * Math.PI) / 180)} A 108 108 0 0 1 ${108 * Math.cos(((a + 62) * Math.PI) / 180)} ${108 * Math.sin(((a + 62) * Math.PI) / 180)}`}
                    strokeWidth="2.2"
                    strokeOpacity="0.8"
                    strokeLinecap="round"
                  />
                ))}
              </motion.g>
              {/* Progress: fills as the log runs */}
              <circle r={R} strokeOpacity="0.14" strokeWidth="3" />
              <motion.circle
                r={R}
                strokeWidth="3.4"
                strokeLinecap="round"
                transform="rotate(-90)"
                filter="url(#glow)"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: C * (1 - (online ? 1 : progress)) }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
              {/* Inner dashed ring, fast */}
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}>
                <circle {...ticks(72, 24, 9)} strokeOpacity="0.6" strokeWidth="1.6" />
              </motion.g>
              {/* Radar sweep */}
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}>
                <path d="M 0 0 L 60 0 A 60 60 0 0 0 42.4 -42.4 Z" fill="#6ef2ff" fillOpacity="0.16" stroke="none" />
                <line x1="0" y1="0" x2="60" y2="0" strokeOpacity="0.7" strokeWidth="1.2" />
              </motion.g>
              {/* Core */}
              <motion.circle
                r="40"
                fill="url(#core)"
                stroke="none"
                filter="url(#glow)"
                animate={{ opacity: online ? [1, 0.85, 1] : [0.72, 0.95, 0.72] }}
                transition={{ duration: online ? 1.2 : 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </g>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1.5rem,4.2vh,2.1rem)] font-extrabold tracking-tight text-void">
            {INITIALS}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 font-display text-lg font-extrabold tracking-[0.34em] text-ink md:text-xl"
        >
          {OS_NAME}
        </motion.p>
        <p className="mt-1.5 text-[10px] font-semibold tracking-[0.3em] text-faint uppercase">{profile.tagline}</p>

        {/* Log, then the greeting in its place */}
        <div className="relative mt-8 h-[10rem] w-[min(32rem,88vw)] font-mono text-[12px] leading-relaxed md:text-[12.5px]">
          {!online ? (
            BOOT_LINES.slice(Math.max(0, lines - 6), lines).map((line, i, shown) => {
              const last = i === shown.length - 1;
              return (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  // Readable, not decorative: this log is the part of the boot
                  // people actually watch. Older lines step back, not away.
                  animate={{ opacity: last ? 1 : 0.62, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={last ? 'truncate text-[#d7f9ff]' : 'truncate text-[#9fb3c8]'}
                >
                  <span className="mr-2 text-accent">›</span>
                  {line}
                  {last && (
                    <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-[caret_1.1s_steps(1)_infinite] bg-accent" />
                  )}
                </motion.p>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="flex flex-col items-center gap-4 pt-2 text-center"
            >
              {/* Voice waveform */}
              <div className="flex h-10 items-center gap-[3px]" aria-hidden="true">
                {Array.from({ length: 28 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="w-[3px] rounded-full bg-accent"
                    animate={{ height: [4, 8 + ((i * 37) % 26), 5, 12 + ((i * 53) % 20), 4] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: (i % 7) * 0.06, ease: 'easeInOut' }}
                  />
                ))}
              </div>
              <p className="font-sans text-base text-ink md:text-lg">
                {greeting(now)}. I&apos;m {profile.firstName}&apos;s AI.
              </p>
              <p className="font-mono text-[10px] tracking-[0.24em] text-accent uppercase">Archit AI · Online</p>
            </motion.div>
          )}
        </div>

        <div className="mt-2 h-px w-[min(30rem,88vw)] bg-hairline-strong">
          <motion.span
            className="block h-full bg-accent shadow-[var(--shadow-glow-sm)]"
            initial={{ width: '0%' }}
            animate={{ width: `${(online ? 1 : progress) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        <button
          onClick={finish}
          className="mt-7 text-[10px] font-semibold tracking-[0.24em] text-faint uppercase transition-colors hover:text-accent"
        >
          Skip →
        </button>
      </div>
    </motion.div>
  );
}
