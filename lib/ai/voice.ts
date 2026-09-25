import 'server-only';
import { createHash } from 'crypto';
import { unstable_cache } from 'next/cache';

/**
 * ElevenLabs text-to-speech for the AI clone.
 *
 * DESIGNED TO BE DIAGNOSABLE
 * A TTS integration fails for boring reasons — missing key, wrong key, quota
 * spent, a model the plan does not include, a voice ID that belongs to another
 * account — and every one of them surfaces as "it doesn't work". So errors here
 * carry the upstream message rather than being flattened, and `GET /api/speak`
 * reports exactly which stage failed.
 *
 * VOICE SELECTION
 * Resolved by *name* against the account's own library rather than hard-coded
 * to an ID. Voice IDs are account-specific and a wrong one fails with an opaque
 * 400; looking it up means the route works with whatever library the key has.
 * `ELEVENLABS_VOICE_ID` short-circuits it.
 *
 * LATENCY
 * The first sound is what a visitor feels. So: the Flash model first (the
 * lowest-latency one), a 64kbps stream (half the bytes of the default, and
 * indistinguishable for speech), and a voice lookup cached across server
 * instances instead of repeated on every cold start. The client asks for one
 * sentence at a time, so all of this applies to a short first chunk.
 */

const API = 'https://api.elevenlabs.io/v1';

/** Stock male voices, most neutral-professional first. */
const PREFERRED_MALE = ['adam', 'brian', 'daniel', 'george', 'liam', 'will', 'chris', 'callum'];

/**
 * Models in order: Flash v2.5 is the lowest-latency model, several times
 * faster to first audio than Multilingual v2, which was the default and made
 * a long answer sit in silence for seconds. If the account's plan rejects a
 * model, the next is tried and the one that works is remembered.
 * ELEVENLABS_MODEL pins a single model instead.
 */
const MODELS = process.env.ELEVENLABS_MODEL?.trim()
  ? [process.env.ELEVENLABS_MODEL.trim()]
  : ['eleven_flash_v2_5', 'eleven_multilingual_v2'];
let workingModel: string | null = null;

/** Half the default bitrate: plenty for a speaking voice, and half the bytes to wait for. */
const OUTPUT_FORMAT = 'mp3_44100_64';

export const isVoiceConfigured = () => Boolean(process.env.ELEVENLABS_API_KEY?.trim());

interface ElevenVoice {
  voice_id: string;
  name: string;
  labels?: Record<string, string>;
}

export interface VoiceResolution {
  ok: boolean;
  voiceId?: string;
  voiceName?: string;
  source?: 'env' | 'lookup';
  error?: string;
}

/** Cached for the instance, and across instances below. */
let cached: VoiceResolution | null = null;

/** Reads the upstream error body, which is where the real reason lives. */
async function upstreamError(res: Response): Promise<string> {
  const body = await res.text().catch(() => '');
  try {
    const parsed = JSON.parse(body) as { detail?: { message?: string; status?: string } | string };
    const detail = parsed.detail;
    if (typeof detail === 'string') return `${res.status}: ${detail}`;
    if (detail?.message) return `${res.status}: ${detail.message}${detail.status ? ` (${detail.status})` : ''}`;
  } catch {
    /* fall through to the raw body */
  }
  return `${res.status}: ${body.slice(0, 300) || res.statusText}`;
}

