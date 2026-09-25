import type { HeroStat } from '@/types';

/**
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * Every surface reads from this folder: the hero, the desktop windows, the
 * resume, and the knowledge base handed to the AI clone.
 *
 * All figures here are taken from Archit's CV. The AI clone quotes them
 * verbatim and is forbidden from inventing any others, so nothing goes in
 * `metrics` or `stats` that is not on the CV.
 */

export const profile = {
  name: 'Archit Sagar Jain',
  firstName: 'Archit',
  lastName: 'Jain',
  product: 'ARCHIT.AI',
  tagline: 'Talk. Explore. Know Me.',
  altTagline: "Don't read my portfolio. Talk to it.",
  roles: ['Founder', 'Growth Operator', 'Strategy Enthusiast'],
  hometown: 'Jammu, India',
  based: 'Gurugram, India',
  currently: "PGP in Technology & Business, Masters' Union",
  alsoCurrently: 'Head of Strategy & Growth, ZenCabs',

  /** The CV's professional summary, trimmed for the hero. */
  summary:
    'I turn ambiguous problems into decisions, systems and outcomes. ₹6+ Cr in client cost savings at PwC India, and ZenCabs from launch to a ₹3 Cr annualised run-rate in four months.',

  description:
    'I build, market and scale ideas. From risk consulting at PwC India to running strategy and growth at ZenCabs, and now the PGP at Masters’ Union.',

  about: [
    'I come from a fourth-generation business family in Jammu, so operating a business was the dinner-table conversation long before it was a career.',
    'I started Cairros in my second year of college and scaled it to seven-figure annual revenue in two years, owning strategy, sales and delivery end to end. It is still the fastest education I have had.',
    'At PwC India I spent fifteen months in risk consulting, delivering ₹6+ Cr in annual client cost savings across engagements worth ₹12 Cr+ for clients including Cars24, Stryker India and PIF. I also co-built an internal audit AI tool that saved 10,000+ consulting hours across 200+ consultants.',
    'Then I went in the other direction. At ZenCabs I took an EV mobility venture from launch to 25,000+ users and a ₹3 Cr annualised run-rate in four months, cutting cancellations from 40% to 6% and lifting fleet utilisation from 40% to 75%.',
    'Today I am at Masters’ Union on the PGP in Technology & Business, where consulting rigour meets founder-speed execution, which is where I want to be.',
  ],

  interests: [
    'Founder’s Office',
    'Growth',
    'Go-To-Market',
    'Strategy',
    'Consulting',
    'Operations',
    'Product',
    'AI',
  ],

  /** Shown in the hero as a credibility strip. */
  affiliations: ['PwC India', 'Masters’ Union', 'ZenCabs', 'Cairros', 'Symbiosis'],

  links: {
    email: 'architsagarjain@gmail.com',
    phone: '+91 96222 65599',
    linkedin: 'https://www.linkedin.com/in/archit-sagar-jain/',
  },
} as const;

/**
 * Hero stat strip. Keep to four — the layout is tuned for it.
 * Every figure is from the CV.
 */
export const heroStats: HeroStat[] = [
  { value: '₹6+ Cr', label: 'Client Savings Delivered' },
  { value: '25K+', label: 'ZenCabs Users' },
  { value: '₹3 Cr', label: 'Run-Rate In 4 Months' },
  { value: '10K+', label: 'Consulting Hours Saved' },
];
