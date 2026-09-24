import 'server-only';
import OpenAI from 'openai';

/**
 * The live clone runs on OpenRouter, on FREE models only.
 *
 * "Free only" is enforced in layers, so no single mistake can route a request
 * to a paid model:
 *
 *  1. Only model IDs with OpenRouter's `:free` suffix are ever sent. Anything
 *     else is dropped here, including anything supplied through
 *     OPENROUTER_MODELS, so a typo in an env var cannot turn on billing.
 *  2. Candidates are checked against OpenRouter's live catalogue, and kept
 *     only if it prices both prompt and completion at exactly zero. Free
 *     models on OpenRouter come and go often; a hardcoded list would rot, so
 *     the preferences below are an ordering hint, not a guarantee.
 *  3. Each request names its models explicitly (OpenRouter's `models` array),
 *     and OpenRouter only routes to models you name.
 *
 * There is deliberately no OpenAI or other paid provider behind this.
 */

/**
 * OPENROUTER_BASE_URL exists for local tests against a mock and is ignored in
 * production builds, so a stray env var can never send the key elsewhere.
 */
const BASE_URL =
  (process.env.NODE_ENV !== 'production' && process.env.OPENROUTER_BASE_URL) ||
  'https://openrouter.ai/api/v1';

/**
 * Preferred order: strong instruction-followers that hold a persona well.
 * Only used where the live catalogue confirms they are still free; anything
 * missing is skipped, and other currently free models fill in behind them.
 */
const PREFERRED: readonly string[] = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'google/gemma-3-27b-it:free',
  'google/gemini-2.0-flash-exp:free',
];

/** How many models a single request carries in its `models` fallback list. */
const PER_REQUEST = 3;
/** Total candidates tried across all attempts before giving up. */
const MAX_CANDIDATES = 6;
const CATALOGUE_TTL_MS = 60 * 60 * 1000;
const CATALOGUE_TIMEOUT_MS = 4_000;

export const isFreeModelId = (id: string) => /^[\w.-]+\/[\w.:-]+:free$/.test(id);

let client: OpenAI | null = null;

/** Null when no key is set, so the route can use the offline responder instead of failing. */
export function getOpenRouter(): OpenAI | null {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return null;
  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: BASE_URL,
      // Fallback is ours: the SDK's own retries would re-send to the same
      // model and multiply the wait, when the next free model is the better bet.
      maxRetries: 0,
      timeout: 25_000,
      defaultHeaders: {
        // OpenRouter's attribution headers; optional, and they identify the app.
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://archit.ai',
        'X-Title': 'ARCHIT.AI',
      },
    });
  }
  return client;
}

export const isAIConfigured = () => Boolean(process.env.OPENROUTER_API_KEY?.trim());

// ------------------------------------------------------------------ catalogue

interface CatalogueModel {
  id: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string; request?: string };
  architecture?: { input_modalities?: string[]; output_modalities?: string[]; modality?: string };
}

let catalogue: { at: number; free: CatalogueModel[] } | null = null;

const isZero = (v: string | undefined) => v === undefined || Number(v) === 0;

function priceIsZero(m: CatalogueModel): boolean {
  // Missing pricing is not proof of free: require explicit zeros for both.
  return (
    m.pricing?.prompt !== undefined &&
    m.pricing?.completion !== undefined &&
    Number(m.pricing.prompt) === 0 &&
    Number(m.pricing.completion) === 0 &&
    isZero(m.pricing.request)
  );
}

function isTextChat(m: CatalogueModel): boolean {
  const out = m.architecture?.output_modalities;
  const input = m.architecture?.input_modalities;
  if (out || input) return (out ?? ['text']).includes('text') && (input ?? ['text']).includes('text');
  return (m.architecture?.modality ?? 'text->text').endsWith('->text');
}

/** The catalogue's currently free text models, cached for an hour. Public; needs no key. */
async function freeCatalogue(): Promise<CatalogueModel[] | null> {
  if (catalogue && Date.now() - catalogue.at < CATALOGUE_TTL_MS) return catalogue.free;
  try {
    const res = await fetch(`${BASE_URL}/models`, {
      signal: AbortSignal.timeout(CATALOGUE_TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`catalogue ${res.status}`);
    const body = (await res.json()) as { data?: CatalogueModel[] };
    const free = (body.data ?? []).filter((m) => isFreeModelId(m.id) && priceIsZero(m) && isTextChat(m));
    catalogue = { at: Date.now(), free };
    return free;
  } catch (err) {
    console.warn('[openrouter] catalogue unavailable, using preferred list as-is:', err);
    // A stale catalogue beats none; only fall all the way back if there is none.
    return catalogue?.free ?? null;
  }
}

export interface CandidateReport {
  models: string[];
  source: 'catalogue' | 'preferred';
  dropped: string[];
}

/**
 * The free models to try, in order.
 *
 * With the catalogue: preferred models it confirms as free, then the other
 * free models with the most context. Without it: the preferred list, which
 * is `:free` only, so it can fail but never bill.
 */
export async function freeCandidates(): Promise<CandidateReport> {
  const configured = (process.env.OPENROUTER_MODELS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const wanted = configured.length ? configured : [...PREFERRED];
  const dropped = wanted.filter((id) => !isFreeModelId(id));
  const preferred = wanted.filter(isFreeModelId);

  const live = await freeCatalogue();
  if (!live) return { models: preferred.slice(0, MAX_CANDIDATES), source: 'preferred', dropped };

  const liveIds = new Set(live.map((m) => m.id));
  const confirmed = preferred.filter((id) => liveIds.has(id));
  const rest = live
    .filter((m) => !confirmed.includes(m.id) && (m.context_length ?? 0) >= 16_000)
    .sort((a, b) => (b.context_length ?? 0) - (a.context_length ?? 0))
    .map((m) => m.id);
  const notFree = preferred.filter((id) => !liveIds.has(id));
  return {
    models: [...confirmed, ...rest].slice(0, MAX_CANDIDATES),
    source: 'catalogue',
    dropped: [...dropped, ...notFree],
  };
}

/** Splits candidates into per-request groups for OpenRouter's `models` fallback list. */
export function attemptGroups(models: string[]): string[][] {
  const groups: string[][] = [];
  for (let i = 0; i < models.length; i += PER_REQUEST) groups.push(models.slice(i, i + PER_REQUEST));
  return groups;
}
