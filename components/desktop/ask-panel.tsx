'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Sparkles } from 'lucide-react';
import { STARTER_PROMPTS } from '@/lib/ai/prompts';
import { profile } from '@/content/profile';
import { INITIALS } from '@/lib/boot-content';
import { useChatHandoff } from '@/lib/store/chat-handoff';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import { useTelemetry } from '@/lib/hooks/use-telemetry';
import { WINDOW_META } from './icons';
import { EASE_OUT_EXPO } from '@/lib/utils';

/**
 * The desktop's centrepiece: a Spotlight-style prompt that starts the chat.
 *
 * The site's whole premise is "don't read my portfolio, talk to it", so the
 * first thing on the desktop is the conversation, not a grid of folders. The
 * folders, dock and menu bar are all still there; this is just what the eye
 * lands on. Asking opens the Ask Archit window with the question already sent
 * (see lib/store/chat-handoff.ts).
 *
 * Shown while no window is open, so it is the desktop's resting state and
 * never sits behind a window you are reading.
 */

const STARTERS = STARTER_PROMPTS.slice(0, 4);

export function AskPanel() {
  const open = useWindows((s) => s.open);
  const ask = useChatHandoff((s) => s.ask);
  const track = useTelemetry();
  const [value, setValue] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const start = (question: string, source: 'typed' | 'starter') => {
    const q = question.trim();
    if (!q) {
      input.current?.focus();
      return;
    }
    ask(q);
    open('ask');
    track('window_opened', { window: 'ask', source: `desktop-prompt-${source}` });
    setValue('');
  };

  const others = WINDOW_IDS.filter((id) => id !== 'ask');

  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.2 } }}
      transition={{ duration: 0.8, delay: 0.25, ease: EASE_OUT_EXPO }}
      aria-labelledby="ask-panel-title"
      className="pointer-events-auto relative w-[min(640px,calc(100vw-24px))] rounded-[26px] border border-white/80 bg-white/60 p-5 shadow-[0_40px_80px_-30px_#0b1a3340,0_0_0_0.5px_#0b1a331a] backdrop-blur-2xl md:p-7"
    >
      {/* Identity */}
      <div className="flex items-center gap-3.5">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d9bf0,#5e5ce6)] shadow-[0_8px_20px_-8px_#5e5ce680]">
          <span className="font-display text-base font-bold text-white">{INITIALS}</span>
          <span className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-[#34c759]" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            Archit AI
            <span className="rounded-full bg-[#34c759]/15 px-2 py-0.5 text-[10px] font-semibold text-[#1f8f3f]">Online</span>
          </p>
          <p className="truncate text-xs text-muted">Answers as {profile.firstName}, from his real work.</p>
        </div>
      </div>

      <h2 id="ask-panel-title" className="mt-5 font-display text-[clamp(1.6rem,5.2vw,2.35rem)] leading-[1.08] font-bold tracking-tight text-ink">
        {profile.altTagline}
      </h2>

      {/* The prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start(value, 'typed');
        }}
        className="mt-5 flex items-center gap-2 rounded-2xl border border-[#0b1a33]/10 bg-white py-2 pr-2 pl-4 shadow-[0_10px_30px_-18px_#0b1a3366] focus-within:border-[#0a84ff]/50 focus-within:ring-4 focus-within:ring-[#0a84ff]/15"
      >
        <Sparkles className="h-4 w-4 shrink-0 text-[#5e5ce6]" aria-hidden="true" />
        <label htmlFor="ask-panel-input" className="sr-only">
          Ask Archit anything
        </label>
        <input
          ref={input}
          id="ask-panel-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask me anything about my work…"
          autoComplete="off"
          // Focus on arrival so a visitor can simply start typing. Not on
          // phones, where it would throw the keyboard over the panel.
          autoFocus={typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches}
          className="h-10 min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-faint focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Ask"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#1d9bf0,#5e5ce6)] text-white shadow-[0_8px_18px_-8px_#5e5ce6] transition-transform active:scale-95"
        >
          <ArrowUp className="h-4.5 w-4.5" strokeWidth={2.4} />
        </button>
      </form>

      {/* Starters */}
      <ul className="mt-3.5 flex flex-wrap gap-2" aria-label="Suggested questions">
        {STARTERS.map((p) => (
          <li key={p.label}>
            <button
              onClick={() => start(p.label, 'starter')}
              className="rounded-full border border-[#0b1a33]/10 bg-white/70 px-3.5 py-1.5 text-[13px] text-muted transition-colors hover:border-[#0a84ff]/40 hover:bg-white hover:text-ink"
            >
              {p.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Everything else is still one click away */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#0b1a33]/8 pt-4 text-xs text-faint">
        <span>Or explore</span>
        {others.map((id) => {
          const { label, Icon, accent } = WINDOW_META[id];
          return (
            <button
              key={id}
              onClick={() => {
                open(id);
                track('window_opened', { window: id, source: 'desktop-prompt' });
              }}
              className="inline-flex items-center gap-1.5 font-medium text-muted transition-colors hover:text-ink"
            >
              <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
              {label}
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
