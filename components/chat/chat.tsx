'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, RotateCcw, Square, Volume2, VolumeX } from 'lucide-react';
import { useChat } from '@/lib/hooks/use-chat';
import { useSpeech } from '@/lib/hooks/use-speech';
import { STARTER_PROMPTS } from '@/lib/ai/prompts';
import { INITIALS } from '@/lib/boot-content';
import { profile } from '@/content/profile';
import { RichText } from './rich-text';
import { useTelemetry } from '@/lib/hooks/use-telemetry';
import { useChatHandoff } from '@/lib/store/chat-handoff';
import { cn } from '@/lib/utils';

/**
 * Ask Archit, as a native ARCHIT.OS app.
 *
 * WHY IT LOOKS LIKE MESSAGES
 * The desktop opens on a prompt panel with Archit's avatar, an Online badge
 * and a rounded input. The conversation that follows used to open as a
 * generic chatbot page, and /ask was a third, dark design. One conversation
 * wore three faces. This is one app in one theme wherever it appears: the
 * same identity as the panel, the platform's own messaging conventions
 * (grey bubbles in, blue bubbles out, suggested replies above a pill
 * composer), and the light OS tokens even on the standalone route.
 */

/** iMessage blue and incoming grey: the two colours people already read as a chat. */
const OUTGOING = 'bg-[#0a84ff] text-white';
const INCOMING = 'bg-[#e9e9eb] text-[#1d1d1f]';

const GREETING = `Hi, I'm ${profile.firstName}'s AI clone. I answer from his real work at ZenCabs, PwC India, Cairros and Masters' Union, so ask me anything you would ask him in an interview.`;

