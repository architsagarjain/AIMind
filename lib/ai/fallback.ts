import { profile } from '@/content/profile';

/**
 * Deterministic offline responder.
 *
 * Used when OPENROUTER_API_KEY is absent, and as the safety net when every
 * free model fails or is at capacity, so the chat always answers instead of
 * erroring. Answers are hand-written from the same CV the model reads, so
 * nothing here claims anything the live clone could not.
 *
 * Matching is keyword-scored rather than semantic — deliberately simple, and
 * honest about it: every reply is labelled as offline so it is never mistaken
 * for the real thing.
 */

interface FallbackEntry {
  /** Lowercase substrings. Longer matches score higher, so be specific. */
  keys: string[];
  answer: string;
}

const ENTRIES: FallbackEntry[] = [
  // ---------------------------------------------------------------- identity
  {
    keys: ['about you', 'about yourself', 'who are you', 'introduce', 'tell me about', 'background', 'your story'],
    answer: profile.about.join('\n\n'),
  },
  {
    keys: ['jammu', 'family business', 'business family', 'fourth generation', 'where are you from', 'hometown'],
    answer:
      "I'm from Jammu, fourth generation in a business family. Operating a business was the dinner-table conversation long before it was a career choice — I grew up around cash flow, customers and the unglamorous parts.\n\nThat's a real advantage and a real bias. The advantage is commercial instinct. The bias is assuming everyone thinks in P&L. Symbiosis and then PwC gave me the frameworks to formalise the instinct, and ZenCabs — back home in Jammu — let me point it at something I was building myself.",
  },

  // ------------------------------------------------------------------ ZenCabs
  {
    keys: ['zencabs', 'zen cabs', 'ev', 'mobility', 'cab', 'fleet', 'run-rate', 'run rate'],
    answer:
      "ZenCabs is an EV mobility venture in Jammu. I joined as Head of Strategy & Growth and took it from launch to 25,000+ users and a ₹3 Cr annualised run-rate in four months.\n\nThe core call was treating supply as the harder half. A rider who opens the app to zero cars never opens it again, so I built the driver funnel first — recruitment, training and the incentive structure — and onboarded 43 driver partners.\n\nThe number I actually cared about was utilisation. On an owned EV fleet, every idle car is capital sitting still. We moved fleet utilisation from 40% to 75% and revenue per car to ₹62.5K a month, tracked against 15+ KPIs in a weekly review with the founder.",
  },
  {
    keys: ['cancellation', 'cancel', 'reliability', 'sop', 'dispatch'],
    answer:
      "Cancellations were at 40% when I started at ZenCabs. We got them to 6%.\n\nIt looked like an ops problem and it was really a retention problem — every cancelled ride costs more than the acquisition that produced it. The fix was unglamorous: institutionalising 10+ SOPs across onboarding and dispatch so the same failure didn't recur, then reviewing the exceptions weekly.\n\nThat's the pattern in most marketplace businesses. Reliability compounds quietly and discounts don't.",
  },
  {
    keys: ['utilisation', 'utilization', 'revenue per car', 'unit economics'],
    answer:
      "On an owned EV fleet, utilisation *is* the business model. We took it from 40% to 75%, which lifted revenue per car to ₹62.5K a month.\n\nThat came from three things together: better ride allocation, driver incentives aligned to the hours that actually had demand, and cutting cancellations from 40% to 6% so cars weren't idling between failed matches.\n\nA 35-point utilisation move was worth more than any acquisition campaign I could have run with the same effort.",
  },

  // ---------------------------------------------------------------------- PwC
  {
    keys: ['pwc', 'big 4', 'big four', 'risk consulting', 'consulting at pwc'],
    answer:
      "I spent fifteen months at PwC India in risk consulting, finishing as a Specialist 2.\n\nThe headline is ₹6+ Cr in annual client cost savings via root-cause diagnostics and process redesign — ₹2 Cr+ of that from reengineering 25+ processes across procurement, HR and finance. I executed engagements worth ₹12 Cr+ for 10+ clients including Cars24, Stryker India and PIF.\n\nThe piece I'm proudest of is the internal audit AI tool I co-developed. It saved 10,000+ consulting hours across 200+ consultants, and I led the firm-level training that got it to 50% adoption in six months.",
  },
  {
    keys: ['leave pwc', 'left pwc', 'why leave', 'quit', 'consulting to startup', 'why did you leave'],
    answer:
      "My time at PwC was genuinely valuable — a standard of rigour where your analysis has to survive people actively looking for holes. I still use that structured problem-solving on every growth problem I touch.\n\nBut I saw exactly how large organisations make decisions, and that's precisely why I wanted to go build in a small one. I'd already run Cairros through college, so I knew what founder-speed felt like. ZenCabs was the opposite end of the spectrum from Big-4, and that was the point.",
  },
  {
    keys: ['ai tool', 'internal audit', 'automation', 'consulting hours', '10,000', '10000'],
    answer:
      "At PwC I co-developed an internal audit AI tool that saved 10,000+ consulting hours across 200+ consultants.\n\nThe build was the easy half. Getting to 50% adoption in six months took firm-level training across 10 pilot engagements — consultants don't adopt a tool because it exists, they adopt it because someone showed them it makes Friday easier.\n\nThat's the lesson I took into everything since: adoption is a distribution problem, not a features problem.",
  },
  {
    keys: ['cost saving', 'cost reduction', 'savings', '6 cr', '₹6'],
    answer:
      "₹6+ Cr in annual client cost savings at PwC, from root-cause diagnostics and process redesign.\n\nThe method is boring and it works. Walk the process as people actually run it rather than as the policy document describes it. Size every gap — a finding without a number attached doesn't get prioritised and doesn't get funded. Then fix the decision rights, not just the spend: I cut decision turnaround 30%+ just by designing DOA matrices and approval workflows for the CXOs.\n\nThe cheapest saving is almost always a decision-rights problem that nobody has looked at.",
  },

  // ------------------------------------------------------------------ Cairros
  {
    keys: ['cairros', 'agency', 'your own business', 'founded', 'entrepreneur'],
    answer:
      "Cairros was the consulting and marketing agency I started in my second year at Symbiosis and scaled to seven-figure annual revenue in two years — strategy, sales and delivery, end to end.\n\nSome of the work: three restaurant clients grown 30% in revenue at 7% MoM through menu reengineering and table-turnaround ops, and a magazine client taken from ₹2L to ₹7L a month — 3.5x at 23% MoM over six months. We expanded across four sectors.\n\nRunning my own P&L at 20 taught me which advice is actually expensive to follow. It's still the fastest education I've had.",
  },

  // -------------------------------------------------------------- other roles
  {
    keys: ['mccs', 'infrastructure', 'construction', 'manpower', 'hiring'],
    answer:
      "MCCS Infra is an infrastructure and construction business I worked with as a Business Transformation Consultant.\n\nI unlocked ₹2 Cr in cost savings through manpower restructuring and capacity planning, accelerated inbound enquiries 4.5x via digital strategy and a brand overhaul, and compressed hiring turnaround by 80% while halving cost per hire.\n\nIn a people-heavy business the org chart *is* the cost structure. And reactive hiring is the most expensive hiring there is — fixing the system beat fixing any individual role.",
  },
  {
    keys: ['equip9', 'equip 9', 'marketplace marketing', 'segmentation', 'performance marketing'],
    answer:
      "Equip9 is a construction-tech marketplace. I ran digital marketing there for nearly two years alongside college and Cairros.\n\nI improved lead conversion 40% and drove 300% profit growth through segmentation-led acquisition, generated ₹30L+ in annual revenue across 15+ accounts, and halved content production turnaround by building a content engine with AI workflow agents.\n\nSegmentation is the cheapest performance lever there is and the one most people skip. A contractor renting a machine for a week and an owner listing a fleet want completely different things.",
  },
  {
    keys: ['shaadi', 'mangalam', 'wedding', 'conversion rate', 'pricing'],
    answer:
      "Shaadi Mangalam is a wedding services business. I came in on growth and business strategy.\n\nWe tripled monthly leads to 3,000 and moved conversion from 1.4% to 4% by restructuring pricing and the sales process, then shipped 100+ process and product fixes across sprints alongside a website redesign.\n\nThe important part is the order. Almost every growth brief I get has it backwards — if you triple leads into a 1.4% funnel you've just multiplied the waste. Conversion first, volume second.",
  },

  // -------------------------------------------------------------- education
  {
    keys: ["masters' union", 'masters union', 'mastersunion', 'pgp', 'why study', 'mba'],
    answer:
      "I spent three years doing consulting, growth and operations — Cairros, Equip9, PwC, then ZenCabs. The pattern I kept hitting was that I could diagnose and scale a business but I couldn't build the product underneath it. That's the gap Masters' Union fills for me.\n\nThe PGP in Technology & Business Management is practitioner-taught, which matches how I actually learn: do the thing first, understand why it worked second. I wanted the technology layer on top of an operating background, not a theory degree.",
  },
  {
    keys: ['symbiosis', 'college', 'bba', 'degree', 'graduation'],
    answer:
      "BBA at Symbiosis Centre for Management Studies in Pune, majoring in Accounts & Finance and Marketing Management. CGPA 8.16, top 10% of the batch.\n\nOutside the coursework I was elected Placement Coordinator from a cohort of 400, was Marketing Head at Sympulse, and worked with Enactus Pune. I also started Cairros in my second year rather than waiting for the degree to end — most of what I actually learned came from that.",
  },

  // -------------------------------------------------------- how I think/work
  {
    keys: ['lesson', 'learned', 'biggest', 'takeaway', 'advice', 'mistake'],
    answer:
      "Three that keep proving themselves:\n\n**Marketplaces are supply problems wearing a demand costume.** At ZenCabs I could have spent everything on rider acquisition and watched it evaporate, because the constrained side was drivers. Find the actual constraint before you spend.\n\n**Put a number on it or it doesn't get fixed.** Sizing a finding is half the work of closing it. That's the single most useful habit PwC gave me.\n\n**Founders don't buy strategy, they buy momentum.** Most businesses I've worked with knew roughly what to do. What they lacked was the operating cadence that made it happen weekly.",
  },
  {
    keys: ['how do you work', 'your process', 'approach', 'operating', 'cadence', 'framework'],
    answer:
      "Diagnose, size, sequence, then build the cadence.\n\nDiagnose properly — the presenting problem (\"we need more marketing\") is almost never the actual constraint. Size everything, because an unsized problem never gets prioritised. Sequence so the constrained side gets fixed first. Then install the weekly review that makes the work self-correcting.\n\nThe ZenCabs weekly KPI review with the founder was the highest-leverage thing I built there. Not a deck — a cadence. Fifteen KPIs, every week, and problems surfaced in days instead of quarters.",
  },
  {
    keys: ['market a startup', 'marketing', 'gtm', 'go to market', 'growth strategy', 'how would you'],
    answer:
      "I'd start by refusing the question as asked. \"How do I market this\" is usually the wrong first question — the real one is what's actually constraining growth. Positioning, supply, conversion and retention all look like marketing problems from outside.\n\nOnce that's clear: fix conversion before chasing volume, because tripling leads into a broken funnel just multiplies waste — that's exactly what we did at Shaadi Mangalam, 1.4% to 4% first. Then segment properly; it's the cheapest performance lever and the most skipped. Then build one channel to competence before opening a second.\n\nAnd set the review cadence on day one, so you find out something isn't working in a week rather than a quarter.",
  },
  {
    keys: ['founder', "founder's office", 'founders office', 'chief of staff', 'what role', 'looking for'],
    answer:
      "Founder's office is the role I'm built for, and it's what my CV is pointed at.\n\nThe work I'm best at is the ambiguous middle: take a problem nobody has framed yet, structure it, size it, decide it, then build the system and cadence that keeps it decided. At ZenCabs that meant GTM, pricing, SOPs and the weekly operating review. At PwC it meant diagnostics and decision rights for CXOs.\n\nI bring Big-4 structure and founder-speed execution in the same person, which is a combination most people have to hire twice for.",
  },
  {
    keys: ['strength', 'good at', 'superpower', 'why hire', 'why you'],
    answer:
      "Structure plus speed, in the same person.\n\nThe consulting half means I frame problems properly and put numbers on them before acting — ₹6+ Cr in client savings came from that discipline, not from working harder. The founder half means I'll go build the thing on Monday rather than writing a deck about it — ZenCabs went from launch to ₹3 Cr annualised in four months.\n\nMost teams have to hire those two separately.",
  },
  {
    keys: ['ai', 'artificial intelligence', 'tech', 'technology', 'building', 'tools'],
    answer:
      "I'm less interested in AI as a topic than in AI that moves an operating metric.\n\nAt Equip9 I built a content engine with AI workflow agents that halved production turnaround. At PwC I co-developed an internal audit AI tool that saved 10,000+ consulting hours across 200+ consultants. This site is a version of the same instinct — an AI clone of me you can interrogate instead of reading a PDF.\n\nThat's also why I'm at Masters' Union on the technology programme. I want to be the person who builds it, not just the one who specs it.",
  },

  // ------------------------------------------------------------------ contact
  {
    keys: ['hire', 'work with', 'contact', 'reach', 'email', 'get in touch', 'available'],
    answer: `The fastest way is ${profile.links.email}, or find me on LinkedIn — I'm at ${profile.links.linkedin}.\n\nI'm most useful on founder's office, growth and go-to-market work, particularly where the problem hasn't been framed yet and you'd rather have someone building alongside the team than reviewing from outside it.`,
  },
];

