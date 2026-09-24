import { NextResponse } from 'next/server';
import type OpenAI from 'openai';
import { attemptGroups, freeCandidates, getOpenRouter, isAIConfigured, isFreeModelId } from '@/lib/ai/openrouter';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { fallbackAnswer, fallbackStream } from '@/lib/ai/fallback';
import { rateLimit } from '@/lib/ai/rate-limit';
import { insertMessage, upsertConversation } from '@/lib/supabase/queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/**
 * Free models can be slow to start and the route may try more than one, so it
 * needs longer than Vercel Hobby's 10s default. 60s is the Hobby ceiling.
 */
export const maxDuration = 60;

/** Per attempt: how long a free model gets to start answering before the next is tried. */
const FIRST_RESPONSE_MS = 12_000;

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
  const client = getOpenRouter();
  if (!client) {
    return new Response(fallbackStream(latest.content, 'unconfigured'), {
      headers: { ...responseHeaders, 'X-AI-Mode': 'offline' },
    });
  }

  // --- Live clone, free models only -----------------------------------------
  const startedAt = Date.now();
  const { models } = await freeCandidates();
  const groups = attemptGroups(models);
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: buildSystemPrompt() },
    ...history,
  ];

  type Stream = AsyncIterable<OpenAI.Chat.ChatCompletionChunk>;
  let next = 0;

  /**
   * Opens a completion on the next group of free models that accepts one.
   * Within a group OpenRouter falls back itself (its `models` list); across
   * groups this loop does. Null once every group has failed.
   */
  const openNext = async (): Promise<{ stream: Stream; group: string[] } | null> => {
    while (next < groups.length) {
      const group = groups[next++]!;
      // Belt and braces: freeCandidates only returns :free IDs, but this is
      // the last point before a request leaves, so check again here.
      if (!group.every(isFreeModelId)) {
        console.error('[chat] refused a non-free model group:', group);
        continue;
      }
      try {
        const params = {
          model: group[0]!,
          models: group, // OpenRouter extension: fallback models, tried in order
          stream: true as const,
          temperature: 0.7,
          max_tokens: 700,
          messages,
        } as OpenAI.Chat.ChatCompletionCreateParamsStreaming & { models: string[] };
        const stream = await client.chat.completions.create(params, { timeout: FIRST_RESPONSE_MS });
        return { stream, group };
      } catch (err) {
        console.warn(`[chat] free models ${group.join(', ')} failed:`, describe(err));
      }
    }
    return null;
  };

  // Find a model that accepts the request before committing to a response,
  // so the mode header is honest in the common case.
  const first = await openNext();
  if (!first) {
    return new Response(fallbackStream(latest.content, 'unavailable'), {
      headers: { ...responseHeaders, 'X-AI-Mode': 'offline-fallback' },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let current: { stream: Stream; group: string[] } | null = first;
      let full = '';
      let model = first.group[0]!;

      while (current) {
        let wrote = false;
        try {
          for await (const chunk of current.stream) {
            if (chunk.model) model = chunk.model;
            const delta = chunk.choices[0]?.delta?.content;
            if (!delta) continue;
            wrote = true;
            full += delta;
            controller.enqueue(encoder.encode(delta));
          }
          // Free models occasionally close a stream having said nothing.
          if (!wrote) throw new Error('empty response');
          break;
        } catch (err) {
          console.warn(`[chat] ${model} failed mid-stream:`, describe(err));
          if (wrote) {
            // Words already on screen cannot be taken back; say so briefly.
            const note = '\n\nI lost my train of thought there. Ask me that again?';
            full += note;
            controller.enqueue(encoder.encode(note));
            break;
          }
          // Nothing shown yet, so the next free model can take over unseen.
          current = await openNext();
          if (!current) {
            full = fallbackAnswer(latest.content, 'unavailable');
            model = 'offline';
            controller.enqueue(encoder.encode(full));
          }
        }
      }

      controller.close();
      void insertMessage({
        conversationId,
        role: 'assistant',
        content: full,
        model,
        latencyMs: Date.now() - startedAt,
      });
    },
  });

  return new Response(stream, {
    headers: { ...responseHeaders, 'X-AI-Mode': 'live' },
  });

}

/** Error summary for logs: status and message, never the request. */
function describe(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { status?: number; message?: string };
    return [e.status, e.message].filter(Boolean).join(' ') || String(err);
  }
  return String(err);
}

/**
 * Diagnostics: whether the clone is live and which free models it would use,
 * in order. Safe to expose; it reveals configuration, never the key.
 */
export async function GET() {
  if (!isAIConfigured()) {
    return NextResponse.json({
      configured: false,
      hint: 'Set OPENROUTER_API_KEY in the deployment environment and redeploy.',
    });
  }
  const report = await freeCandidates();
  return NextResponse.json({
    configured: true,
    freeOnly: true,
    candidates: report.models,
    source: report.source,
    ...(report.dropped.length ? { skipped: report.dropped } : {}),
  });
}