export function Chat() {
  const { messages, isStreaming, error, mode, send, stop, reset } = useChat();
  const speech = useSpeech();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const track = useTelemetry();
  const started = useRef(false);

  // Follow the stream, but only while the reader is already near the bottom:
  // pulling them down while they read an earlier answer is hostile.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 140;
    if (nearBottom) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || isStreaming) return;
    if (!started.current) {
      started.current = true;
      track('chat_started');
    }
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    void send(value);
    // Keep focus in the composer so a follow-up needs no click.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // A question asked from the desktop's prompt panel, before this window existed.
  const pending = useChatHandoff((s) => s.pending);
  useEffect(() => {
    if (!pending || isStreaming) return;
    const q = useChatHandoff.getState().take();
    if (q) submit(q);
    // submit is recreated each render; the question itself is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, isStreaming]);

  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  };

  const live = mode === 'live';
  const lastId = messages.at(-1)?.id;

  return (
    <div className="os-light flex h-full flex-col bg-white font-sans text-ink">
      {/* ------------------------------------------------------ contact header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-hairline bg-[#f6f6f8]/90 px-4 py-2.5 backdrop-blur-xl">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d9bf0,#5e5ce6)]">
          <span className="font-display text-[13px] font-bold text-white">{INITIALS}</span>
          <span
            className={cn(
              'absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[#f6f6f8]',
              live ? 'bg-[#34c759]' : 'bg-[#ff9f0a]',
            )}
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-tight font-semibold text-ink">Archit AI</p>
          <p className="truncate text-[12px] leading-tight text-faint">
            {live ? 'Online · answers from his real work' : 'Away · replying with pre-written answers'}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={reset}
            aria-label="New conversation"
            title="New conversation"
            className="flex h-8 w-8 items-center justify-center rounded-full text-faint transition-colors hover:bg-black/5 hover:text-ink"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </header>

      {/* ------------------------------------------------------------- thread */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5"
        role="log"
        aria-live="polite"
        aria-label="Conversation with Archit AI"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-1.5">
          <p className="mb-2 text-center text-[11px] font-medium text-faint">Today</p>

          <Bubble role="assistant">{GREETING}</Bubble>

          {messages.map((message) => {
            const mine = message.role === 'user';
            const speaking = speech.speakingId === message.id;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={cn('flex flex-col', mine ? 'items-end' : 'items-start', 'mt-1.5')}
              >
                <Bubble role={message.role}>
                  {message.content ? <RichText content={message.content} /> : <TypingDots />}
                </Bubble>

                {/* Read aloud. Hidden entirely when the deployment has no
                    ElevenLabs key, so it never offers something that 503s. */}
                {!mine && message.content && !(isStreaming && message.id === lastId) && speech.available && (
                  <button
                    onClick={() => void speech.speak(message.id, message.content)}
                    aria-label={speaking ? 'Stop playback' : 'Read aloud'}
                    className="mt-1 ml-2 inline-flex items-center gap-1 text-[11px] font-medium text-faint transition-colors hover:text-[#0a84ff]"
                  >
                    {speaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    {speaking ? 'Stop' : 'Listen'}
                  </button>
                )}
                {!mine && speech.error && message.id === lastId && (
                  <p className="mt-1 ml-2 text-[11px] text-[#d70015]">{speech.error}</p>
                )}
              </motion.div>
            );
          })}

          {error && <p className="my-2 text-center text-[12px] text-[#d70015]">{error}</p>}
        </div>
      </div>

      {/* ----------------------------------------------------------- composer */}
      <div className="shrink-0 border-t border-hairline bg-[#f6f6f8]/90 backdrop-blur-xl">
        {messages.length === 0 && (
          <ul
            className="flex gap-2 overflow-x-auto px-3 pt-3 [scrollbar-width:none] sm:flex-wrap sm:px-5 [&::-webkit-scrollbar]:hidden"
            aria-label="Suggested questions"
          >
            {/* Phones scroll through all of them; wider screens show the
                first four in one row, as the desktop prompt panel does. */}
            {STARTER_PROMPTS.map((prompt, i) => (
              <li key={prompt.label} className={cn('shrink-0', i >= 4 && 'sm:hidden')}>
                <button
                  onClick={() => submit(prompt.label)}
                  className="rounded-full border border-[#0a84ff]/30 bg-white px-3.5 py-1.5 text-[13px] whitespace-nowrap text-[#0a84ff] transition-colors hover:bg-[#0a84ff] hover:text-white"
                >
                  {prompt.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mx-auto flex max-w-2xl items-end gap-2 px-3 py-3 sm:px-5"
        >
          <textarea
            ref={inputRef}
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              autoGrow(e.target);
            }}
            onKeyDown={(e) => {
              // Enter sends; Shift+Enter is a newline.
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            placeholder="Message Archit AI"
            aria-label="Your message"
            className="max-h-[132px] min-h-[38px] flex-1 resize-none rounded-[19px] border border-black/15 bg-white px-4 py-2 text-[15px] leading-[1.35] text-ink placeholder:text-faint focus:border-[#0a84ff]/60 focus:outline-none"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop generating"
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-black/10 text-ink transition-colors hover:bg-black/15"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#0a84ff] text-white transition-opacity disabled:opacity-30"
            >
              <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.6} />
            </button>
          )}
        </form>
        <p className="-mt-1 pb-2.5 text-center text-[10.5px] text-faint">
          AI clone of {profile.name}. It can be wrong, so check anything that matters with him.
        </p>
      </div>
    </div>
  );
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const mine = role === 'user';
  return (
    <div
      className={cn(
        'max-w-[85%] px-3.5 py-2 text-[15px] leading-[1.45] sm:max-w-[75%]',
        'rounded-[18px]',
        mine
          ? `${OUTGOING} self-end rounded-br-[6px] [&_a]:text-white`
          : `${INCOMING} self-start rounded-bl-[6px]`,
        // Model text is formatted by RichText; its muted greys are for the
        // dark theme, so bubbles pin their own text colour.
        '[&_strong]:text-inherit',
      )}
    >
      {children}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Archit AI is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-[#8e8e93]"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
    </span>
  );
}