const DEFAULT_ANSWER = `I don't have a good answer to that one from what's in here — I'd rather say I don't know than make something up.

What I can talk about properly: taking ZenCabs from launch to 25,000+ users and ₹3 Cr annualised, the fifteen months at PwC India and the ₹6+ Cr in client savings, building Cairros to seven figures while at college, the work at Equip9, MCCS Infra and Shaadi Mangalam, or what I'm doing at Masters' Union now. Ask me about any of those.`;

/** Why the answer is pre-written; the note says so honestly either way. */
export type OfflineReason = 'unconfigured' | 'unavailable';

const OFFLINE_NOTE: Record<OfflineReason, string> = {
  unconfigured:
    "— Offline mode: the live clone isn't connected yet, so this is a pre-written answer.",
  // Free models are rate-limited and sometimes all busy at once.
  unavailable:
    '— The live clone is at capacity right now, so this is a pre-written answer. Ask again in a minute for the live one.',
};

export function fallbackAnswer(question: string, reason: OfflineReason = 'unconfigured'): string {
  const q = question.toLowerCase();

  let best: { entry: FallbackEntry; score: number } | null = null;
  for (const entry of ENTRIES) {
    // Longer matched keys score higher, so "leave pwc" beats a bare "pwc".
    const score = entry.keys.reduce((acc, key) => (q.includes(key) ? acc + key.length : acc), 0);
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }

  return `${best?.entry.answer ?? DEFAULT_ANSWER}\n\n${OFFLINE_NOTE[reason]}`;
}

/** Streams the fallback in word chunks so the UI path is identical to the real one. */
export function fallbackStream(
  question: string,
  reason: OfflineReason = 'unconfigured',
): ReadableStream<Uint8Array> {
  const words = fallbackAnswer(question, reason).split(/(\s+)/);
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
      await new Promise((r) => setTimeout(r, 14));
    },
  });
}
