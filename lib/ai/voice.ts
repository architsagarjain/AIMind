import 'server-only';

/**
 * ElevenLabs text-to-speech for the AI clone.
 *
 * VOICE SELECTION
 * The voice is resolved by *name* against the account's own voice list rather
 * than hard-coded to an ID. Voice IDs are account- and catalogue-specific, and
 * a wrong one fails at request time with an opaque 400. Looking it up means the
 * route works against whatever library the key actually has, and
 * `ELEVENLABS_VOICE_ID` still short-circuits it when a specific voice is wanted.
 *
 * The preference list is male voices from the stock library, in order. Anything
 * the API reports with a male gender label is accepted as a fallback before
 * giving up.
 */

const API = 'https://api.elevenlabs.io/v1';

/** Stock male voices, most neutral-professional first. */
const PREFERRED_MALE = ['adam', 'brian', 'daniel', 'george', 'liam', 'will', 'chris', 'callum'];

export const TTS_MODEL = process.env.ELEVENLABS_MODEL ?? 'eleven_turbo_v2_5';

export const isVoiceConfigured = () => Boolean(process.env.ELEVENLABS_API_KEY);

interface ElevenVoice {
  voice_id: string;
  name: string;
  labels?: Record<string, string>;
}

/** Resolved once per server instance; the account's voice list rarely changes. */
let cachedVoiceId: string | null = null;

export async function resolveVoiceId(apiKey: string): Promise<string | null> {
  const configured = process.env.ELEVENLABS_VOICE_ID?.trim();
  if (configured) return configured;
  if (cachedVoiceId) return cachedVoiceId;

  try {
    const res = await fetch(`${API}/voices`, {
      headers: { 'xi-api-key': apiKey },
      // The catalogue is stable; don't pay for it on every request.
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error('[voice] /voices failed:', res.status);
      return null;
    }

    const { voices } = (await res.json()) as { voices: ElevenVoice[] };
    if (!voices?.length) return null;

    const byName = new Map(voices.map((v) => [v.name.toLowerCase(), v]));
    const preferred = PREFERRED_MALE.map((n) => byName.get(n)).find(Boolean);
    const anyMale = voices.find((v) => v.labels?.gender?.toLowerCase() === 'male');
    const chosen = preferred ?? anyMale ?? voices[0];
    if (!chosen) return null;

    cachedVoiceId = chosen.voice_id;
    console.log(`[voice] using "${chosen.name}" (${chosen.voice_id})`);
    return cachedVoiceId;
  } catch (err) {
    console.error('[voice] voice lookup failed:', err);
    return null;
  }
}

/**
 * Streams speech for `text`. Returns null when unconfigured or on failure, so
 * callers degrade to a silent UI rather than surfacing an error.
 */
export async function synthesize(text: string): Promise<ReadableStream<Uint8Array> | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const voiceId = await resolveVoiceId(apiKey);
  if (!voiceId) return null;

  try {
    const res = await fetch(`${API}/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: TTS_MODEL,
        voice_settings: {
          // Stability up, style down: this is someone answering a question about
          // their own career, not performing. Similarity high so the voice stays
          // consistent across a session.
          stability: 0.45,
          similarity_boost: 0.8,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok || !res.body) {
      console.error('[voice] synthesis failed:', res.status, await res.text().catch(() => ''));
      return null;
    }
    return res.body;
  } catch (err) {
    console.error('[voice] synthesis threw:', err);
    return null;
  }
}
