import 'server-only';
import { OPENROUTER_BASE_URL, OPENROUTER_HEADERS, isFreeModelId } from './openrouter-config';

/**
 * Text-to-speech for the AI clone, on whichever free TTS model OpenRouter
 * currently lists.
 *
 * WHICH MODEL
 * Free speech models come and go: Deepgram Flux TTS was free at launch and
 * then its free endpoint was withdrawn, which silently broke every Listen
 * click. So, like the chat, the model is chosen at run time. The live
 * catalogue is read for `:free` models that output audio, known good ones go
 * first, and the one that answers is remembered. When the catalogue cannot be
 * read, the preferred list is tried as it stands. If nothing free answers,
 * the browser speaks the reply with its own voice instead (see useSpeech).
 *
 * ONE PROVIDER, ONE KEY, FREE ONLY
 * The voice runs on the same OpenRouter key as the chat, under the same rule:
 * only a model ID with the `:free` suffix is ever sent. OPENROUTER_TTS_MODEL
 * can name another free TTS model, and anything else in it is ignored, so a
 * typo in an env var cannot turn on billing.
 *
 * DESIGNED TO BE DIAGNOSABLE
 * A TTS integration fails for boring reasons (missing key, a voice the model
 * does not know, the free tier's rate limit) and every one of them surfaces as
 * "it doesn't work". So errors here carry the upstream message, and
 * `GET /api/speak` runs a one-word probe and reports what came back.
 *
 * VOICE
 * Only Flux's featured male voices, which Deepgram names as its strongest
 * all-rounders: Drew first, then Bruce (both American), then Jack (British).
 * If the endpoint rejects a voice, the next one is tried and the one that
 * works is remembered. OPENROUTER_TTS_VOICE puts a voice first.
 *
 * LATENCY
 * The first sound is what a visitor feels, so:
 *  - the route runs on the edge, near the visitor and with no cold start;
 *  - the client asks for a short first clause, then sentence groups, and
 *    fetches ahead while it plays;
 *  - the upstream audio streams straight through;
 *  - a free endpoint sometimes sits in a queue, so a request with no answer
 *    after HEDGE_MS gets a twin, and whichever answers first is used. Same
 *    idea as the chat's hedging, and it only costs a request when the first
 *    one is already slow.
 */

/** Known free TTS models, best first. Only tried while the catalogue still lists them (or cannot be read). */
const PREFERRED_MODELS = ['deepgram/flux-tts:free', 'fish-audio/s2.1-pro-free:free'];

const configuredModel = process.env.OPENROUTER_TTS_MODEL?.trim();
const PINNED = configuredModel && isFreeModelId(configuredModel) ? configuredModel : null;
let workingModel: string | null = null;

/** Deepgram models take Flux voice IDs; for the rest the provider's default voice is used. */
const takesFluxVoice = (model: string) => model.startsWith('deepgram/');

interface CatalogueModel {
  id: string;
  pricing?: Record<string, string | number | undefined>;
  architecture?: { input_modalities?: string[]; output_modalities?: string[]; modality?: string };
}

const outputsAudio = (m: CatalogueModel) =>
  Boolean(
    m.architecture?.output_modalities?.some((o) => /audio|speech/i.test(o)) ||
      /->\s*(audio|speech)/i.test(m.architecture?.modality ?? ''),
  );

/** Every price the catalogue gives must be zero, whatever it is priced per. */
const pricedAtZero = (m: CatalogueModel) =>
  Object.values(m.pricing ?? {}).every((v) => v === undefined || Number(v) === 0);

const CATALOGUE_TTL_MS = 30 * 60 * 1000;
let catalogue: { at: number; models: string[] } | null = null;

