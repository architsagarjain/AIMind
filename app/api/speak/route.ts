import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ai/rate-limit';
import { isVoiceConfigured, synthesize, voiceDiagnostics } from '@/lib/ai/voice';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Text is capped hard: the endpoint is public and the free voice has a shared
 * rate limit, so one visitor must not be able to spend it on a novel.
 */
const MAX_CHARS = 1_200;

const clientKey = (req: Request) =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anonymous';

/**
 * Diagnostics. Visiting `/api/speak` synthesises one word and reports what
 * came back, so "the voice doesn't work" becomes a specific, fixable message
 * rather than a silent 503. Rate limited, since each visit is a real request.
 */
export async function GET(req: Request) {
  if (!rateLimit(`speak-diag:${clientKey(req)}`, 4).ok) {
    return NextResponse.json({ error: 'Too many requests. Give it a moment.' }, { status: 429 });
  }
  return NextResponse.json(await voiceDiagnostics(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(req: Request) {
  if (!isVoiceConfigured()) {
    // Not an error: the UI hides the control when voice is unavailable.
    return NextResponse.json(
      { error: 'Voice is not configured.', hint: 'Set OPENROUTER_API_KEY.' },
      { status: 503 },
    );
  }

  // The client speaks a reply sentence by sentence, so one answer is several
  // small requests; the limit is per chunk, not per answer.
  const limit = rateLimit(`speak:${clientKey(req)}`, 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Give it a moment.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let text: string;
  try {
    const body = (await req.json()) as { text?: unknown };
    if (typeof body.text !== 'string' || !body.text.trim()) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
    }
    text = body.text.trim().slice(0, MAX_CHARS);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { stream, contentType, error, status } = await synthesize(text);
  if (!stream) {
    // Pass the upstream reason through: the caller shows it, and it is the
    // difference between "voice is broken" and "the free tier is busy".
    console.error('[speak]', error);
    return NextResponse.json(
      { error: error ?? 'Could not generate speech.' },
      { status: status === 429 ? 429 : 502 },
    );
  }

  return new Response(stream, {
    headers: { 'Content-Type': contentType ?? 'audio/mpeg', 'Cache-Control': 'no-store' },
  });
}
