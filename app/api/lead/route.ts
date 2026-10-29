import { NextResponse } from 'next/server';
import { profile } from '@/content/profile';
import { rateLimit } from '@/lib/ai/rate-limit';
import { getSupabaseAdmin } from '@/lib/supabase/server';

/**
 * Enquiries from /work-with-me.
 *
 * Each one is saved to the `leads` table in Supabase and, when RESEND_API_KEY
 * is set, emailed to Archit with the sender as reply-to, so answering is one
 * click. An enquiry counts as received only if at least one of the two
 * worked; otherwise the visitor is told to email directly, so no lead is ever
 * silently lost.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const INTENTS = ['hiring', 'consulting', 'other'] as const;
type Intent = (typeof INTENTS)[number];

const LABEL: Record<Intent, string> = {
  hiring: 'Hiring',
  consulting: 'Consulting',
  other: 'Enquiry',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

async function notify(lead: { name: string; email: string; organisation: string; intent: Intent; message: string; source: string }) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;
  const to = process.env.LEAD_NOTIFY_EMAIL?.trim() || profile.links.email;
  // onboarding@resend.dev works with no domain set up, for mail to the
  // Resend account's own address, which is the case here.
  const from = process.env.LEAD_FROM_EMAIL?.trim() || 'ARCHIT.AI <onboarding@resend.dev>';
  const body = [
    `${LABEL[lead.intent]} enquiry from ${lead.name}${lead.organisation ? `, ${lead.organisation}` : ''}`,
    `Email: ${lead.email}`,
    `Page: ${lead.source}`,
    '',
    lead.message,
    '',
    '(Reply to this email to answer them directly.)',
  ].join('\n');
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
        subject: `[${LABEL[lead.intent]}] ${lead.name}${lead.organisation ? ` (${lead.organisation})` : ''}`,
        text: body,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) console.error('[lead] email failed:', res.status, await res.text().catch(() => ''));
    return res.ok;
  } catch (e) {
    console.error('[lead] email failed:', (e as Error).message);
    return false;
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  if (!rateLimit(`lead:${ip}`, 4).ok) {
    return NextResponse.json({ ok: false, error: 'Too many messages. Give it a minute.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // A field people never see. Bots fill it; pretend all went well.
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const lead = {
    name: text(body.name, 100),
    email: text(body.email, 200).toLowerCase(),
    organisation: text(body.organisation, 120),
    intent: (INTENTS as readonly string[]).includes(body.intent as string) ? (body.intent as Intent) : 'other',
    message: text(body.message, 3000),
    source: text(body.source, 200) || '/work-with-me',
  };
  if (!lead.name || !EMAIL.test(lead.email) || lead.message.length < 10) {
    return NextResponse.json(
      { ok: false, error: 'Please add your name, a valid email and a few words about what you need.' },
      { status: 400 },
    );
  }

  const emailed = await notify(lead);

  let stored = false;
  const db = getSupabaseAdmin();
  if (db) {
    const { error } = await db.from('leads').insert({
      ...lead,
      organisation: lead.organisation || null,
      referrer: req.headers.get('referer'),
      user_agent: req.headers.get('user-agent'),
      emailed,
    });
    if (error) console.error('[lead] save failed:', error.message);
    else stored = true;
  }

  if (!stored && !emailed) {
    return NextResponse.json(
      { ok: false, error: `That didn't go through. Please email ${profile.links.email} directly.` },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true });
}
