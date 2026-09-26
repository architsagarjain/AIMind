import 'server-only';
import { OPENROUTER_BASE_URL, OPENROUTER_HEADERS, isFreeModelId } from './openrouter';

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
 * Naveen is Flux's Indian English male voice, the closest match to the person
 * being cloned. If the endpoint rejects a voice, the next one is tried and the
 * one that works is remembered. OPENROUTER_TTS_VOICE puts a voice first.
 *
 * LATENCY
 * The first sound is what a visitor feels. The client asks for one sentence
 * at a time and the upstream audio is streamed straight through, so playback
 * starts on a short first chunk.
 */

const DEFAULT_MODEL = 'deepgram/flux-tts:free';

const configuredModel = process.env.OPENROUTER_TTS_MODEL?.trim();
export const TTS_MODEL = configuredModel && isFreeModelId(configuredModel) ? configuredModel : DEFAULT_MODEL;

/** Indian English male first, then two American male voices as fallbacks. */
const DEFAULT_VOICES = ['flux-naveen-en', 'flux-bruce-en', 'flux-drew-en'];
const configuredVoice = process.env.OPENROUTER_TTS_VOICE?.trim();
const VOICES = configuredVoice
  ? [configuredVoice, ...DEFAULT_VOICES.filter((v) => v !== configuredVoice)]
  : DEFAULT_VOICES;
let workingVoice: string | null = null;

/** Long enough for a 360-character chunk on a slow free endpoint. */
const TIMEOUT_MS = 20_000;

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
    const result = await synthesizeWith(apiKey, voice, text);
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

async function synthesizeWith(
  apiKey: string,
  voice: string,
  text: string,
): Promise<SynthesisResult & { voiceRejected?: boolean }> {
  try {
    const res = await fetch(`${OPENROUTER_BASE_URL}/audio/speech`, {
      method: 'POST',
      headers: {
        ...OPENROUTER_HEADERS,
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({ model: TTS_MODEL, voice, input: text, response_format: 'mp3' }),
    });

    if (!res.ok || !res.body) {
      const error = `Synthesis failed (${voice}): ${await upstreamError(res)}`;
      if (res.status === 429) {
        return { error: 'The free voice is busy right now. Try again in a moment.', status: 429 };
      }
      return {
        error,
        status: res.status,
        voiceRejected: res.status >= 400 && res.status < 500 && res.status !== 401 && /voice/i.test(error),
      };
    }
    return { stream: res.body, contentType: res.headers.get('content-type') || 'audio/mpeg' };
  } catch (err) {
    const timedOut = (err as Error).name === 'TimeoutError';
    return { error: timedOut ? 'The voice took too long to respond.' : `Synthesis threw: ${(err as Error).message}` };
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
