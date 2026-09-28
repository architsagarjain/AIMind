'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays an assistant reply through `/api/speak`.
 *
 * CLIP BY CLIP, WITH NO SEAMS
 * Asking for a whole answer as one clip means waiting for all of it to be
 * synthesised before a sound plays. So the reply is split into clips that
 * grow as they go: one short clause first, so the first sound comes quickly,
 * then a medium clip, then long ones. Each clip takes about as long to make
 * as the one before it takes to play, so the next is ready when it is due.
 *
 * Playback runs on the Web Audio API, not an <audio> element. Swapping an
 * element's source between clips costs a load and a decode each time, and
 * every clip carries its own lead-in and tail of silence; together that was
 * a pause of a second or more between sentences. Here each clip is decoded
 * as soon as it arrives, its silent edges are trimmed, and it is scheduled
 * to start the moment the previous one ends, with a short natural pause.
 *
 * AHEAD OF THE CLICK
 * Resting the pointer on Listen (or focusing it) fetches the first two clips,
 * so the click usually finds them waiting. Clips are kept for the session,
 * keyed by their text, so playing a reply again is instant and costs no
 * requests.
 *
 * `available` starts optimistic and flips to false the first time the route
 * answers 503 (no API key). That keeps the control hidden on deployments
 * without voice configured, without a probe request on every page load.
 */

/** Clip lengths in characters, in order; the last one repeats. */
const CHUNK_SIZES = [90, 170, 300];
/** Only used to cut a long opening sentence at a clause. */
const FIRST_CHUNK = CHUNK_SIZES[0]!;
/** Clips fetched ahead of the one playing. */
const LOOKAHEAD = 3;
/** Clips fetched when the pointer rests on Listen. */
const PREFETCH_CLIPS = 2;
/** How long the pointer rests on Listen before clips are fetched. */
const PREFETCH_DWELL_MS = 120;
/** Compressed clips kept for replay; the oldest is dropped past this. */
const CACHE_SIZE = 40;
/** The pause between two clips, in seconds, once their silences are trimmed. */
const CLIP_GAP_S = 0.16;
/** Below this amplitude a sample counts as silence. */
const SILENCE = 0.008;
/** Kept either side of the speech when trimming, in seconds. */
const TRIM_MARGIN_S = 0.03;

/** Splits text into sentence-aligned chunks that grow: short, medium, then long. */
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
    const limit = CHUNK_SIZES[Math.min(chunks.length, CHUNK_SIZES.length - 1)]!;
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

type AudioContextCtor = typeof AudioContext;

/** Cuts the silent lead-in and tail off a clip, keeping a small margin. */
function trimSilence(ctx: BaseAudioContext, buffer: AudioBuffer): AudioBuffer {
  let start = buffer.length;
  let end = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    let s = 0;
    while (s < data.length && Math.abs(data[s]!) < SILENCE) s++;
    let e = data.length - 1;
    while (e > s && Math.abs(data[e]!) < SILENCE) e--;
    start = Math.min(start, s);
    end = Math.max(end, e);
  }
  if (end <= start) return buffer;
  const margin = Math.round(buffer.sampleRate * TRIM_MARGIN_S);
  start = Math.max(0, start - margin);
  end = Math.min(buffer.length, end + margin);
  if (start === 0 && end === buffer.length) return buffer;
  const out = ctx.createBuffer(buffer.numberOfChannels, end - start, buffer.sampleRate);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    out.copyToChannel(buffer.getChannelData(c).subarray(start, end), c);
  }
  return out;
}

export function useSpeech() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  /** Surfaced next to the control, so a failure is legible rather than silent. */
  const [error, setError] = useState<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  /** Sources scheduled for the current reply, so stopping can silence them all. */
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  /** Bumped on every start and stop; a run that sees a newer value gives up. */
  const runRef = useRef(0);
  /** Clip text → compressed audio, shared by playback, prefetch and replay. */
  const clipsRef = useRef(new Map<string, Promise<ArrayBuffer>>());
  const prefetchTimer = useRef<number | undefined>(undefined);

  /**
   * One request per clip text, however many callers ask. Downloads run to
   * completion even if playback stops, so a clip already paid for in quota
   * is kept for next time. Failures are forgotten so a retry can succeed.
   */
  const clip = useCallback((chunk: string): Promise<ArrayBuffer> => {
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
      return res.arrayBuffer();
    })();

    clips.set(chunk, request);
    request.catch(() => clips.delete(chunk));
    if (clips.size > CACHE_SIZE) clips.delete(clips.keys().next().value!);
    return request;
  }, []);

  /** The shared context, created on first use. Null where Web Audio is missing. */
  const context = useCallback((): AudioContext | null => {
    if (ctxRef.current) return ctxRef.current;
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return null;
    ctxRef.current = new Ctor();
    return ctxRef.current;
  }, []);

  const halt = useCallback(() => {
    runRef.current++;
    for (const source of sourcesRef.current) {
      source.onended = null;
      try {
        source.stop();
      } catch {
        /* never started */
      }
    }
    sourcesRef.current = [];
  }, []);

  useEffect(
    () => () => {
      halt();
      window.clearTimeout(prefetchTimer.current);
      void ctxRef.current?.close().catch(() => {});
    },
    [halt],
  );

  const stop = useCallback(() => {
    halt();
    setSpeakingId(null);
  }, [halt]);

  /** Fetches the first clips of `text` once the pointer has rested briefly. */
  const prefetch = useCallback(
    (text: string) => {
      if (!available) return;
      window.clearTimeout(prefetchTimer.current);
      prefetchTimer.current = window.setTimeout(() => {
        for (const chunk of chunkForSpeech(text).slice(0, PREFETCH_CLIPS)) clip(chunk).catch(() => {});
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
      const ctx = context();
      if (!ctx) {
        setError('This browser cannot play audio.');
        return;
      }
      // Both inside the click: browsers only let a context start from a
      // user gesture. The session type keeps iPhones audible with the ringer
      // switch on silent, as an <audio> element would be.
      const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
      if (session) session.type = 'playback';
      void ctx.resume();

      setSpeakingId(id);
      const run = runRef.current;
      const live = () => runRef.current === run;

      // Decoding detaches its input, so each decode gets a copy and the
      // cached bytes stay reusable.
      const decoded: Promise<AudioBuffer>[] = [];
      const decode = (i: number) =>
        (decoded[i] ??= clip(chunks[i]!).then(async (bytes) => trimSilence(ctx, await ctx.decodeAudioData(bytes.slice(0)))));

      try {
        let at = 0;
        let last: AudioBufferSourceNode | null = null;
        for (let i = 0; i < chunks.length; i++) {
          // Keep the next clips downloading and decoding while this one
          // plays. Errors are handled when each is awaited; this only stops
          // an unhandled rejection warning if playback is stopped first.
          for (let j = i; j <= i + LOOKAHEAD && j < chunks.length; j++) decode(j).catch(() => {});
          const buffer = await decode(i);
          if (!live()) return;

          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          // Straight after the previous clip, or now if the clip arrived late.
          at = Math.max(at, ctx.currentTime + 0.02);
          source.start(at);
          at += buffer.duration + CLIP_GAP_S;
          sourcesRef.current.push(source);
          last = source;
        }
        if (last) {
          await new Promise<void>((resolve) => {
            last.onended = () => resolve();
          });
        }
        if (live()) {
          sourcesRef.current = [];
          setSpeakingId(null);
        }
      } catch (err) {
        if (!live()) return;
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
    [clip, context, halt, speakingId, stop],
  );

  return { speak, stop, prefetch, cancelPrefetch, speakingId, available, error };
}
