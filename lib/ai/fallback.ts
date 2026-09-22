import { profile } from '@/content/profile';
import { projects } from '@/content/projects';

/**
 * Deterministic offline responder.
 *
 * Used when OPENAI_API_KEY is absent so a fresh clone still demos end-to-end
 * instead of erroring. Answers are hand-written from the same content files the
 * model reads, so nothing here claims anything the real clone could not.
 * It is intentionally keyword-matched and dumb — it must never be mistaken for
 * the real thing, so the response is prefixed as offline mode.
 */

interface FallbackEntry {
  keys: string[];
  answer: string;
}

const cairros = projects.find((p) => p.slug === 'cairros');

const ENTRIES: FallbackEntry[] = [
  {
    keys: ['masters', "master's", 'union', 'why study', 'mba'],
    answer:
      "I spent three years doing growth and strategy work — consulting at PwC, my own practice at Cairros, then scaling ZenCabs. The pattern I kept hitting was that I could market and scale a product, but I couldn't build one. That's the gap Masters' Union fills for me.\n\nThe PGP in Technology & Business is practitioner-taught, which matches how I actually learn: do the thing first, understand why it worked second. I wanted the technology layer on top of an operating background, not a theory degree.",
  },
  {
    keys: ['pwc', 'leave', 'quit', 'consulting to startup', 'big four'],
    answer:
      "My year at PwC was genuinely valuable — risk consulting, governance and compliance work, and a standard of rigour where your analysis has to survive people actively looking for holes. I still use that structured problem-solving on every growth problem I touch.\n\nBut I saw exactly how large organisations make decisions, and that's precisely why I wanted to go build in a small one. I come from a fourth-generation business family in Jammu; the pull toward operating something was always going to win. ZenCabs was the opposite end of the spectrum, and that was the point.",
  },
  {
    keys: ['zencabs', 'scale', '20k', '20,000', 'mobility', 'cab'],
    answer:
      "ZenCabs was a two-sided marketplace in Jammu — a market the national aggregators had skipped. We crossed 20,000+ users.\n\nThe core call was treating supply as the harder half. A rider who opens the app to zero cars never opens it again, so I built the driver funnel first: sourcing, verification, training and the incentive structure that kept them active. Then we grew route by route rather than city-wide, because density beats coverage in a small market.\n\nThe other thing that mattered: in a tier-2 market, distribution is physical. On-ground acquisition at transport hubs, campuses and markets outperformed paid digital, and the two compounded when run together.",
  },
  {
    keys: ['lesson', 'learn', 'biggest', 'takeaway', 'advice'],
    answer:
      "The biggest one: marketplaces are supply problems wearing a demand costume. At ZenCabs I could have spent everything on rider acquisition and it would have evaporated, because the constrained side was drivers. Find the actual constraint before you spend.\n\nThe second one comes from Cairros: founders don't buy strategy, they buy momentum. Most businesses I worked with didn't have a strategy problem — they knew roughly what to do. They had an execution problem. So I stopped delivering recommendations and started building the operating cadence alongside them.",
  },
  {
    keys: ['about', 'yourself', 'who are you', 'introduce', 'background'],
    answer: `${profile.about.join('\n\n')}`,
  },
  {
    keys: ['market', 'marketing', 'gtm', 'go to market', 'growth strategy'],
    answer:
      "I'd start by refusing to answer the question as asked. \"How do I market this\" is usually the wrong first question — the real one is what's actually constraining growth. Positioning, supply, retention and acquisition all look like marketing problems from the outside.\n\nOnce that's clear: fix positioning first, because no amount of spend rescues a message the market doesn't want. Then build exactly one channel to competence before opening a second — most early teams run four channels badly instead of one well. And set the review cadence early, so you find out something isn't working in a week rather than a quarter.\n\nThat's the model I ran at Cairros across 7+ clients, and it's what worked at ZenCabs.",
  },
  {
    keys: ['cairros', 'consulting', 'clients', 'own business'],
    answer:
      cairros?.caseStudy.challenge +
      "\n\nSo I built Cairros to be execution-led — I work inside the team rather than handing over a deck. 7+ clients across growth, marketing, strategy and brand transformation. The measure I care about is whether anything shipped, not whether the recommendation was correct.",
  },
  {
    keys: ['shaadi', 'mangalam', 'matrimonial', 'luxury', 'brand'],
    answer:
      "Shaadi Mangalam was a brand transformation into the luxury end of the matrimonial market. Matrimonial is crowded, trust-driven and mostly commoditised — almost everyone competes on database size.\n\nMoving up-market means the brand has to earn the premium before the pricing can ask for one. So the work was three things: reposition from volume to selectivity, rebuild the brand expression to match the price point, and optimise the funnel for lead quality rather than lead count. In a high-consideration category, one qualified lead beats fifty curious ones.",
  },
  {
    keys: ['jammu', 'family', 'business family', 'generation'],
    answer:
      "I'm from Jammu, fourth generation in a business family. Operating a business was the dinner-table conversation long before it was a career choice — I grew up around cash flow, customers and the unglamorous parts.\n\nThat's a real advantage and a real bias. The advantage is commercial instinct. The bias is assuming everyone thinks in P&L. Symbiosis and then PwC gave me the frameworks to formalise the instinct, and ZenCabs let me point it at something I'd built myself.",
  },
  {
    keys: ['hire', 'work with', 'contact', 'reach', 'email'],
    answer: `The fastest way is ${profile.links.email}, or find me on LinkedIn. I'm most useful on growth, go-to-market and early-stage strategy work — particularly if you'd rather have someone building alongside the team than reviewing from outside it.`,
  },
];

const DEFAULT_ANSWER = `I don't have a good answer to that one from what's in here — I'd rather say I don't know than make something up.

What I can talk about properly: scaling ZenCabs past 20,000+ users in Jammu, the year I spent in risk consulting at PwC India, running growth and strategy for 7+ clients through Cairros Consulting, the Shaadi Mangalam brand transformation, or what I'm doing at Masters' Union right now. Ask me about any of those.`;

export function fallbackAnswer(question: string): string {
  const q = question.toLowerCase();

  let best: { entry: FallbackEntry; score: number } | null = null;
  for (const entry of ENTRIES) {
    const score = entry.keys.reduce((acc, key) => (q.includes(key) ? acc + key.length : acc), 0);
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }

  const body = best?.entry.answer ?? DEFAULT_ANSWER;
  // Plain text on purpose: an OPENAI_API_KEY mention inside markdown emphasis
  // collides with the underscore delimiters in the renderer.
  return `${body}\n\n— Offline mode: no OpenAI key is configured, so this is a pre-written answer rather than the live clone.`;
}

/** Streams the fallback in word chunks so the UI path is identical to the real one. */
export function fallbackStream(question: string): ReadableStream<Uint8Array> {
  const text = fallbackAnswer(question);
  const words = text.split(/(\s+)/);
  const encoder = new TextEncoder();
  let i = 0;

  return new ReadableStream({
    async pull(controller) {
      if (i >= words.length) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(words[i]));
      i += 1;
      await new Promise((r) => setTimeout(r, 16));
    },
  });
}

