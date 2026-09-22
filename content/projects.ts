import type { Project } from '@/types';

/**
 * Case-study copy.
 *
 * NOTE ON NUMBERS: the only hard figures below are the ones supplied directly
 * (20K+ ZenCabs users, 7+ clients, 1 year at PwC). Narrative sections describe
 * approach rather than claiming unverified outcomes, because the AI clone reads
 * this file as fact and is instructed never to invent achievements. If you add
 * a metric here, the clone will quote it.
 */
export const projects: Project[] = [
  {
    slug: 'zencabs',
    name: 'ZenCabs',
    subtitle: 'City mobility, built for Jammu',
    role: 'Head of Strategy & Growth',
    period: '2023 — 2024',
    summary:
      'Took a local cab platform from a standing start to 20,000+ users by building demand in a market the big aggregators had skipped.',
    tags: ['Growth', 'Marketplace', 'Operations', 'Go-To-Market'],
    metrics: [
      { label: 'Users', value: '20K+' },
      { label: 'Market', value: 'Jammu' },
      { label: 'Role', value: 'Strategy & Growth' },
    ],
    accent: '#6EF2FF',
    caseStudy: {
      challenge:
        'Jammu is a market the national aggregators never prioritised. Riders defaulted to informal, phone-call bookings and unpredictable fares; drivers had no dependable pipeline of work. Any platform had to solve both sides at once — a marketplace with a supply gap is just an app, and one with a demand gap is a cost centre.',
      strategy: [
        'Treat supply as the harder half: sign and retain drivers first, because a rider who opens the app to zero cars never opens it again.',
        'Win on reliability rather than price. In a small market, a ride that actually shows up is worth more than a discount.',
        'Grow route by route instead of city-wide — concentrate density where demand already clustered rather than spreading thin.',
        'Use local trust as the acquisition channel: in Jammu, word of mouth and on-ground presence outperform paid digital spend.',
      ],
      execution: [
        'Built the driver-onboarding funnel end to end — sourcing, verification, training and the incentive structure that kept drivers active.',
        'Ran on-ground acquisition at the places demand physically concentrates: transport hubs, campuses, markets and hotels.',
        'Set up the operating cadence — daily supply/demand tracking, cancellation and wait-time review, and a weekly loop feeding it back into incentives.',
        'Ran local digital marketing and referral loops alongside the on-ground push, so the two channels compounded instead of competing.',
      ],
      results: [
        'Crossed 20,000+ users on the platform.',
        'Established a repeatable driver-onboarding and retention motion rather than a one-off acquisition spike.',
        'Built the operating rhythm — the metrics, the review cadence, the incentive levers — that the growth function continued to run on.',
      ],
      lessons: [
        'Marketplaces are supply problems wearing a demand costume. Solve the constrained side first.',
        'Density beats coverage. A platform that works perfectly on four routes beats one that half-works across the city.',
        'In a tier-2 market, distribution is physical. The best growth channel was people, not ad spend.',
        'Retention is a product of reliability. Every cancelled ride costs more than the acquisition that produced it.',
      ],
    },
  },
  {
    slug: 'pwc',
    name: 'PwC India',
    subtitle: 'Risk Consulting — Governance, Risk & Compliance',
    role: 'Risk Consultant',
    period: '1 Year',
    summary:
      'A year inside one of the Big Four, learning how large organisations actually control risk — and how decisions really get made at scale.',
    tags: ['Consulting', 'Governance', 'Risk', 'Compliance'],
    metrics: [
      { label: 'Tenure', value: '1 Year' },
      { label: 'Practice', value: 'Risk Consulting' },
      { label: 'Focus', value: 'GRC' },
    ],
    accent: '#1D9BF0',
    caseStudy: {
      challenge:
        'Enterprise clients carry risk they cannot see. Controls exist on paper, ownership is spread across functions, and the gap between the documented process and the one people actually follow is where losses live. The work is finding that gap and closing it without grinding the business to a halt.',
      strategy: [
        'Start from the process, not the policy document — map how work actually flows before judging whether the control is adequate.',
        'Prioritise by exposure. Not every gap deserves the same remediation effort.',
        'Make findings actionable: a risk nobody owns is a risk nobody fixes.',
      ],
      execution: [
        'Worked across governance, risk and compliance engagements — walking processes, testing controls and documenting where design and operation diverged.',
        'Translated findings into remediation that business owners would realistically adopt rather than technically-correct recommendations that sit unread.',
        'Presented to client stakeholders, which is where I learned that the quality of the analysis matters less than whether the room believes it.',
      ],
      results: [
        'Completed a year in the risk consulting practice at PwC India.',
        'Built the structured problem-solving habit — hypothesis, evidence, recommendation — that I still use on every growth problem.',
        'Learned to work to a standard of rigour where the work has to survive review by people looking for holes.',
      ],
      lessons: [
        'Structure is a superpower. Most problems are unsolvable only because nobody has framed them properly yet.',
        'Rigour and speed are not opposites — consulting taught me to be fast because the framework was already sound.',
        'The deliverable is not the deck. It is whether anything changed after the deck.',
        'I learned how big organisations work, which is precisely why I wanted to go build in a small one.',
      ],
    },
  },
  {
    slug: 'cairros',
    name: 'Cairros Consulting',
    subtitle: 'Growth, marketing and strategy for founders',
    role: 'Founder',
    period: '2022 — Present',
    summary:
      'My own consulting practice — helping founders and businesses fix positioning, build growth engines and execute the strategy instead of just writing it.',
    tags: ['Growth', 'Marketing', 'Strategy', 'Transformation'],
    metrics: [
      { label: 'Clients Served', value: '7+' },
      { label: 'Role', value: 'Founder' },
      { label: 'Model', value: 'Execution-led' },
    ],
    accent: '#6EF2FF',
    caseStudy: {
      challenge:
        'Most small and mid-sized businesses do not have a strategy problem — they have an execution problem. They already know roughly what to do. What they lack is someone to build the operating system that makes it happen weekly, and the honesty to cut the things that are not working.',
      strategy: [
        'Diagnose before prescribing. The presenting problem ("we need more marketing") is almost never the actual constraint.',
        'Fix positioning first — no amount of spend rescues a message the market does not want.',
        'Build one growth channel to competence before opening a second.',
        'Leave behind an operating cadence, not a document. The engagement should outlive the engagement.',
      ],
      execution: [
        'Ran growth, marketing and strategy engagements across 7+ clients.',
        'Worked hands-on rather than advisory-only — building the funnel, writing the positioning, setting up the tracking and running the weekly review alongside the founders.',
        'Handled brand and digital transformation work for businesses moving from offline-first to a modern digital funnel.',
      ],
      results: [
        'Served 7+ clients across growth, marketing, strategy and transformation mandates.',
        'Built a practice model where the deliverable is a running growth function, not a slide deck.',
      ],
      lessons: [
        'Founders do not buy strategy. They buy momentum.',
        'Consulting that stops at recommendation is half a job — I would rather be measured on what shipped.',
        'Saying no to the wrong client is the highest-leverage decision in a services business.',
        'Every engagement taught me something I later used at ZenCabs. Consulting is a very fast way to see many businesses.',
      ],
    },
  },
  {
    slug: 'shaadi-mangalam',
    name: 'Shaadi Mangalam',
    subtitle: 'Luxury matrimonial platform',
    role: 'Brand & Growth',
    period: 'Client Engagement',
    summary:
      'Repositioned a matrimonial business toward the premium end of the market and built the digital funnel to generate qualified leads for it.',
    tags: ['Brand', 'Digital Marketing', 'Lead Generation', 'Positioning'],
    metrics: [
      { label: 'Focus', value: 'Luxury Segment' },
      { label: 'Workstreams', value: '3' },
      { label: 'Channel', value: 'Digital' },
    ],
    accent: '#1D9BF0',
    caseStudy: {
      challenge:
        'Matrimonial is a crowded, trust-driven and largely commoditised category where almost everyone competes on database size. Moving a business up-market means the brand has to earn a premium before the pricing can ask for one — and the lead flow has to get narrower and better, not bigger.',
      strategy: [
        'Reposition from volume to selectivity. In a luxury segment, who you turn away is part of the product.',
        'Rebuild the brand expression to match the price point — every touchpoint had to feel considered.',
        'Optimise the funnel for lead quality rather than lead count, since this is a high-touch, high-consideration purchase.',
      ],
      execution: [
        'Led the brand transformation — positioning, identity direction and messaging aimed at the premium segment.',
        'Built and ran the digital marketing engine across the acquisition channels that reach that audience.',
        'Set up lead generation and qualification so the sales conversation started with the right people.',
      ],
      results: [
        'Delivered a repositioned brand aimed squarely at the luxury end of the matrimonial market.',
        'Stood up a digital lead-generation funnel where the business previously relied on offline and referral flow.',
      ],
      lessons: [
        'Premium is not a price change. It is a consistency requirement across every single touchpoint.',
        'In high-consideration categories, one qualified lead beats fifty curious ones — optimise accordingly.',
        'Trust categories are won on signalling. What the brand implies matters as much as what it claims.',
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
