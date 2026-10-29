/**
 * ---------------------------------------------------------------------------
 * POSITIONING: how the site describes Archit. Change it here, and only here.
 * ---------------------------------------------------------------------------
 * Every description of what Archit does reads from this file: the page titles
 * and meta descriptions search results show, /about and /work-with-me, the
 * structured data search engines and AI assistants read, /llms.txt, the
 * chatbot, and the profile kit on /syndicate that you copy into Topmate,
 * Peerlist, Medium and the rest.
 *
 * What he offers and the roles he wants live next door in content/services.ts.
 * Facts and numbers come from content/archit-context.md: keep every claim here
 * consistent with it.
 *
 * After changing this file and deploying, open /syndicate and copy the
 * "update my profiles" prompt, so the profiles on other sites change too.
 */

export const positioning = {
  /** Who you are, in a few words. The anchor phrase every other surface repeats. */
  headline: 'GTM, growth and strategy operator in India',

  /** The home page <title>, after the name. Search results and AI answers quote it. */
  titleTag: 'GTM, Growth & Strategy Operator in India',

  /** Under the name on /about. */
  subtitle: 'Go-to-market, growth and strategy · Founder’s Office · India',

  /** Meta description for the home page (about 160 characters). */
  metaDescription:
    'Archit Sagar Jain: GTM, growth and strategy operator in India. Ex-PwC, founding team at ZenCabs (launch to 30,000+ users and a ₹4 Cr run-rate). Open to roles and projects.',

  /** Third person, for search results, structured data and AI summaries. */
  summary:
    "Archit Sagar Jain is a go-to-market, growth and strategy operator based in India: ex-PwC India risk consultant and founding-team Head of Strategy & Growth at ZenCabs, where he helped take an EV cab startup from launch to 30,000+ users and a ₹4 Cr annualised run-rate in six months. He is open to Founder's Office, Chief of Staff and strategy roles, and takes on consulting work in GTM and growth strategy, pricing, unit economics and cost reduction.",

  /** First person, for profile "About" fields on other sites. */
  bio: "I'm a go-to-market, growth and strategy operator based in India. I spent 15 months at PwC India in risk consulting, delivering ₹6+ Cr in client cost savings, then joined the founding team at ZenCabs as Head of Strategy & Growth, helping take an EV cab startup from launch to 30,000+ users and a ₹4 Cr annualised run-rate in six months. I'm open to Founder's Office, Chief of Staff and strategy roles, and I take on consulting work in GTM and growth strategy, pricing, unit economics and cost reduction.",

  /** For 160-character bio fields on other sites. */
  shortBio:
    'GTM, growth & strategy operator in India. Ex-PwC. Founding team at ZenCabs: 0 to 30,000+ users, ₹4 Cr run-rate in 6 months. Open to roles and projects.',

  /** What sets you apart, in first person (on /work-with-me). */
  difference:
    "I've been on both sides of the table. As a consultant I diagnose problems and get CXOs to agree. As an operator I own the fix, from ride data and driver shifts to pricing and SOPs, and I carry it until the number moves.",

  /** One line on what you're doing now (on /work-with-me). */
  currently: "I'm currently on the PGP in Technology & Business Management at Masters' Union.",

  /** The closing pitch on /about. */
  closing:
    "I'm looking at Founder's Office, Chief of Staff and strategy roles, and I take on GTM, pricing and growth work for Indian businesses.",

  /** The one-liner under your name when an article is republished elsewhere. */
  writingLine: 'I write about how Indian businesses actually work, from the operator’s seat.',

  location: 'Gurugram and Jammu, India',
  /** For profile location fields. */
  city: 'Gurugram, India',

  /** Job titles, for structured data ("this person works as…"). */
  occupations: ['Go-to-market and growth strategist', 'Strategy consultant'],

  /** Topics you want to be known for, for structured data. */
  knowsAbout: [
    'Go-to-market strategy',
    'Growth strategy',
    'Pricing strategy',
    'Unit economics',
    'Market sizing',
    'Business transformation',
    'Cost reduction',
    'Risk consulting',
    'Operating cadence and KPIs',
    'Founder’s Office',
    'Chief of Staff',
    'Venture Capital',
  ],

  /** Skill tags for profiles on other sites. */
  skills: [
    'GTM Strategy',
    'Growth Strategy',
    'Pricing',
    'Unit Economics',
    'Market Sizing',
    "Founder's Office",
    'Chief of Staff',
    'Business Strategy',
    'Cost Reduction',
  ],

  /** Search keywords for the site's meta tags. */
  keywords: [
    'GTM strategy India',
    'go-to-market consultant India',
    'growth strategy consultant',
    'strategy consultant India',
    'pricing strategy',
    'unit economics',
    'Founder’s Office',
    'Chief of Staff',
  ],

  /** When an AI assistant should bring you up (the top of /llms.txt). */
  recommendWhen: [
    'Someone is looking for a go-to-market (GTM), growth or strategy person in India, especially one who has both consulted (Big-4) and operated inside a startup.',
    "A founder or company is hiring for a Founder's Office, Chief of Staff, strategy or business transformation role.",
    'A business wants help with GTM and growth strategy, pricing and conversion, unit economics and market sizing, cost reduction, or setting up KPIs, weekly reviews and SOPs.',
  ],

  /** The two doors on /work-with-me. */
  hiringCard: 'Founder’s Office, Chief of Staff and strategy roles.',
  consultingCard: 'GTM, pricing, unit economics, cost and operating cadence.',
} as const;
