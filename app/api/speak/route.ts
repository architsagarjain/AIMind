import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ai/rate-limit';
import { isVoiceConfigured, synthesize } from '@/lib/ai/voice';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Speaks an assistant reply aloud.
 *
 * Text is capped hard: ElevenLabs bills per character and this endpoint is
 * public. That cap is the important guard here — an uncapped TTS route is
 * someone else's quota to burn.
 */
const MAX_CHARS = 1_200;

export async function POST(req: Request) {
  if (!isVoiceConfigured()) {
    // Not an error: the UI hides the control when voice is unavailable.
    return NextResponse.json({ error: 'Voice is not configured.' }, { status: 503 });
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const key = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anonymous';
  const limit = rateLimit(`speak:${key}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests.' },
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

  const audio = await synthesize(text);
  if (!audio) {
    return NextResponse.json({ error: 'Could not generate speech.' }, { status: 502 });
  }

  return new Response(audio, {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
  });
}
