import 'server-only';
import { OPENROUTER_BASE_URL, OPENROUTER_HEADERS, isFreeModelId } from './openrouter-config';

/**
 * Text-to-speech for the AI clone, on OpenRouter's free Deepgram Flux TTS.
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

const DEFAULT_MODEL = 'deepgram/flux-tts:free';

const configuredModel = process.env.OPENROUTER_TTS_MODEL?.trim();
export const TTS_MODEL = configuredModel && isFreeModelId(configuredModel) ? configuredModel : DEFAULT_MODEL;

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

  const voices = workingVoice ? [workingVoice, ...VOICES.filter((v) => v !== workingVoice)] : VOICES;
  let last: SynthesisResult = { error: 'No voice accepted the request.' };
  for (const voice of voices) {
    const result = await hedged(apiKey, voice, text);
    if (result.stream) {
      workingVoice = voice;
      return result;
    }
    last = result;
    // Only a rejected voice is worth another try; a bad key or the free
    // tier's rate limit fails the same way on every voice.
    if (!result.voiceRejected) break;
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
function hedged(apiKey: string, voice: string, text: string): Promise<Attempt> {
  return new Promise((resolve) => {
    const controllers: AbortController[] = [];
    let pending = 0;
    let settled = false;
    let firstFailure: Attempt | null = null;

    const launch = () => {
      const controller = new AbortController();
      controllers.push(controller);
      pending++;
      void synthesizeWith(apiKey, voice, text, controller).then((result) => {
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
  voice: string,
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
      body: JSON.stringify({ model: TTS_MODEL, voice, input: text, response_format: 'mp3' }),
    });
    // Headers are in; the body streams on its own time from here.
    clearTimeout(timeout);

    if (!res.ok || !res.body) {
      const error = `Synthesis failed (${voice}): ${await upstreamError(res)}`;
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
      model: TTS_MODEL,
      hint: 'Set OPENROUTER_API_KEY in the deployment environment and redeploy.',
    };
  }

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
    model: TTS_MODEL,
    voices: VOICES,
    workingVoice,
    probe: result.stream
      ? { ok: true, contentType: result.contentType, bytes, ms: Date.now() - started }
      : { ok: false, status: result.status ?? null, error: result.error ?? null },
    hint: result.stream
      ? 'Voice works. If playback still fails in the browser, check the console for an audio error.'
      : 'The key is set but synthesis failed. The probe error above names the reason.',
  };
}
