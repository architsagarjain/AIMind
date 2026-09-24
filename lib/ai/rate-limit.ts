/**
 * In-memory sliding-window rate limiter.
 *
 * Deliberately per-instance: on Vercel each lambda keeps its own map, so this
 * is a cost guard against a single client hammering the endpoint, not a strict
 * global quota. For a hard global limit, move the counter into Supabase or
 * Upstash — the interface below is the seam to swap behind.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;

const hits = new Map<string, number[]>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/** `max` per minute; 12 by default. */
export function rateLimit(key: string, max = MAX_REQUESTS): RateLimitResult {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= max) {
    const oldest = recent[0] ?? now;
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map cannot grow unbounded on a warm instance.
  if (hits.size > 5_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return { ok: true, remaining: max - recent.length, retryAfterSeconds: 0 };
}