export async function resolveVoice(force = false): Promise<VoiceResolution> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) return { ok: false, error: 'ELEVENLABS_API_KEY is not set.' };

  const configured = process.env.ELEVENLABS_VOICE_ID?.trim();
  if (configured) return { ok: true, voiceId: configured, source: 'env' };

  if (cached && !force) return cached;

  try {
    // Cached across server instances, keyed by a hash of the API key (never
    // the key itself), so a rotated key looks its voice up afresh. Failures
    // throw and are not cached: the key may just have been added.
    const found = force
      ? await lookupVoice()
      : await unstable_cache(lookupVoice, ['elevenlabs-voice', keyTag(apiKey)], { revalidate: 86_400 })();
    cached = { ok: true, voiceId: found.voiceId, voiceName: found.voiceName, source: 'lookup' };
    return cached;
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

const keyTag = (key: string) => createHash('sha256').update(key).digest('hex').slice(0, 12);

/** Picks a male voice from the account's library. Throws with the reason on failure. */
async function lookupVoice(): Promise<{ voiceId: string; voiceName: string }> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim() ?? '';
  {
    const res = await fetch(`${API}/voices`, {
      headers: { 'xi-api-key': apiKey },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Voice lookup failed: ${await upstreamError(res)}`);

    const { voices } = (await res.json()) as { voices?: ElevenVoice[] };
    if (!voices?.length) throw new Error('The account has no voices available.');

    const byName = new Map(voices.map((v) => [v.name.toLowerCase(), v]));
    const preferred = PREFERRED_MALE.map((n) => byName.get(n)).find(Boolean);
    const anyMale = voices.find((v) => v.labels?.gender?.toLowerCase() === 'male');
    const chosen = preferred ?? anyMale ?? voices[0];
    if (!chosen) throw new Error('No usable voice found.');
    return { voiceId: chosen.voice_id, voiceName: chosen.name };
  }
}

export interface SynthesisResult {
  stream?: ReadableStream<Uint8Array>;
  error?: string;
}

/** Streams speech for `text`, or returns why it could not. */
export async function synthesize(text: string): Promise<SynthesisResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) return { error: 'ELEVENLABS_API_KEY is not set.' };

  const voice = await resolveVoice();
  if (!voice.ok || !voice.voiceId) return { error: voice.error ?? 'Could not resolve a voice.' };

  const models = workingModel ? [workingModel, ...MODELS.filter((m) => m !== workingModel)] : MODELS;
  let lastError = 'No model accepted the request.';
  for (const model of models) {
    const result = await synthesizeWith(apiKey, voice.voiceId, model, text);
    if (result.stream) {
      workingModel = model;
      return result;
    }
    lastError = result.error ?? lastError;
    // Only a model the plan does not allow is worth another try; a bad key or
    // spent quota fails the same way on every model.
    if (!result.modelRejected) break;
  }
  return { error: lastError };
}

async function synthesizeWith(
  apiKey: string,
  voiceId: string,
  model: string,
  text: string,
): Promise<SynthesisResult & { modelRejected?: boolean }> {
  try {
    const res = await fetch(`${API}/text-to-speech/${voiceId}/stream?output_format=${OUTPUT_FORMAT}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      cache: 'no-store',
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          // Stability up, style down: this is someone answering a question about
          // their own career, not performing.
          stability: 0.45,
          similarity_boost: 0.8,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok || !res.body) {
      const error = `Synthesis failed (${model}): ${await upstreamError(res)}`;
      return { error, modelRejected: res.status < 500 && /model/i.test(error) };
    }
    return { stream: res.body };
  } catch (err) {
    return { error: `Synthesis threw: ${(err as Error).message}` };
  }
}

/** Powers `GET /api/speak`, so a broken setup can be diagnosed from a URL. */
export async function voiceDiagnostics() {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) {
    return {
      configured: false,
      hint: 'Set ELEVENLABS_API_KEY in the deployment environment and redeploy.',
    };
  }

  const voice = await resolveVoice(true);
  return {
    configured: true,
    // Enough to tell two keys apart, not enough to help anyone use one.
    keyPreview: `…${key.slice(-4)}`,
    models: MODELS,
    workingModel,
    voice: voice.ok
      ? { id: voice.voiceId, name: voice.voiceName ?? '(from ELEVENLABS_VOICE_ID)', source: voice.source }
      : null,
    error: voice.error ?? null,
    hint: voice.ok
      ? 'Voice resolved. If playback still fails, the model or quota is the next thing to check.'
      : 'The key is set but the API rejected it. Check the key value, the plan, and remaining quota.',
  };
}
