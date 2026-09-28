import 'server-only';

/**
 * OpenRouter settings shared by the chat and the voice. Kept apart from
 * `openrouter.ts` so the speech route, which runs on the edge, does not pull
 * in the OpenAI SDK and the model catalogue just to read three constants.
 */

/**
 * OPENROUTER_BASE_URL exists for local tests against a mock and is ignored in
 * production builds, so a stray env var can never send the key elsewhere.
 */
export const OPENROUTER_BASE_URL =
  (process.env.NODE_ENV !== 'production' && process.env.OPENROUTER_BASE_URL) ||
  'https://openrouter.ai/api/v1';

/** OpenRouter's attribution headers; optional, and they identify the app. */
export const OPENROUTER_HEADERS = {
  'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://archit.ai',
  'X-Title': 'ARCHIT.AI',
};

/** Only IDs with OpenRouter's `:free` suffix are ever sent, for chat and voice alike. */
export const isFreeModelId = (id: string) => /^[\w.-]+\/[\w.:-]+:free$/.test(id);
