import type { HeroStat } from '@/types';

/**
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * Every surface reads from this folder: the hero, the desktop windows, the
 * resume, and the knowledge base handed to the AI clone.
 *
 * Editing rule: figures in `metrics` and `stats` are quoted verbatim by the AI.
 * Only put numbers here you are willing to defend in an interview — the system
 * prompt forbids the model from inventing any others.
 */

export const profile = {
  name: 'Archit Jain',
  firstName: 'Archit',
  lastName: 'Jain',
  product: 'ARCHIT.AI',
  tagline: 'Talk. Explore. Know Me.',
  altTagline: "Don't read my portfolio. Talk to it.",
  roles: ['Founder', 'Growth Operator', 'Strategy Enthusiast'],
  hometown: 'Jammu, India',
  currently: "PGP in Technology & Business, Masters' Union",
  description:
    "I build, market and scale ideas. From consulting at PwC to launching ZenCabs in Jammu and studying at Masters' Union, I'm always curious about what's next.",
  about: [
    'I come from a fourth-generation business family in Jammu, so operating a business was the dinner-table conversation long before it was a career.',
    'I started in marketing and consulting, then spent a year at PwC India in risk consulting — governance, risk and compliance work that taught me how large organisations actually make decisions.',
    'From there I went the other direction entirely: I joined ZenCabs in Jammu as Head of Strategy & Growth and helped take it to 20,000+ users, and I founded Cairros Consulting to do growth, marketing and strategy work for founders.',
    "Today I'm at Masters' Union pursuing a PGP in Technology & Business, sitting at the intersection of startups, growth and technology — which is exactly where I want to be.",
  ],
  interests: [
    'Startups',
    'Growth',
    'Strategy',
    'Consulting',
    'Marketing',
    'Product',
    'AI',
  ],
  links: {
    email: 'hello@architjain.ai',
    linkedin: 'https://www.linkedin.com/in/architsagarjain',
    github: 'https://github.com/architsagarjain',
  },
} as const;

/** Hero stat strip. Keep to four — the layout is tuned for it. */
export const heroStats: HeroStat[] = [
  { value: '20K+', label: 'ZenCabs Users' },
  { value: '7+', label: 'Clients Served' },
  { value: '1', label: 'Year At PwC' },
  { value: '∞', label: 'Ideas Ahead' },
];
