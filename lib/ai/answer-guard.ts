/**
 * Keeps a model's private reasoning out of the visitor's answer.
 *
 * Free models on OpenRouter include reasoning models, and some write their
 * thinking into the answer itself, either inside <think> tags or as plain
 * prose ("Here's a thinking process: 1. Analyze user input…"). One did, and
 * recited the persona's hard rules and knowledge base to a visitor.
 *
 * Two defences:
 *  - <think>…</think> blocks are stripped wherever they appear, even when a
 *    tag is split across stream chunks.
 *  - The opening of an answer is held back until there is enough of it to
 *    judge (GUARD_CHARS). If it reads as reasoning, the model is abandoned
 *    and the next free model answers instead, so the visitor never sees it.
 */

/**
 * How much of an answer to hold back before showing any of it. Every opener
 * below is anchored to the start, so 80 characters is enough to judge, and
 * shorter means the first words appear sooner.
 */
export const GUARD_CHARS = 80;

const REASONING_OPENERS: RegExp[] = [
  /^\s*<think>/i,
  /^\s*here'?s (a |my )?(thinking|thought) process/i,
  /^\s*(thinking( process)?|reasoning|analysis|thought process)\s*:/i,
  /^\s*(okay|ok|alright|so|hmm),?\s+(the user|let me|let's|i need to|i should|i'll)/i,
  /^\s*(the )?user (is )?(asking|asks|wants|wrote|said)/i,
  /^\s*[#*\s]*(1\.|step 1:?)?\s*\**\s*(analy[sz]e|understand|identify)\s+(the\s+)?(user|request|question|input|query)/i,
];

/** Things only reasoning about the prompt would mention. */
const PROMPT_TALK = /knowledge base|system prompt|hard rules|persona|the instructions say|verified facts/i;

export function looksLikeReasoning(opening: string): boolean {
  return REASONING_OPENERS.some((r) => r.test(opening)) || PROMPT_TALK.test(opening);
}

const OPEN = '<think>';
const CLOSE = '</think>';

/**
 * Streaming <think> stripper. Feed it chunks; it returns the text that is
 * safe to pass on, holding back only a possible partial tag at the end.
 */
export function createThinkStripper() {
  let inThink = false;
  let pending = '';
  return {
    push(chunk: string): string {
      pending += chunk;
      let out = '';
      for (;;) {
        if (inThink) {
          const end = pending.indexOf(CLOSE);
          if (end === -1) {
            // Keep just enough to catch a closing tag split across chunks.
            pending = pending.slice(-(CLOSE.length - 1));
            return out;
          }
          pending = pending.slice(end + CLOSE.length);
          inThink = false;
        } else {
          const start = pending.indexOf(OPEN);
          if (start === -1) {
            const keep = OPEN.length - 1;
            out += pending.slice(0, Math.max(0, pending.length - keep));
            pending = pending.slice(Math.max(0, pending.length - keep));
            return out;
          }
          out += pending.slice(0, start);
          pending = pending.slice(start + OPEN.length);
          inThink = true;
        }
      }
    },
    /** Whatever is left at the end of the stream (never inside a think block). */
    flush(): string {
      const rest = inThink ? '' : pending;
      pending = '';
      return rest;
    },
  };
}
