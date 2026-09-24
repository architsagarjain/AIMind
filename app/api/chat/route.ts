import { NextResponse } from 'next/server';
import type OpenAI from 'openai';
import { attemptGroups, freeCandidates, getOpenRouter, isAIConfigured, isFreeModelId } from '@/lib/ai/openrouter';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { fallbackAnswer, fallbackStream } from '@/lib/ai/fallback';
import { GUARD_CHARS, createThinkStripper, looksLikeReasoning } from '@/lib/ai/answer-guard';
import { rateLimit } from '@/lib/ai/rate-limit';
import { insertMessage, upsertConversation } from '@/lib/supabase/queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/**
 * Free models can be slow to start and the route may try more than one, so it
 * needs longer than Vercel Hobby's 10s default. 60s is the Hobby ceiling.
 */
export const maxDuration = 60;

/**
 * Time budget. The response starts immediately and every model is tried
 * inside it, so there is always something on the wire well before Vercel's
 * limit. Waiting for a model to start before responding at all is what
 * produced a 504: a free reasoning model thought silently past the limit.
 */
const TOTAL_BUDGET_MS = 40_000;
/** Per attempt: time for OpenRouter to accept the request. */
const CONNECT_MS = 10_000;
/** Per attempt: time to the first visible word. Reasoning models fail this. */
const FIRST_TOKEN_MS = 15_000;
/** Longest silence tolerated once an answer is under way. */
const IDLE_MS = 15_000;

const TIMEOUT = Symbol('timeout');
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | typeof TIMEOUT> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<typeof TIMEOUT>((resolve) => {
      timer = setTimeout(() => resolve(TIMEOUT), Math.max(0, ms));
    }),
  ]);
}

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
  const deadline = startedAt + TOTAL_BUDGET_MS;
  const left = () => deadline - Date.now();
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: buildSystemPrompt() },
    ...history,
  ];
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = '';
      let model = 'offline';
      const emit = (text: string) => {
        if (!text) return;
        full += text;
        controller.enqueue(encoder.encode(text));
      };

      /**
       * Streams one group of free models into the response.
       *   'done'     an answer was written
       *   'failed'   nothing was shown: error, timeout, empty or reasoning,
       *              so the next group can take over unseen
       *   'cut'      it failed part-way through a visible answer
       */
      const tryGroup = async (group: string[]): Promise<'done' | 'failed' | 'cut'> => {
        // Belt and braces: freeCandidates only returns :free IDs, but this is
        // the last point before a request leaves, so check again here.
        if (!group.every(isFreeModelId)) {
          console.error('[chat] refused a non-free model group:', group);
          return 'failed';
        }
        let upstream: AsyncIterable<OpenAI.Chat.ChatCompletionChunk> & { controller: AbortController };
        try {
          const params = {
            model: group[0]!,
            models: group, // OpenRouter extension: fallback models, tried in order
            stream: true as const,
            temperature: 0.7,
            max_tokens: 700,
            // OpenRouter extension: leave any reasoning out of the response.
            reasoning: { exclude: true },
            messages,
          } as OpenAI.Chat.ChatCompletionCreateParamsStreaming & { models: string[]; reasoning: object };
          upstream = await client.chat.completions.create(params, {
            timeout: Math.min(CONNECT_MS, left()),
          });
        } catch (err) {
          console.warn(`[chat] ${group.join(', ')}: request failed:`, describe(err));
          return 'failed';
        }

        const strip = createThinkStripper();
        const it = upstream[Symbol.asyncIterator]();
        let held = '';
        let shown = false;
        const abort = () => upstream.controller.abort();

        try {
          for (;;) {
            const wait = Math.min(shown ? IDLE_MS : FIRST_TOKEN_MS, left());
            const step = await withTimeout(it.next(), wait);
            if (step === TIMEOUT) {
              abort();
              console.warn(`[chat] ${model}: timed out ${shown ? 'mid-answer' : 'before answering'}`);
              return shown ? 'cut' : 'failed';
            }
            if (step.done) break;
            const chunk = step.value;
            if (chunk.model) model = chunk.model;
            const text = strip.push(chunk.choices[0]?.delta?.content ?? '');
            if (!text) continue;
            if (shown) {
              emit(text);
              continue;
            }
            // Hold the opening back until it can be judged.
            held += text;
            if (held.trimStart().length < GUARD_CHARS) continue;
            if (looksLikeReasoning(held)) {
              abort();
              console.warn(`[chat] ${model}: wrote its reasoning into the answer; next model`);
              return 'failed';
            }
            emit(held.trimStart());
            shown = true;
          }
        } catch (err) {
          console.warn(`[chat] ${model}: stream failed:`, describe(err));
          if (shown) return 'cut';
          return 'failed';
        }

        // A short answer may never reach GUARD_CHARS; judge what there is.
        held += strip.flush();
        if (!shown) {
          const answer = held.trim();
          if (!answer || looksLikeReasoning(answer)) return 'failed';
          emit(answer);
        }
        return 'done';
      };

      let outcome: 'done' | 'failed' | 'cut' = 'failed';
      try {
        const { models } = await freeCandidates();
        for (const group of attemptGroups(models)) {
          if (left() < 3_000) break;
          outcome = await tryGroup(group);
          if (outcome !== 'failed') break;
        }
      } catch (err) {
        console.error('[chat] live clone failed:', describe(err));
      }

      if (outcome === 'cut') {
        emit('\n\nI lost my train of thought there. Ask me that again?');
      } else if (outcome === 'failed') {
        // Every free model failed, timed out or only produced reasoning.
        model = 'offline';
        emit(full ? '' : fallbackAnswer(latest.content, 'unavailable'));
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

  // Answered before any model is tried, so the visitor never meets a gateway
  // timeout. The mode is "live" because a key is set; if every free model
  // fails, the pre-written answer says so in its own last line.
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
