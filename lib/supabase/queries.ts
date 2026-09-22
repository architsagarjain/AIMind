import 'server-only';
import { getSupabaseAdmin } from './server';

/**
 * Persistence helpers.
 *
 * Every function here is best-effort and never throws into the request path —
 * analytics failing must not take down the chat. Errors are logged and swallowed.
 */

export interface ConversationRow {
  id: string;
  visitor_id: string | null;
  user_agent: string | null;
  referrer: string | null;
}

/** Finds or creates the conversation row for a visitor session. */
export async function upsertConversation(input: {
  conversationId: string;
  visitorId?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
}): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;

  const { error } = await db.from('conversations').upsert(
    {
      id: input.conversationId,
      visitor_id: input.visitorId ?? null,
      user_agent: input.userAgent ?? null,
      referrer: input.referrer ?? null,
      last_message_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (error) console.error('[supabase] upsertConversation failed:', error.message);
}

/** Appends a single message to a conversation. */
export async function insertMessage(input: {
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string | null;
  latencyMs?: number | null;
  tokens?: number | null;
}): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;

  const { error } = await db.from('messages').insert({
    conversation_id: input.conversationId,
    role: input.role,
    content: input.content,
    model: input.model ?? null,
    latency_ms: input.latencyMs ?? null,
    tokens: input.tokens ?? null,
  });

  if (error) console.error('[supabase] insertMessage failed:', error.message);
}

/** Records a lightweight product event (window opened, project viewed, etc). */
export async function trackEvent(input: {
  name: string;
  payload?: Record<string, unknown>;
  visitorId?: string | null;
}): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;

  const { error } = await db.from('events').insert({
    name: input.name,
    payload: input.payload ?? {},
    visitor_id: input.visitorId ?? null,
  });

  if (error) console.error('[supabase] trackEvent failed:', error.message);
}
