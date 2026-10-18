import type { HeroStat } from '@/types';

/**
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * Every surface reads from this folder: the hero, the desktop windows, the
 * resume, and the knowledge base handed to the AI clone.
 *
 * All figures here come from content/archit-context.md, the verified context
 * file (last checked 18 October 2026). The AI clone reads that file directly
 * and is forbidden from inventing anything else, so nothing goes here that is
 * not in it.
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
  /** ISO date. The clone works out the age from it; the site never shows it. */
  born: '2003-09-12',
  based: 'Gurugram, India',
  currently: "PGP in Technology & Business Management, Masters' Union",
  alsoCurrently: 'Head of Strategy & Growth, ZenCabs',

  /** The CV's professional summary, trimmed for the hero. */
  summary:
    'Big-4 consultant turned founding-team operator. ₹6+ Cr in client cost savings at PwC India, and ZenCabs from launch to a ₹4 Cr annualised run-rate in six months.',

  description:
    'Big-4 consultant turned founding-team operator: risk consulting at PwC India, strategy and growth at ZenCabs, now the PGP in Technology & Business Management at Masters’ Union.',

  about: [
    'I grew up in Jammu and went to Delhi Public School there. I started doing real business work in 2019, running marketing for Indikraft, a Jammu handicrafts business, and taking it online: revenue rose 45% and the new D2C channel reached 20% of sales.',
    'I founded Cairros, a consulting and marketing agency, at 18, during my BBA at Symbiosis in Pune, and scaled it to seven-figure annual revenue across four sectors in two years, owning strategy, sales and delivery end to end. Alongside it I worked with Equip9, a construction-tech startup, where segmentation-led acquisition drove 300% profit growth.',
    'At PwC India I spent fifteen months in risk consulting and was promoted to Specialist 2 within a year. I delivered ₹6+ Cr in annual client cost savings for clients including Cars24, Stryker India and PIF, worked on mandates in the UAE and West Africa, and co-built an internal audit AI tool that saved 10,000+ consulting hours across 200+ consultants.',
    'Then I moved to the operator side. On the founding team at ZenCabs, an EV cab startup in Jammu, I helped scale it to 30,000+ users and a ₹4 Cr annualised run-rate in six months. Refocusing on the top six demand zones took fleet utilisation from 40% to 75%, and dispatch SOPs cut driver-side cancellations from 40% to 6%.',
    'Today I am on the PGP in Technology & Business Management at Masters’ Union, and I am looking at Founder’s Office, Chief of Staff and strategy roles, where consulting structure meets operator speed.',
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
 * Every figure is from the context file.
 */
export const heroStats: HeroStat[] = [
  { value: '₹6+ Cr', label: 'Client Savings Delivered' },
  { value: '30K+', label: 'ZenCabs Users' },
  { value: '₹4 Cr', label: 'Run-Rate In 6 Months' },
  { value: '10K+', label: 'Consulting Hours Saved' },
];
