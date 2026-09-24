'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays an assistant reply through `/api/speak`.
 *
 * SENTENCE BY SENTENCE
 * Asking for a whole answer as one clip means waiting for all of it to be
 * synthesised and downloaded before a sound plays, which for a long reply is
 * several seconds of silence. So the reply is split into chunks, the first one
 * deliberately short, and playback starts as soon as that first clip arrives.
 * The next chunk is fetched while the current one plays, so later chunks are
 * usually ready by the time they are needed.
 *
 * One `Audio` element is reused for the session so starting a new reply stops
 * the previous one: overlapping voices is the obvious failure here.
 *
 * `available` starts optimistic and flips to false the first time the route
 * answers 503 (no API key). That keeps the control hidden on deployments
 * without voice configured, without a probe request on every page load.
 */

/** The first chunk is short so the first sound comes quickly. */
const FIRST_CHUNK = 140;
/** Later chunks are longer: fewer requests, fewer seams between clips. */
const LATER_CHUNK = 360;

/** Splits text into sentence-aligned chunks, the first one short. */
export function chunkForSpeech(text: string): string[] {
  const clean = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[*_`#>]+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return [];

  // A full stop only ends a sentence when whitespace follows, so "3.5x" and
  // "v2.5" stay whole.
  const sentences = clean.match(/.+?(?:[.!?]+["')\]]*(?=\s|$)|$)/g) ?? [clean];
  // A long opening sentence would delay the first sound, so it is cut at a
  // clause boundary instead.
  const first = sentences[0]?.trim() ?? '';
  if (first.length > FIRST_CHUNK * 1.5) {
    const cut = Math.max(first.lastIndexOf(', ', FIRST_CHUNK), first.lastIndexOf('; ', FIRST_CHUNK));
    if (cut > 40) sentences.splice(0, 1, first.slice(0, cut + 1), first.slice(cut + 2));
  }
  const chunks: string[] = [];
  let current = '';
  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    const limit = chunks.length === 0 ? FIRST_CHUNK : LATER_CHUNK;
    if (current && current.length + sentence.length + 1 > limit) {
      chunks.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

class Unavailable extends Error {}

export function useSpeech() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  /** Surfaced next to the control, so a failure is legible rather than silent. */
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlsRef = useRef<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const cleanup = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
    for (const url of urlsRef.current) URL.revokeObjectURL(url);
    urlsRef.current = [];
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

      const chunks = chunkForSpeech(text);
      if (!chunks.length) return;
      setSpeakingId(id);

      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;

      // Created inside the click, so browsers that gate autoplay on a user
      // gesture treat every later clip on this element as allowed.
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;

      const fetchClip = async (chunk: string): Promise<string> => {
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: chunk }),
          signal,
        });
        if (res.status === 503) throw new Unavailable();
        if (!res.ok) {
          // A wrong key, a model the plan lacks, or exhausted quota all land
          // here, and the route passes the upstream reason through.
          const detail = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(detail?.error ?? `Playback failed (${res.status})`);
        }
        const url = URL.createObjectURL(await res.blob());
        urlsRef.current.push(url);
        return url;
      };

      const play = (url: string) =>
        new Promise<void>((resolve, reject) => {
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error('The audio could not be played.'));
          audio.src = url;
          audio.play().catch(reject);
        });

      try {
        let next: Promise<string> = fetchClip(chunks[0]!);
        for (let i = 0; i < chunks.length; i++) {
          const url = await next;
          if (signal.aborted) return;
          // Start the following request before this clip plays, so it
          // downloads during playback instead of after it.
          if (i + 1 < chunks.length) {
            next = fetchClip(chunks[i + 1]!);
            // Handled when awaited; this only stops an unhandled-rejection
            // warning if playback is stopped first.
            next.catch(() => {});
          }
          await play(url);
          URL.revokeObjectURL(url);
          urlsRef.current = urlsRef.current.filter((u) => u !== url);
          if (signal.aborted) return;
        }
        setSpeakingId(null);
      } catch (err) {
        if (signal.aborted || (err instanceof DOMException && err.name === 'AbortError')) return;
        if (err instanceof Unavailable) {
          // No key configured: hide the control rather than offering
          // something that cannot work.
          setAvailable(false);
        } else {
          console.error('[speech]', err);
          setError(err instanceof Error ? err.message : 'Playback failed.');
        }
        cleanup();
        setSpeakingId(null);
      }
    },
    [cleanup, speakingId, stop],
  );

  return { speak, stop, speakingId, available, error };
}
