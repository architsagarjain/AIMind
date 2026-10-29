/**
 * How to work with Archit: the roles he is looking for and the consulting
 * work he takes on. One source for the /work-with-me page, its structured
 * data, llms.txt and the AI clone, so every surface describes the offer the
 * same way.
 *
 * Every proof line is a verified figure from content/archit-context.md. There
 * are deliberately no prices or turnaround promises here: those are agreed
 * on the first call.
 */

/** The one-line positioning used in titles, meta descriptions and llms.txt. */
export const positioning = {
  headline: 'GTM, growth and strategy operator in India',
  /** For search results and AI summaries: who, what, proof, and the two ways in. */
  summary:
    "Archit Sagar Jain is a go-to-market, growth and strategy operator based in India: ex-PwC India risk consultant and founding-team Head of Strategy & Growth at ZenCabs, where he helped take an EV cab startup from launch to 30,000+ users and a ₹4 Cr annualised run-rate in six months. He is open to Founder's Office, Chief of Staff and strategy roles, and takes on consulting work in GTM and growth strategy, pricing, unit economics and cost reduction.",
  location: 'Gurugram and Jammu, India',
} as const;

/** Full-time roles, in order of preference (Section 2 of the context file). */
export const roles = [
  { title: "Founder's Office / Chief of Staff", note: 'My first choice: working next to a founder on whatever moves the business most.' },
  { title: 'Strategy & Business Transformation', note: 'Diagnosis, problem structuring and the operating fixes that follow.' },
  { title: 'Startup and corporate finance, VC/PE portfolio operations', note: 'Unit economics, business cases and helping portfolio companies hit their numbers.' },
] as const;

export interface Offer {
  id: string;
  title: string;
  /** What the work is, in plain words. */
  what: string;
  /** Verified results from doing exactly this. */
  proof: string;
  /** An article that shows how I think about it. */
  read?: { label: string; href: string };
}

export const offers: Offer[] = [
  {
    id: 'gtm',
    title: 'GTM and growth strategy',
    what: 'Who to sell to first, through which channels, at what price, and how to grow without buying the growth.',
    proof:
      'ZenCabs: from launch to 30,000+ users and a ₹4 Cr annualised run-rate in six months, with marketing held at about 10% of revenue.',
    read: { label: 'Electric cabs in a tier-2 city: the unit economics', href: '/articles/ev-cab-fleet-unit-economics-tier-2-india' },
  },
  {
    id: 'pricing',
    title: 'Pricing and conversion',
    what: 'Pricing, packaging and the funnel from first enquiry to paying customer, fixed in that order.',
    proof: 'Shaadi Mangalam: monthly revenue from ₹2L to ₹8L, and conversion from 1.4% to 4%.',
    read: { label: 'Pricing is the fastest lever in a services business', href: '/articles/pricing-services-business-playbook' },
  },
  {
    id: 'unit-economics',
    title: 'Unit economics, market sizing and expansion cases',
    what: 'What one unit earns, how big the market really is, and whether the next city, product or fleet expansion pays.',
    proof: 'ZenCabs: revenue per car to ₹83K a month, and the sizing and business case for adding 10+ cars a month.',
    read: { label: 'Sizing the cab market in a tier-2 city', href: '/articles/sizing-cab-market-tier-2-city' },
  },
  {
    id: 'cost',
    title: 'Business diagnosis and cost reduction',
    what: 'Finding where margin leaks, with root-cause diagnostics that leadership can act on.',
    proof: 'PwC India: ₹6+ Cr in annual client cost savings across 10+ clients. MCCS Infra: ₹2 Cr in cost savings unlocked.',
    read: { label: 'Where margin leaks in Indian companies', href: '/articles/where-margin-leaks-indian-companies' },
  },
  {
    id: 'cadence',
    title: 'Operating cadence: KPIs, reviews and SOPs',
    what: "A Founder's Office in practice: the metric tree, the weekly review and the SOPs that keep numbers moving.",
    proof: 'ZenCabs: 10+ SOPs and a weekly review of 15+ KPIs; driver-side cancellations fell from 40% to 6%.',
    read: { label: 'The weekly review that took driver-side cancellations from 40% to 6%', href: '/articles/weekly-operating-review-kpi-cadence' },
  },
];

/** Industries worked in (Section 2 of the context file). */
export const industries = [
  'Management consulting and risk advisory',
  'EV mobility and transportation',
  'Matrimony and consumer internet',
  'Infrastructure and construction',
  'Construction-tech B2B marketplaces',
  'Marketing and advertising services',
  'EdTech',
  'Handicrafts D2C',
] as const;

/** How an enquiry turns into work. */
export const howItStarts =
  "Every engagement starts with a 30-minute call about the problem. If it's a fit, I send a short written scope: what you get, how we'll measure it, and when.";

/** Questions people (and AI assistants) ask, answered from the facts above. */
export const faq = [
  {
    q: 'What does Archit Sagar Jain do?',
    a: "I'm a go-to-market, growth and strategy operator. I spent 15 months at PwC India in risk consulting, delivering ₹6+ Cr in client cost savings, and then joined the founding team at ZenCabs as Head of Strategy & Growth, helping take it from launch to 30,000+ users and a ₹4 Cr annualised run-rate in six months.",
  },
  {
    q: 'Which full-time roles is he open to?',
    a: "Founder's Office and Chief of Staff roles first, then strategy and business transformation, and startup or corporate finance and VC/PE portfolio operations. I'm currently on the PGP in Technology & Business Management at Masters' Union.",
  },
  {
    q: 'What consulting work does he take on?',
    a: 'GTM and growth strategy, pricing and conversion, unit economics and market sizing, business diagnosis and cost reduction, and setting up operating cadence (KPIs, weekly reviews, SOPs) for founders.',
  },
  {
    q: 'Which industries has he worked in?',
    a: 'Consulting and risk advisory, EV mobility, matrimony and consumer internet, infrastructure and construction, construction-tech, marketing services, EdTech and handicrafts D2C.',
  },
  {
    q: 'How do I get in touch?',
    a: 'Use the form on this page, email architsagarjain@gmail.com, or message me on LinkedIn at https://www.linkedin.com/in/archit-sagar-jain/.',
  },
] as const;
