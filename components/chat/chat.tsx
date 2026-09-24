'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, RotateCcw, Sparkles, Square, Volume2, VolumeX } from 'lucide-react';
import { useChat } from '@/lib/hooks/use-chat';
import { useSpeech } from '@/lib/hooks/use-speech';
import { STARTER_PROMPTS } from '@/lib/ai/prompts';
import { profile } from '@/content/profile';
import { RichText } from './rich-text';
import { useTelemetry } from '@/lib/hooks/use-telemetry';
import { useChatHandoff } from '@/lib/store/chat-handoff';
import { cn } from '@/lib/utils';

/**
 * The Ask Archit chat.
 *
 * Shared by the desktop window and the standalone `/ask` route, so it takes its
 * chrome from props rather than assuming either context.
 */
export function Chat({ compact = false }: { compact?: boolean }) {
  const { messages, isStreaming, error, mode, send, stop, reset } = useChat();
  const speech = useSpeech();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const track = useTelemetry();
  const started = useRef(false);

  // Follow the stream, but only while the user is already near the bottom —
  // yanking them down mid-scroll while reading an earlier answer is hostile.
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
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="flex h-full flex-col">
      {/* ------------------------------------------------------------- stream */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <EmptyState compact={compact} onPick={submit} />
        ) : (
          <div className="mx-auto max-w-2xl space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={cn('flex gap-3', message.role === 'user' && 'justify-end')}
              >
                {message.role === 'assistant' && (
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  </span>
                )}

                <div
                  className={cn(
                    'text-[14px] leading-relaxed',
                    message.role === 'user'
                      ? // iMessage-style: the sender's bubble is the accent colour.
                        'max-w-[85%] rounded-2xl rounded-br-md bg-accent-2 px-4 py-2.5 text-white'
                      : 'max-w-[92%] text-muted',
                  )}
                >
                  {message.content ? (
                    <RichText content={message.content} />
                  ) : (
                    <ThinkingDots />
                  )}

                  {/* Read aloud. Hidden entirely when the deployment has no
                      ElevenLabs key, so it never offers something that 503s. */}
                  {message.role === 'assistant' && message.content && !isStreaming && speech.available && (
                    <button
                      onClick={() => void speech.speak(message.id, message.content)}
                      aria-label={speech.speakingId === message.id ? 'Stop playback' : 'Read aloud'}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-hairline-strong px-2.5 py-1 text-[11px] font-medium text-faint transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {speech.speakingId === message.id ? (
                        <>
                          <VolumeX className="h-3.5 w-3.5" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3.5 w-3.5" />
                          Listen
                        </>
                      )}
                    </button>
                  )}

                  {/* A voice failure names its cause — wrong key, missing model
                      and spent quota are very different fixes. */}
                  {message.role === 'assistant' && speech.error && (
                    <p className="mt-2 text-[11px] text-red-400/90">{speech.error}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {error && (
          <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            {error}
          </p>
        )}
      </div>

      {/* ---------------------------------------------------------- composer */}
      <div className="shrink-0 border-t border-hairline bg-surface/60 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-end gap-2 rounded-2xl border border-hairline-strong surface-2 p-2 transition-colors focus-within:border-accent/40"
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
              placeholder={`Ask ${profile.firstName} anything…`}
              aria-label="Your message"
              className="max-h-40 min-h-[2.5rem] flex-1 resize-none bg-transparent px-3 py-2.5 text-[14px] text-ink placeholder:text-faint focus:outline-none"
            />

            {isStreaming ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop generating"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline-strong surface-2 text-muted transition-colors hover:text-ink"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-void transition-all duration-300 hover:bg-accent disabled:opacity-25 disabled:hover:bg-ink"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
            )}
          </form>

          <div className="mt-2.5 flex items-center justify-between px-1">
            <p className="text-[10px] text-faint">
              {mode === 'live'
                ? `AI clone of ${profile.name}. It can be wrong — verify anything that matters.`
                : 'Pre-written answers for now: the live clone is offline or at capacity.'}
            </p>
            {messages.length > 0 && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-[10px] text-faint transition-colors hover:text-accent"
              >
                <RotateCcw className="h-3 w-3" />
                New chat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1.5 py-2" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
    </span>
  );
}

function EmptyState({ compact, onPick }: { compact: boolean; onPick: (text: string) => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex h-full max-w-2xl flex-col justify-center py-4"
      >
        <div className="relative">
          <div className="bloom top-[-4rem] left-1/2 h-56 w-56 -translate-x-1/2" />

          <div className="relative text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
              <Sparkles className="h-5 w-5 text-accent" />
            </span>
            <h2
              className={cn(
                'mt-5 font-display font-extrabold text-ink',
                compact ? 'text-2xl' : 'text-3xl',
              )}
            >
              Ask Archit
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              {profile.altTagline} This is a digital version of me — trained on my real work at PwC,
              ZenCabs, Cairros and Masters&apos; Union.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          {STARTER_PROMPTS.map((prompt, i) => (
            <motion.button
              key={prompt.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05, duration: 0.5 }}
              onClick={() => onPick(prompt.label)}
              className="group rounded-xl border border-hairline-strong surface-1 px-4 py-3 text-left text-[13px] text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:surface-2 hover:text-ink"
            >
              {prompt.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