/** Free audio-output models in the live catalogue; null when it cannot be read. */
async function catalogueTtsModels(): Promise<string[] | null> {
  if (catalogue && Date.now() - catalogue.at < CATALOGUE_TTL_MS) return catalogue.models;
  const found = new Set<string>();
  let readAny = false;
  // The default listing may leave out non-text models, so ask for audio too.
  for (const query of ['?output_modalities=audio', '']) {
    try {
      const res = await fetch(`${OPENROUTER_BASE_URL}/models${query}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) continue;
      readAny = true;
      const body = (await res.json()) as { data?: CatalogueModel[] };
      for (const m of body.data ?? []) {
        if (isFreeModelId(m.id) && outputsAudio(m) && pricedAtZero(m)) found.add(m.id);
      }
    } catch {
      /* try the other listing */
    }
  }
  if (!readAny) return null;
  catalogue = { at: Date.now(), models: [...found] };
  return catalogue.models;
}

/** The free TTS models to try, in order. */
export async function ttsCandidates(): Promise<{ models: string[]; source: 'catalogue' | 'preferred' }> {
  const listed = await catalogueTtsModels();
  const order = (ids: string[]) => {
    const rank = (id: string) => {
      if (id === workingModel) return -2;
      if (id === PINNED) return -1;
      const i = PREFERRED_MODELS.indexOf(id);
      return i === -1 ? PREFERRED_MODELS.length : i;
    };
    return [...new Set(ids)].sort((a, b) => rank(a) - rank(b));
  };
  if (listed === null) {
    return { models: order([...(PINNED ? [PINNED] : []), ...PREFERRED_MODELS]), source: 'preferred' };
  }
  // A pinned model is honoured only while it is still listed as free.
  return { models: order(listed), source: 'catalogue' };
}

/** Featured male voices only: Drew and Bruce (American), then Jack (British). */
const DEFAULT_VOICES = ['flux-drew-en', 'flux-bruce-en', 'flux-jack-en'];
const configuredVoice = process.env.OPENROUTER_TTS_VOICE?.trim();
const VOICES = configuredVoice
  ? [configuredVoice, ...DEFAULT_VOICES.filter((v) => v !== configuredVoice)]
  : DEFAULT_VOICES;
let workingVoice: string | null = null;

/** Long enough for a full chunk on a slow free endpoint. */
const TIMEOUT_MS = 20_000;
/** A request with no answer by now gets a twin; a healthy one answers well inside it. */
const HEDGE_MS = 2_500;

export const isVoiceConfigured = () => Boolean(process.env.OPENROUTER_API_KEY?.trim());

export interface SynthesisResult {
  stream?: ReadableStream<Uint8Array>;
  contentType?: string;
  error?: string;
  /** Upstream status, so the route can pass a rate limit through as a 429. */
  status?: number;
}

/** Reads the upstream error body, which is where the real reason lives. */
async function upstreamError(res: Response): Promise<string> {
  const body = await res.text().catch(() => '');
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string } | string };
    const message = typeof parsed.error === 'string' ? parsed.error : parsed.error?.message;
    if (message) return `${res.status}: ${message}`;
  } catch {
    /* fall through to the raw body */
  }
  return `${res.status}: ${body.slice(0, 300) || res.statusText}`;
}

/** Streams speech for `text`, or returns why it could not. */
export async function synthesize(text: string): Promise<SynthesisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return { error: 'OPENROUTER_API_KEY is not set.' };

  const { models } = await ttsCandidates();
  if (!models.length) return { error: 'No free text-to-speech model is listed right now.', status: 404 };

  let last: SynthesisResult = { error: 'No free voice accepted the request.' };
  for (const model of models) {
    const voices: (string | undefined)[] = takesFluxVoice(model)
      ? workingVoice
        ? [workingVoice, ...VOICES.filter((v) => v !== workingVoice)]
        : VOICES
      : [undefined];
    for (const voice of voices) {
      const result = await hedged(apiKey, model, voice, text);
      if (result.stream) {
        workingModel = model;
        if (voice) workingVoice = voice;
        return result;
      }
      last = result;
      // A bad key or the free tier's rate limit fails the same way everywhere.
      if (result.status === 401 || result.status === 429) return { error: result.error, status: result.status };
      // Only a rejected voice is worth another voice on the same model.
      if (!result.voiceRejected) break;
    }
    // This model is gone, busy or rejected the request: the next one may not be.
    if (workingModel === model) workingModel = null;
  }
  return { error: last.error, status: last.status };
}

type Attempt = SynthesisResult & { voiceRejected?: boolean };

/**
 * One request, plus a twin if the first has not answered after HEDGE_MS, or
 * at once if it failed in a way a retry can fix (a 5xx, a dropped
 * connection). The first success wins and the other is cancelled. A definite
 * failure (a bad key, a rejected voice, the rate limit) is returned at once:
 * a twin would fail the same way.
 */
function hedged(apiKey: string, model: string, voice: string | undefined, text: string): Promise<Attempt> {
  return new Promise((resolve) => {
    const controllers: AbortController[] = [];
    let pending = 0;
    let settled = false;
    let firstFailure: Attempt | null = null;

    const launch = () => {
      const controller = new AbortController();
      controllers.push(controller);
      pending++;
      void synthesizeWith(apiKey, model, voice, text, controller).then((result) => {
        pending--;
        if (settled) return;
        if (result.stream) {
          settled = true;
          clearTimeout(timer);
          for (const c of controllers) if (c !== controller) c.abort();
          resolve(result);
        } else if (result.slow && controllers.length < 2) {
          // A quick 5xx or a dropped connection: retry once now instead of
          // waiting out the hedge timer.
          firstFailure ??= result;
          clearTimeout(timer);
          launch();
        } else if (pending === 0 || !result.slow) {
          // Nothing left in flight, or a definite answer a twin would repeat.
          settled = true;
          clearTimeout(timer);
          for (const c of controllers) if (c !== controller) c.abort();
          resolve(firstFailure ?? result);
        } else {
          firstFailure ??= result;
        }
      });
    };

    launch();
    const timer = setTimeout(() => {
      if (!settled) launch();
    }, HEDGE_MS);
  });
}

async function synthesizeWith(
  apiKey: string,
  model: string,
  voice: string | undefined,
  text: string,
  controller: AbortController,
): Promise<Attempt & { slow?: boolean }> {
  // A manual timer: AbortSignal.timeout is not on every edge runtime.
  const timeout = setTimeout(() => controller.abort(new Error('timeout')), TIMEOUT_MS);
  try {
    const res = await fetch(`${OPENROUTER_BASE_URL}/audio/speech`, {
      method: 'POST',
      headers: {
        ...OPENROUTER_HEADERS,
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({ model, ...(voice ? { voice } : {}), input: text, response_format: 'mp3' }),
    });
    // Headers are in; the body streams on its own time from here.
    clearTimeout(timeout);

    if (!res.ok || !res.body) {
      const error = `Synthesis failed (${model}${voice ? `, ${voice}` : ''}): ${await upstreamError(res)}`;
      if (res.status === 429) {
        return { error: 'The free voice is busy right now. Try again in a moment.', status: 429 };
      }
      return {
        error,
        status: res.status,
        voiceRejected: res.status >= 400 && res.status < 500 && res.status !== 401 && /voice/i.test(error),
        // An upstream 5xx is often one busy worker; the twin may land elsewhere.
        slow: res.status >= 500,
      };
    }
    return { stream: res.body, contentType: res.headers.get('content-type') || 'audio/mpeg' };
  } catch (err) {
    clearTimeout(timeout);
    const timedOut = controller.signal.reason instanceof Error && controller.signal.reason.message === 'timeout';
    return {
      error: timedOut ? 'The voice took too long to respond.' : `Synthesis threw: ${(err as Error).message}`,
      // A timeout or a dropped connection is worth the twin still in flight.
      slow: true,
    };
  }
}

/**
 * Powers `GET /api/speak`: synthesises one word and reports what came back,
 * so a broken setup can be diagnosed from a URL.
 */
export async function voiceDiagnostics() {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) {
    return {
      configured: false,
      hint: 'Set OPENROUTER_API_KEY in the deployment environment and redeploy.',
    };
  }

  const candidates = await ttsCandidates();
  const started = Date.now();
  const result = await synthesize('Hello.');
  let bytes = 0;
  if (result.stream) {
    const reader = result.stream.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
    }
  }
  return {
    configured: true,
    // Enough to tell two keys apart, not enough to help anyone use one.
    keyPreview: `…${key.slice(-4)}`,
    candidates: candidates.models,
    candidateSource: candidates.source,
    workingModel,
    voices: VOICES,
    workingVoice,
    probe: result.stream
      ? { ok: true, contentType: result.contentType, bytes, ms: Date.now() - started }
      : { ok: false, status: result.status ?? null, error: result.error ?? null },
    hint: result.stream
      ? 'Voice works. If playback still fails in the browser, check the console for an audio error.'
      : 'No free voice answered. The site falls back to the browser voice; the probe error names the reason.',
  };
}
