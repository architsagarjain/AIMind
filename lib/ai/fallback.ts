import { profile } from '@/content/profile';

/**
 * Deterministic offline responder.
 *
 * Used when OPENROUTER_API_KEY is absent, and as the safety net when every
 * free model fails or is at capacity, so the chat always answers instead of
 * erroring. Answers are hand-written from content/archit-context.md, the same
 * file the model reads (its ready answers, section 11, in particular), so
 * nothing here claims anything the live clone could not.
 *
 * Matching is keyword-scored, not semantic: deliberately simple, and
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
    keys: ['jammu', 'where are you from', 'hometown', 'grew up', 'school'],
    answer:
      "I'm from Jammu and went to Delhi Public School there: 92% in Class XII (Commerce with Maths), 94.2% in Class X with 100/100 in Science, and House Captain.\n\nMy first real business work was in Jammu too. From 2019 I ran marketing for Indikraft, a handicrafts business, and took it online: revenue rose 45% and the new D2C channel reached 20% of sales. ZenCabs brought me back to Jammu in 2026.",
  },
  {
    keys: ['are you human', 'are you real', 'are you ai', 'are you a bot', 'chatbot', 'is this really'],
    answer: `I'm an AI built on Archit's experience, not Archit himself. Everything I tell you comes from his verified background.\n\nYou can reach the real Archit at ${profile.links.email} or on LinkedIn: ${profile.links.linkedin}`,
  },

  // ------------------------------------------------------------------ ZenCabs
  {
    keys: ['zencabs', 'zen cabs', 'ev', 'mobility', 'cab', 'fleet', 'run-rate', 'run rate', 'scale'],
    answer:
      "I'm on the founding team at ZenCabs, an all-electric cab fleet in Jammu, as Head of Strategy & Growth. Aayush Chopra is the founder. In six months we went from launch to 30,000+ users and a ₹4 Cr annualised run-rate, with ₹33L+ of monthly GMV across 10,000+ rides.\n\nThe biggest lever was the map. Ride data showed cars going to far-off, low-yield pickups, so we focused on the top 6 demand zones. Utilisation went from 40% to 75%, revenue per car reached ₹83K a month, and user cancellations fell from 200 to 80 a day.\n\nWe did it on a marketing budget of about 10% of revenue.",
  },
  {
    keys: ['cancellation', 'cancel', 'reliability', 'sop', 'dispatch'],
    answer:
      "There are two cancellation numbers at ZenCabs, and they measure different things.\n\nDriver-side cancellations were at 40%. We put 10+ onboarding and dispatch SOPs in place and reviewed 15+ KPIs weekly with the founder, and they fell to 6%, which is 94% ride completion.\n\nUser cancellations fell from 200 to 80 a day, a 60% drop, once we stopped sending cars to far-off pickup zones.",
  },
  {
    keys: ['utilisation', 'utilization', 'revenue per car', 'unit economics', 'zone', 'data'],
    answer:
      "Two examples, both from ZenCabs.\n\nFirst, the zone refocus. Ride data showed far-off pickups were hurting utilisation, so we concentrated on the top 6 zones and phased the rest out over two months. Utilisation went from 40% to 75%, revenue per car reached ₹83K a month, and user cancellations dropped from 200 to 80 a day.\n\nSecond, the 5 pm problem. We had enough cars but were losing evening rides. The data showed driver shifts ending right at the 5 to 8 pm peak, so I moved 5 shifts two hours later and picked up 200+ extra rides a month at zero cost.",
  },
  {
    keys: ['driver incentive', 'incentive', 'drivers', 'bottom 55'],
    answer:
      "Lower-performing drivers at ZenCabs were earning too little, which hurt motivation and retention. I redesigned the driver incentive cost structure, and revenue from the bottom 55% of drivers rose 70%.\n\nWe onboarded 43 driver partners in all, as the fleet grew from 0 to 40 cars in three months.",
  },

  // ---------------------------------------------------------------------- PwC
  {
    keys: ['pwc', 'big 4', 'big four', 'risk consulting', 'consulting at pwc'],
    answer:
      "I spent fifteen months at PwC India in risk consulting and was promoted to Specialist 2 within 12 months.\n\nThe headline is ₹6+ Cr in annual client cost savings from root-cause diagnostics and process redesign, ₹2 Cr+ of it from reengineering 25+ processes across procurement, HR and finance. I executed engagements worth ₹12 Cr+ for 10+ clients including Cars24, Stryker India and PIF.\n\nThe piece I'm proudest of is the internal audit AI tool I co-developed. It saved 10,000+ consulting hours across 200+ consultants, and I led the firm-level training that got it to 50% adoption in six months.",
  },
  {
    keys: ['leave pwc', 'left pwc', 'why leave', 'quit', 'consulting to startup', 'why did you leave'],
    answer:
      "I wanted to own outcomes, not just recommend them. ZenCabs let me take the same diagnostic rigour from PwC and carry it all the way to the result, with my name on the number.\n\nI'd already founded Cairros at 18, so I knew what founder speed felt like. A founding-team role was the fastest way back to it.",
  },
  {
    keys: ['ai tool', 'ai tool at pwc', 'audit ai tool', 'internal audit', 'automation', 'consulting hours', '10,000', '10000'],
    answer:
      "At PwC I co-developed an internal audit AI tool with an external AI partner. I sourced the partner, shaped the non-technical design and scoped new audit use cases. It saved 10,000+ consulting hours across 200+ consultants.\n\nThe build was the easy half. Getting to 50% adoption in six months took firm-level training across 10 pilot engagements. Consultants start using a tool once someone shows them, on their own client work, that it makes the week easier.\n\nI took that into everything since: adoption is mostly a distribution problem.",
  },
  {
    keys: ['cost saving', 'cost reduction', 'savings', '6 cr', '₹6'],
    answer:
      "₹6+ Cr in annual client cost savings at PwC, from root-cause diagnostics and process redesign.\n\nThe method is boring and it works. Walk the process as people actually run it, and read the policy document afterwards. Size every gap, because a finding without a number attached doesn't get prioritised or funded. Then fix decision rights along with the spend: designing DOA matrices and approval workflows for CXOs cut decision turnaround by 30%+.\n\nThe cheapest saving is almost always a decision-rights problem nobody has looked at.",
  },

  // ------------------------------------------------------------------ Cairros
  {
    keys: ['cairros', 'agency', 'your own business', 'founded', 'entrepreneur'],
    answer:
      "Cairros is the consulting and marketing agency I founded at 18, in my second year at Symbiosis, and scaled to seven-figure annual revenue across four sectors in two years, owning strategy, sales and delivery end to end.\n\nSome of the work: three restaurant clients grown 30% in revenue at 7% MoM through menu reengineering and table-turnaround ops, and a magazine client taken from ₹2L to ₹7L a month, which is 3.5x at 23% MoM over six months. \n\nRunning my own P&L that young taught me which advice is actually expensive to follow. It's still the fastest education I've had.",
  },

  // -------------------------------------------------------------- other roles
  {
    keys: ['mccs', 'infrastructure', 'construction', 'manpower', 'hiring'],
    answer:
      "MCCS Infra is an infrastructure and construction business I worked with as a Business Transformation Consultant.\n\nI unlocked ₹2 Cr in cost savings through manpower restructuring and capacity planning, accelerated inbound enquiries 4.5x via digital strategy and a brand overhaul, and compressed hiring turnaround by 80% while halving cost per hire.\n\nIn a people-heavy business the org chart *is* the cost structure. Reactive hiring is the most expensive hiring there is, and fixing the hiring system did more than fixing any individual role.",
  },
  {
    keys: ['equip9', 'equip 9', 'marketplace marketing', 'segmentation', 'performance marketing'],
    answer:
      "Equip9 is a construction-tech marketplace. I ran digital marketing there for nearly two years alongside college and Cairros.\n\nI improved lead conversion 40% and drove 300% profit growth through segmentation-led acquisition, generated ₹30L+ in annual revenue across 15+ accounts, and halved content production turnaround by building a content engine with AI workflow agents.\n\nSegmentation is the cheapest performance lever there is and the one most people skip. A contractor renting a machine for a week and an owner listing a fleet want completely different things.",
  },
  {
    keys: ['shaadi', 'mangalam', 'wedding', 'conversion rate', 'pricing'],
    answer:
      "Shaadi Mangalam is a matrimony platform. I work with the founder on growth and business strategy: product, UX, the website, service design, marketing and branding.\n\nWe quadrupled monthly revenue from ₹2L to ₹8L by building the full conversion funnel. Restructuring pricing and sales tripled monthly leads from 1,000 to 3,000 and lifted conversion from 1.4% to 4%, and we shipped 100+ product and UX fixes across sprints.\n\nThe important part is the order. Most growth briefs I get have it backwards: triple leads into a 1.4% funnel and you've multiplied the waste. Conversion first, volume second.",
  },

  // -------------------------------------------------------------- education
  {
    keys: ["masters' union", 'masters union', 'mastersunion', 'pgp', 'why study', 'mba'],
    answer:
      "I'm on the PGP in Technology & Business Management at Masters' Union in Gurugram, which I started in June 2026.\n\nI've had about 20 months full-time, 15 at PwC India and 5 at ZenCabs, plus founder and consulting work since 2019. The PGP adds the technology and business toolkit on top of that, on the way to a Founder's Office, Chief of Staff or strategy role.",
  },
  {
    keys: ['symbiosis', 'college', 'bba', 'degree', 'graduation'],
    answer:
      "BBA at Symbiosis Centre for Management Studies in Pune, majoring in Accounts & Finance and Marketing Management. CGPA 8.16, top 10% of the batch.\n\nOutside the coursework I was elected Placement Coordinator from a cohort of 400, was Marketing Head at Sympulse, and worked with Enactus Pune. I also started Cairros in my second year, and most of what I learned in those years came from running it.",
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
      "Diagnose, size, sequence, then build the cadence.\n\nDiagnose properly, because the presenting problem (\"we need more marketing\") is almost never the actual constraint. Size everything, since an unsized problem never gets prioritised. Sequence the work so the constrained side gets fixed first. Then install a weekly review that makes the work self-correcting.\n\nThe weekly KPI review with the founder was the most useful thing I built at ZenCabs: 15+ KPIs every week, so a problem surfaced within days of starting.",
  },
  {
    keys: ['market a startup', 'marketing', 'gtm', 'go to market', 'growth strategy', 'how would you'],
    answer:
      "I'd start by questioning the question. \"How do I market this\" is usually the wrong first question. The better one is what's constraining growth, because positioning, supply, conversion and retention all look like marketing problems from outside.\n\nOnce that's clear, fix conversion before chasing volume, because tripling leads into a broken funnel just multiplies waste. At Shaadi Mangalam we took conversion from 1.4% to 4% first. Then segment properly; it's the cheapest performance lever and the most skipped. Then build one channel to competence before opening a second.\n\nAnd set the review cadence on day one, so you find out within a week when something isn't working.",
  },
  {
    keys: ['founder', "founder's office", 'founders office', 'chief of staff', 'what role', 'looking for'],
    answer:
      `Founder's Office and Chief of Staff roles first, then strategy and business transformation, and finance-adjacent roles such as startup finance or VC/PE portfolio operations.\n\nIt's the role I've effectively been doing. At PwC I structured problems and aligned CXOs. At ZenCabs I run the operating cadence, the weekly KPI reviews and the cross-functional fixes alongside the founder.\n\nI'm open to opportunities through Masters' Union placements. The best way to reach me is ${profile.links.email} or LinkedIn: ${profile.links.linkedin}`,
  },
  {
    keys: ['strength', 'good at', 'superpower', 'why hire', 'why you'],
    answer:
      "Structure and speed in the same person.\n\nThe consulting half means I frame problems properly and put numbers on them before acting, and that discipline is where ₹6+ Cr in client savings came from. The operator half means I own the fix until the number moves. ZenCabs went from launch to a ₹4 Cr annualised run-rate in six months.\n\nMost teams have to hire those two separately.",
  },
  {
    keys: ['ai', 'artificial intelligence', 'tech', 'technology', 'building', 'tools'],
    answer:
      "The AI I care about is the kind that moves an operating metric.\n\nAt Equip9 I built a content engine with AI workflow agents that halved production turnaround. At PwC I co-developed an internal audit AI tool that saved 10,000+ consulting hours across 200+ consultants. This site comes from the same instinct: an AI clone of me you can question the way you would question me.\n\nThat's also why I'm at Masters' Union on the technology programme. I want to be able to build these things myself.",
  },

  // ---------------------------------------------------------- experience
  {
    keys: ['how much experience', 'years of experience', 'experience do you have', 'how long'],
    answer:
      "About 20 months full-time after graduating: 15 at PwC India and 5 at ZenCabs before starting the PGP.\n\nBefore that I founded Cairros and worked with startups like Equip9 alongside college, and I've been doing hands-on business work since 2019.",
  },
  {
    keys: ['are you a founder', 'did you found', 'your startup'],
    answer:
      "Yes. I founded Cairros, a consulting and marketing agency, at 18 during college and grew it to seven-figure annual revenue across four sectors in two years.\n\nAt ZenCabs I'm on the founding team as Head of Strategy & Growth; Aayush Chopra is the founder.",
  },
  {
    keys: ['weakness', 'weaker', 'not good at', 'sql', 'python', 'tableau', 'valuation', 'dcf'],
    answer:
      "I'm an operator and consultant first, not a deep technical analyst. My analytics work has been in Excel and Power BI, not SQL or Python, and I haven't done IB-style valuation modelling.\n\nMy strength is turning analysis into decisions that move the number: unit economics, business cases and the operating fixes that follow.",
  },
  {
    keys: ['salary', 'ctc', 'compensation', 'notice period', 'expected pay', 'offer'],
    answer: `Happy to discuss that directly. Drop me a note at ${profile.links.email} or message me on LinkedIn: ${profile.links.linkedin}`,
  },
  {
    keys: ['resume', 'cv', 'download'],
    answer: `My full resume is on the Resume page at /resume, with every role and number on it.\n\nIf you'd like to talk, I'm at ${profile.links.email} and on LinkedIn: ${profile.links.linkedin}`,
  },

  // ------------------------------------------------------------------ contact
  {
    keys: ['hire', 'work with', 'contact', 'reach', 'email', 'get in touch', 'available'],
    answer: `The fastest way is ${profile.links.email}, or LinkedIn at ${profile.links.linkedin}.\n\nI'm most useful on founder's office, growth and go-to-market work, especially where the problem hasn't been framed yet and you want someone building alongside the team.`,
  },
];

const DEFAULT_ANSWER = `I don't have a good answer to that one from what I know, and I'd sooner say so than make something up.

What I can talk about properly: helping take ZenCabs from launch to 30,000+ users and a ₹4 Cr run-rate in six months, the fifteen months at PwC India and the ₹6+ Cr in client savings, founding Cairros at 18, the work at Equip9, MCCS Infra and Shaadi Mangalam, or the PGP at Masters' Union now. For anything else, ask Archit directly at ${profile.links.email} or on LinkedIn: ${profile.links.linkedin}`;

/** Why the answer is pre-written; the note says so honestly either way. */
export type OfflineReason = 'unconfigured' | 'unavailable';

const OFFLINE_NOTE: Record<OfflineReason, string> = {
  unconfigured:
    "_Offline mode: the live clone isn't connected yet, so this is a pre-written answer._",
  // Free models are rate-limited and sometimes all busy at once.
  unavailable:
    '_The live clone is at capacity right now, so this is a pre-written answer. Ask again in a minute for the live one._',
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
