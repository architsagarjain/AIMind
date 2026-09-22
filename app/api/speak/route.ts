import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ai/rate-limit';
import { isVoiceConfigured, synthesize, voiceDiagnostics } from '@/lib/ai/voice';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Text is capped hard: ElevenLabs bills per character and this endpoint is
 * public. That cap is the guard that matters most here.
 */
const MAX_CHARS = 1_200;

/**
 * Diagnostics. Visiting `/api/speak` reports which stage of the setup is
 * failing, so "the voice doesn't work" becomes a specific, fixable message
 * rather than a silent 503.
 */
export async function GET() {
  return NextResponse.json(await voiceDiagnostics(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(req: Request) {
  if (!isVoiceConfigured()) {
    // Not an error: the UI hides the control when voice is unavailable.
    return NextResponse.json(
      { error: 'Voice is not configured.', hint: 'Set ELEVENLABS_API_KEY.' },
      { status: 503 },
    );
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const key = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anonymous';
  const limit = rateLimit(`speak:${key}`);
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

  const { stream, error } = await synthesize(text);
  if (!stream) {
    // Pass the upstream reason through: the caller shows it, and it is the
    // difference between "voice is broken" and "quota exceeded".
    console.error('[speak]', error);
    return NextResponse.json({ error: error ?? 'Could not generate speech.' }, { status: 502 });
  }

  return new Response(stream, {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
  });
}
