import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ai/rate-limit';
import { trackEvent } from '@/lib/supabase/queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Events the client is allowed to report. Anything else is dropped. */
const ALLOWED = new Set([
  'window_opened',
  'project_viewed',
  'milestone_opened',
  'resume_downloaded',
  'chat_started',
  'boot_completed',
]);

export async function POST(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  const key = forwarded?.split(',')[0]?.trim() || 'anonymous';
  if (!rateLimit(`telemetry:${key}`).ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const body = (await req.json()) as {
      name?: string;
      payload?: Record<string, unknown>;
      visitorId?: string;
    };

    if (!body.name || !ALLOWED.has(body.name)) {
      return NextResponse.json({ ok: false, error: 'Unknown event.' }, { status: 400 });
    }

    void trackEvent({
      name: body.name,
      payload: body.payload,
      visitorId: body.visitorId ?? null,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
