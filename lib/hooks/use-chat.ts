'use client';

import { useCallback, useRef, useState } from 'react';
import type { ChatMessage } from '@/types';
import { getVisitorId } from './use-telemetry';

interface UseChatResult {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  /** 'live' once the server confirms a real model is answering. */
  mode: 'unknown' | 'live' | 'offline';
  send: (text: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

/**
 * Appends streamed text, applying any trim markers in it. `\0trim:N\0` means
 * "remove the last N characters": the route sends it when an answer was
 * stopped part-way, to end it on its last whole sentence.
 */
function applyStream(content: string, text: string): string {
  let out = content;
  let last = 0;
  const marker = /\u0000trim:(\d+)\u0000/g;
  for (let m = marker.exec(text); m; m = marker.exec(text)) {
    out += text.slice(last, m.index);
    out = out.slice(0, Math.max(0, out.length - Number(m[1])));
    last = m.index + m[0].length;
  }
  return out + text.slice(last);
}

/**
 * Streaming chat client for `/api/chat`.
 *
 * The response is a raw text stream rather than SSE — there is exactly one
 * consumer and one event type, so the framing would be pure overhead.
 */
export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'unknown' | 'live' | 'offline'>('unknown');

  const abortRef = useRef<AbortController | null>(null);
  const conversationRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setMessages([]);
    setError(null);
    conversationRef.current = null;
  }, [stop]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);

      const userMessage: ChatMessage = {
        id: newId(),
        role: 'user',
        content: trimmed,
        createdAt: Date.now(),
      };
      const assistantId = newId();

      // Snapshot history before the optimistic assistant bubble is added.
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: assistantId, role: 'assistant', content: '', createdAt: Date.now() },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            messages: history,
            conversationId: conversationRef.current,
            visitorId: getVisitorId(),
          }),
        });

        if (!res.ok) {
          const detail = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(detail?.error ?? `Request failed (${res.status})`);
        }

        conversationRef.current = res.headers.get('X-Conversation-Id') ?? conversationRef.current;
        setMode(res.headers.get('X-AI-Mode') === 'live' ? 'live' : 'offline');

        if (!res.body) throw new Error('No response stream.');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        // Holds a trim marker split across two reads until it is whole.
        let carry = '';

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = carry + decoder.decode(value, { stream: true });
          // Each marker has two NULs, so an odd count means the last one is
          // unclosed; it waits for the next read.
          const open = (text.split('\u0000').length - 1) % 2 ? text.lastIndexOf('\u0000') : -1;
          const ready = open === -1 ? text : text.slice(0, open);
          carry = open === -1 ? '' : text.slice(open);
          if (!ready) continue;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: applyStream(m.content, ready) } : m)),
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // User-initiated stop — keep whatever streamed so far.
        } else {
          const message = err instanceof Error ? err.message : 'Something went wrong.';
          setError(message);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId && !m.content
                ? { ...m, content: `I couldn't answer that just now (${message}).` }
                : m,
            ),
          );
        }
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [isStreaming, messages],
  );

  return { messages, isStreaming, error, mode, send, stop, reset };
}
