import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ai/rate-limit';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Keeps the Supabase project awake.
 *
 * Supabase's free plan pauses a project after about a week without database
 * activity, and while it is paused the Vercel integration fails every deploy.
 * A Vercel Cron job calls this route daily (vercel.json), and a GitHub Actions
 * workflow calls it every four days as a backup (.github/workflows/keepalive.yml).
 *
 * Each call does one read and one tiny write, so it counts as real activity:
 * a read, and an `events` row named `keepalive`. It touches nothing else, which
 * is why it can stay public; it is rate limited all the same.
 */
export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  if (!rateLimit(`keepalive:${ip}`, 3).ok) {
    return NextResponse.json({ ok: false, error: 'Too many requests.' }, { status: 429 });
  }

  const db = getSupabaseAdmin();
  if (!db) {
    return NextResponse.json(
      { ok: false, supabase: 'not configured', hint: 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const started = Date.now();
  const read = await db.from('conversations').select('id', { head: true, count: 'estimated' }).limit(1);
  const write = await db
    .from('events')
    .insert({ name: 'keepalive', payload: { via: req.headers.get('user-agent')?.slice(0, 80) ?? null } });

  const error = read.error?.message ?? write.error?.message ?? null;
  return NextResponse.json(
    { ok: !error, supabase: error ? 'error' : 'awake', error, ms: Date.now() - started, at: new Date().toISOString() },
    { status: error ? 502 : 200, headers: { 'Cache-Control': 'no-store' } },
  );
}
