import { NextResponse } from 'next/server';
import { CHAT_MODEL, getOpenAI } from '@/lib/ai/openai';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { fallbackStream } from '@/lib/ai/fallback';
import { rateLimit } from '@/lib/ai/rate-limit';
import { insertMessage, upsertConversation } from '@/lib/supabase/queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Keep the request bounded — this is a portfolio chat, not a document tool. */
const MAX_MESSAGE_CHARS = 1_500;
const MAX_HISTORY = 12;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages?: IncomingMessage[];
  conversationId?: string;
  visitorId?: string;
}

function clientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anonymous';
}

function isValidMessage(m: unknown): m is IncomingMessage {
  if (typeof m !== 'object' || m === null) return false;
  const { role, content } = m as Record<string, unknown>;
  return (role === 'user' || role === 'assistant') && typeof content === 'string';
}

export async function POST(req: Request) {
  // --- Rate limit -----------------------------------------------------------
  const limit = rateLimit(clientKey(req));
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many messages. Give it a moment.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  // --- Parse + validate -----------------------------------------------------
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages.filter(isValidMessage) : [];
  if (incoming.length === 0) {
    return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
  }

  const history = incoming.slice(-MAX_HISTORY).map((m) => ({
    role: m.role,
    content: m.content.slice(0, MAX_MESSAGE_CHARS),
  }));

  const latest = history[history.length - 1];
  if (!latest || latest.role !== 'user') {
    return NextResponse.json({ error: 'Last message must be from the user.' }, { status: 400 });
  }

  const conversationId = body.conversationId ?? crypto.randomUUID();
  const visitorId = body.visitorId ?? null;

  // Fire-and-forget: persistence must never block or fail the response.
  void upsertConversation({
    conversationId,
    visitorId,
    userAgent: req.headers.get('user-agent'),
    referrer: req.headers.get('referer'),
  }).then(() =>
    insertMessage({ conversationId, role: 'user', content: latest.content }),
  );

  const responseHeaders = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Conversation-Id': conversationId,
  };

  // --- Offline mode ---------------------------------------------------------
  const openai = getOpenAI();
  if (!openai) {
    return new Response(fallbackStream(latest.content), {
      headers: { ...responseHeaders, 'X-AI-Mode': 'offline' },
    });
  }

  // --- Live clone -----------------------------------------------------------
  const startedAt = Date.now();

  try {
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      stream: true,
      temperature: 0.7,
      max_tokens: 700,
      // A low presence penalty keeps the voice consistent across a session.
      presence_penalty: 0.1,
      messages: [{ role: 'system', content: buildSystemPrompt() }, ...history],
    });

    const encoder = new TextEncoder();
    let full = '';

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content;
            if (!delta) continue;
            full += delta;
            controller.enqueue(encoder.encode(delta));
          }
        } catch (err) {
          console.error('[chat] stream failed:', err);
          controller.enqueue(
            encoder.encode('\n\nSomething broke on my end. Try that again in a moment.'),
          );
        } finally {
          controller.close();
          void insertMessage({
            conversationId,
            role: 'assistant',
            content: full,
            model: CHAT_MODEL,
            latencyMs: Date.now() - startedAt,
          });
        }
      },
    });

    return new Response(stream, {
      headers: { ...responseHeaders, 'X-AI-Mode': 'live' },
    });
  } catch (err) {
    console.error('[chat] completion failed:', err);
    // Degrade to the offline responder rather than showing the user an error.
    return new Response(fallbackStream(latest.content), {
      headers: { ...responseHeaders, 'X-AI-Mode': 'offline-fallback' },
    });
  }
}
