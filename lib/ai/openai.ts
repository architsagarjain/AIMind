import OpenAI from 'openai';

/**
 * Lazily-constructed OpenAI client.
 *
 * Returns null rather than throwing when the key is missing so the chat route
 * can fall back to the offline responder instead of 500-ing.
 */
let client: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new OpenAI({ apiKey });
  return client;
}

export const CHAT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

export const isAIConfigured = () => Boolean(process.env.OPENAI_API_KEY);
