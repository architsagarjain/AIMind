import 'server-only';

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
 */

const API = 'https://api.elevenlabs.io/v1';

/** Stock male voices, most neutral-professional first. */
const PREFERRED_MALE = ['adam', 'brian', 'daniel', 'george', 'liam', 'will', 'chris', 'callum'];

/**
 * `eleven_multilingual_v2` is the most broadly available model across plans.
 * Turbo/Flash are cheaper and faster but are not on every tier, and a model the
 * plan lacks returns a 422 that reads like a bad request.
 */
export const TTS_MODEL = process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2';

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

/** Cached for the instance; a voice library rarely changes mid-deploy. */
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
    const res = await fetch(`${API}/voices`, {
      headers: { 'xi-api-key': apiKey },
      cache: 'no-store',
    });

    if (!res.ok) {
      // Don't cache a failure — the key may simply have been added late.
      return { ok: false, error: `Voice lookup failed — ${await upstreamError(res)}` };
    }

    const { voices } = (await res.json()) as { voices?: ElevenVoice[] };
    if (!voices?.length) {
      return { ok: false, error: 'The account has no voices available.' };
    }

    const byName = new Map(voices.map((v) => [v.name.toLowerCase(), v]));
    const preferred = PREFERRED_MALE.map((n) => byName.get(n)).find(Boolean);
    const anyMale = voices.find((v) => v.labels?.gender?.toLowerCase() === 'male');
    const chosen = preferred ?? anyMale ?? voices[0];
    if (!chosen) return { ok: false, error: 'No usable voice found.' };

    cached = { ok: true, voiceId: chosen.voice_id, voiceName: chosen.name, source: 'lookup' };
    return cached;
  } catch (err) {
    return { ok: false, error: `Voice lookup threw: ${(err as Error).message}` };
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

  try {
    const res = await fetch(`${API}/text-to-speech/${voice.voiceId}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      cache: 'no-store',
      body: JSON.stringify({
        text,
        model_id: TTS_MODEL,
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
      return { error: `Synthesis failed — ${await upstreamError(res)}` };
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
    keyPreview: `${key.slice(0, 6)}…${key.slice(-4)}`,
    model: TTS_MODEL,
    voice: voice.ok
      ? { id: voice.voiceId, name: voice.voiceName ?? '(from ELEVENLABS_VOICE_ID)', source: voice.source }
      : null,
    error: voice.error ?? null,
    hint: voice.ok
      ? 'Voice resolved. If playback still fails, the model or quota is the next thing to check.'
      : 'The key is set but the API rejected it. Check the key value, the plan, and remaining quota.',
  };
}
