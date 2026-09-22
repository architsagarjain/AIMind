'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays an assistant reply through `/api/speak`.
 *
 * One `Audio` element is reused for the session so starting a new reply stops
 * the previous one — overlapping voices is the obvious failure here.
 *
 * `available` starts optimistic and flips to false the first time the route
 * answers 503 (no API key). That keeps the control hidden on deployments
 * without voice configured, without a probe request on every page load.
 */
export function useSpeech() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cleanup = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    audioRef.current?.pause();
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setSpeakingId(null);
  }, [cleanup]);

  const speak = useCallback(
    async (id: string, text: string) => {
      if (speakingId === id) {
        stop();
        return;
      }
      cleanup();
      setSpeakingId(id);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        if (res.status === 503) {
          setAvailable(false);
          setSpeakingId(null);
          return;
        }
        if (!res.ok) throw new Error(`speak failed (${res.status})`);

        const url = URL.createObjectURL(await res.blob());
        urlRef.current = url;

        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.src = url;
        audio.onended = () => setSpeakingId(null);
        audio.onerror = () => setSpeakingId(null);
        await audio.play();
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('[speech]', err);
        }
        setSpeakingId(null);
      }
    },
    [cleanup, speakingId, stop],
  );

  return { speak, stop, speakingId, available };
}
