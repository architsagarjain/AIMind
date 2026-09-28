'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays an assistant reply through `/api/speak`.
 *
 * SENTENCE BY SENTENCE
 * Asking for a whole answer as one clip means waiting for all of it to be
 * synthesised and downloaded before a sound plays, which for a long reply is
 * several seconds of silence. So the reply is split into chunks, the first a
 * single short clause, and playback starts as soon as that first clip lands.
 * The next two chunks are fetched while the current one plays, so later clips
 * are ready before they are needed.
 *
 * AHEAD OF THE CLICK
 * Resting the pointer on Listen (or focusing it) fetches the first clip, so
 * the click usually finds it waiting. Clips are kept for the session, keyed
 * by their text, so playing a reply again is instant and costs no requests.
 *
 * One `Audio` element is reused for the session so starting a new reply stops
 * the previous one: overlapping voices is the obvious failure here.
 *
 * `available` starts optimistic and flips to false the first time the route
 * answers 503 (no API key). That keeps the control hidden on deployments
 * without voice configured, without a probe request on every page load.
 */

/** The first chunk is one short clause, so the first sound comes quickly. */
const FIRST_CHUNK = 90;
/** Later chunks are longer: fewer requests, fewer seams between clips. */
const LATER_CHUNK = 300;
/** Clips fetched ahead of the one playing. */
const LOOKAHEAD = 2;
/** How long the pointer rests on Listen before the first clip is fetched. */
const PREFETCH_DWELL_MS = 120;
/** Clips kept for replay; the oldest is dropped past this. */
const CACHE_SIZE = 40;

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
  if (first.length > FIRST_CHUNK * 1.3) {
    const cut = Math.max(
      first.lastIndexOf(', ', FIRST_CHUNK),
      first.lastIndexOf('; ', FIRST_CHUNK),
      first.lastIndexOf(': ', FIRST_CHUNK),
    );
    if (cut > 25) sentences.splice(0, 1, first.slice(0, cut + 1), first.slice(cut + 2));
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
  /** Playback of the current reply; clip downloads are not tied to it. */
  const abortRef = useRef<AbortController | null>(null);
  /** Clip text → object URL, shared by playback, prefetch and replay. */
  const clipsRef = useRef(new Map<string, Promise<string>>());
  const prefetchTimer = useRef<number | undefined>(undefined);

  /**
   * One request per clip text, however many callers ask. Downloads run to
   * completion even if playback stops, so a clip already paid for in quota
   * is kept for next time. Failures are forgotten so a retry can succeed.
   */
  const clip = useCallback((chunk: string): Promise<string> => {
    const clips = clipsRef.current;
    const cached = clips.get(chunk);
    if (cached) return cached;

    const request = (async () => {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chunk }),
      });
      if (res.status === 503) throw new Unavailable();
      if (!res.ok) {
        // A wrong key, a busy free tier or a rejected voice all land here,
        // and the route passes the reason through.
        const detail = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(detail?.error ?? `Playback failed (${res.status})`);
      }
      return URL.createObjectURL(await res.blob());
    })();

    clips.set(chunk, request);
    request.catch(() => clips.delete(chunk));
    if (clips.size > CACHE_SIZE) {
      const [oldest, url] = clips.entries().next().value!;
      clips.delete(oldest);
      void url.then((u) => URL.revokeObjectURL(u), () => {});
    }
    return request;
  }, []);

  const halt = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  }, []);

  useEffect(
    () => () => {
      halt();
      window.clearTimeout(prefetchTimer.current);
      for (const url of clipsRef.current.values()) void url.then((u) => URL.revokeObjectURL(u), () => {});
      clipsRef.current.clear();
    },
    [halt],
  );

  const stop = useCallback(() => {
    halt();
    setSpeakingId(null);
  }, [halt]);

  /** Fetches the first clip of `text` once the pointer has rested briefly. */
  const prefetch = useCallback(
    (text: string) => {
      if (!available) return;
      window.clearTimeout(prefetchTimer.current);
      prefetchTimer.current = window.setTimeout(() => {
        const first = chunkForSpeech(text)[0];
        if (first) clip(first).catch(() => {});
      }, PREFETCH_DWELL_MS);
    },
    [available, clip],
  );

  const cancelPrefetch = useCallback(() => window.clearTimeout(prefetchTimer.current), []);

  const speak = useCallback(
    async (id: string, text: string) => {
      if (speakingId === id) {
        stop();
        return;
      }
      halt();
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

      const play = (url: string) =>
        new Promise<void>((resolve, reject) => {
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error('The audio could not be played.'));
          audio.src = url;
          audio.play().catch(reject);
        });

      try {
        for (let i = 0; i < chunks.length; i++) {
          // Keep the next clips downloading while this one plays. Errors are
          // handled when each clip is awaited; this only stops an unhandled
          // rejection warning if playback is stopped first.
          for (let j = i + 1; j <= i + LOOKAHEAD && j < chunks.length; j++) clip(chunks[j]!).catch(() => {});
          const url = await clip(chunks[i]!);
          if (signal.aborted) return;
          await play(url);
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
        halt();
        setSpeakingId(null);
      }
    },
    [clip, halt, speakingId, stop],
  );

  return { speak, stop, prefetch, cancelPrefetch, speakingId, available, error };
}
