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
  /** Surfaced next to the control, so a failure is legible rather than silent. */
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
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
          // No key configured: hide the control rather than offering something
          // that cannot work.
          setAvailable(false);
          setSpeakingId(null);
          return;
        }
        if (!res.ok) {
          // Anything else is a real failure worth showing — a wrong key, a
          // model the plan lacks, or exhausted quota all land here, and the
          // route passes the upstream reason through.
          const detail = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(detail?.error ?? `Playback failed (${res.status})`);
        }

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
          setError(err instanceof Error ? err.message : 'Playback failed.');
        }
        setSpeakingId(null);
      }
    },
    [cleanup, speakingId, stop],
  );

  return { speak, stop, speakingId, available, error };
}
