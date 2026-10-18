import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ai/rate-limit';
import { getSupabaseAdmin, supabaseEnv } from '@/lib/supabase/server';

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

  const env = supabaseEnv();
  const db = getSupabaseAdmin();
  if (!db) {
    return NextResponse.json(
      {
        ok: false,
        supabase: 'not configured',
        found: env,
        // Names only, so a mismatch can be spotted from this page. Never values.
        supabaseVarsPresent: Object.keys(process.env).filter((k) => /SUPABASE|POSTGRES/.test(k)).sort(),
        hint: 'Set the Supabase URL and service-role (or secret) key in Vercel, for example NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then redeploy.',
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const started = Date.now();
  const read = await db.from('conversations').select('id', { head: true, count: 'estimated' }).limit(1);
  const write = await db
    .from('events')
    .insert({ name: 'keepalive', payload: { via: req.headers.get('user-agent')?.slice(0, 80) ?? null } });

  // If the site's tables were never created, still touch the database: the
  // auth admin API reads the auth schema, which every project has.
  let authCheck: string | null = null;
  if (read.error || write.error) {
    const auth = await db.auth.admin.listUsers({ page: 1, perPage: 1 });
    authCheck = auth.error ? `auth: ${auth.error.message}` : 'auth: ok';
  }

  const tablesOk = !read.error && !write.error;
  const awake = tablesOk || authCheck === 'auth: ok';
  return NextResponse.json(
    {
      ok: awake,
      supabase: awake ? 'awake' : 'error',
      tables: tablesOk ? 'ok' : (read.error?.message ?? write.error?.message),
      ...(authCheck ? { authCheck } : {}),
      env,
      ms: Date.now() - started,
      at: new Date().toISOString(),
    },
    { status: awake ? 200 : 502, headers: { 'Cache-Control': 'no-store' } },
  );
}
