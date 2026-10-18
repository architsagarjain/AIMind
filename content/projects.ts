import type { Project } from '@/types';

/**
 * Case studies.
 *
 * Every number below is from content/archit-context.md, the verified context
 * file. The AI clone is instructed never to invent a figure, so nothing
 * speculative goes in `metrics` or `results`.
 */
export const projects: Project[] = [
  {
    slug: 'zencabs',
    name: 'ZenCabs',
    subtitle: 'EV cab startup, built for Jammu',
    role: 'Head of Strategy & Growth (founding team)',
    period: 'Jan 2026 to Present',
    summary:
      'On the founding team of an all-electric cab fleet in Jammu: from launch to 30,000+ users and a ₹4 Cr annualised run-rate in six months.',
    tags: ['Founder’s Office', 'GTM', 'Unit Economics', 'Analytics', 'Ops'],
    metrics: [
      { label: 'Users', value: '30K+' },
      { label: 'Run-Rate', value: '₹4 Cr' },
      { label: 'Monthly GMV', value: '₹33L+' },
    ],
    accent: '#0A84FF',
    caseStudy: {
      challenge:
        'ZenCabs, operated by Shambho EV Cabs and founded by Aayush Chopra, runs an all-electric cab fleet and ride-hailing app in Jammu. Riders there defaulted to phone bookings and unpredictable fares, and an owned EV fleet adds a second constraint: every idle car is capital sitting still, so utilisation decides whether the model works at all.',
      strategy: [
        'Find the lever in the ride data before spending: where the cars go, when they are short, and which drivers are struggling.',
        'Make utilisation and revenue per car the measures that matter, because on an owned fleet ride count can grow while both fall.',
        'Fix the system (zones, shifts, incentives, SOPs) and hold it with a weekly KPI review with the founder.',
        'Grow lean: GTM and pricing over paid acquisition, with marketing held at about 10% of revenue.',
      ],
      execution: [
        'Zone refocus: ride data showed cars being sent to far-off, low-yield pickups. I found the top 6 demand zones and phased out the far-off ones over two months.',
        'The 5 pm problem: we were losing evening rides with enough cars on the fleet. Analytics showed a 5 to 8 pm supply gap, with driver shifts ending as demand peaked, so I moved 5 shifts two hours later.',
        'Driver incentives: lower-performing drivers earned too little, which hurt motivation and retention, so I redesigned the incentive cost structure.',
        'Dispatch SOPs: put 10+ SOPs in place for onboarding and dispatch, and tracked 15+ KPIs in weekly reviews with the founder.',
        'Built the market sizing and expansion case for adding 10+ cars a month, and ran voice-of-customer loops and retention plays.',
      ],
      results: [
        'Launch to 30,000+ users and a ₹4 Cr annualised run-rate in six months.',
        'Monthly GMV past ₹33L across 10,000+ rides at a ₹331 average order value.',
        'Fleet utilisation from 40% to 75%, revenue per car ₹83K a month, and user cancellations down 60%, from 200 to 80 a day.',
        '200+ extra rides a month at zero added cost from the shift change.',
        'Revenue from the bottom 55% of drivers up 70%.',
        'Driver-side cancellations from 40% to 6%, which is 94% ride completion.',
        '27% of users became 8,100 monthly actives.',
        'Fleet from 0 to 40 cars in three months, with 43 driver partners onboarded.',
      ],
      lessons: [
        'Not all demand is good demand. Serving every far-off pickup felt like growth and was hurting utilisation; look at yield per zone, not just volume.',
        'Enough supply at the wrong hours is still a supply problem. The cheapest fix was moving shifts, not adding cars.',
        'The two cancellation numbers measure different things: driver-side cancellations fell with SOPs, user cancellations fell with the zone refocus.',
        'The weekly KPI review with the founder was the most useful thing I built there.',
      ],
    },
  },
  {
    slug: 'pwc',
    name: 'PwC India',
    subtitle: 'Risk consulting: diagnostics, process and cost',
    role: 'Risk Consulting Specialist 2',
    period: 'Oct 2024 to Jan 2026',
    summary:
      'Fifteen months in Big-4 risk consulting: ₹6+ Cr in annual client cost savings, and an internal AI tool that saved 10,000+ consulting hours.',
    tags: ['Consulting', 'Process Design', 'Cost Reduction', 'Applied AI'],
    metrics: [
      { label: 'Client Savings', value: '₹6+ Cr' },
      { label: 'Engagements', value: '₹12 Cr+' },
      { label: 'Hours Saved', value: '10K+' },
    ],
    accent: '#5E5CE6',
    caseStudy: {
      challenge:
        'Enterprise clients carry cost and risk they cannot see. Controls exist on paper, ownership is spread across functions, and the gap between the documented process and the one people actually follow is where both losses and delay live. The work is finding that gap, sizing it, and closing it without grinding the business to a halt.',
      strategy: [
        'Start from the process as people run it, and walk how the work actually flows before judging whether a control is adequate.',
        'Size everything. A finding without a number attached does not get prioritised, and does not get funded.',
        'Attack decision latency as well as cost: approval structure is usually the cheapest thing to fix and the least examined.',
        'Automate the repeatable parts of our own delivery as well as the client’s.',
      ],
      execution: [
        'Ran root-cause diagnostics and process redesign across procurement, HR and finance, reengineering 25+ processes.',
        'Designed delegation-of-authority matrices and approval workflows for CXOs.',
        'Co-developed an internal audit AI tool with an external AI partner: I sourced the partner, shaped the non-technical design and scoped new audit use cases, then led firm-level training across 10 pilot engagements.',
        'Led DOA, internal audit and SOP development across 10 functions in two international mandates, for UAE and West Africa clients.',
        'Ran structured leadership reporting and business reviews to secure CXO buy-in.',
      ],
      results: [
        'Delivered ₹6+ Cr in annual client cost savings.',
        'Realised ₹2 Cr+ of that by reengineering 25+ processes across procurement, HR and finance.',
        'Cut decision turnaround by 30%+ through DOA matrices and redesigned approval workflows.',
        'Saved 10,000+ consulting hours across 200+ consultants with the internal audit AI tool.',
        'Reached 50% tool adoption within six months.',
        'Won ₹80L in additional business by prioritising 8+ initiatives through opportunity assessment.',
        'Executed engagements worth ₹12 Cr+ for 10+ clients including Cars24, Stryker India and PIF.',
        'Secured CXO buy-in on 20+ recommendations.',
        'Promoted to Specialist 2 within 12 months.',
      ],
      lessons: [
        'Many problems look unsolvable only because nobody has framed them properly yet.',
        'Put a number on it or it does not get fixed. Sizing a finding is half the work of closing it.',
        'The fastest cost saving is usually in decision rights: who can approve what, and how quickly.',
        'Building the AI tool taught me more about adoption than about AI. Fifty percent uptake came from training people on real engagements.',
      ],
    },
  },
  {
    slug: 'cairros',
    name: 'Cairros',
    subtitle: 'Consulting & marketing agency',
    role: 'Founder & Managing Partner',
    period: 'Aug 2022 to May 2024',
    summary:
      'The agency I founded at 18, during college, and scaled to seven-figure annual revenue across four sectors in two years.',
    tags: ['Venture Building', 'P&L', 'Growth', 'Brand'],
    metrics: [
      { label: 'Revenue', value: '7-Figure' },
      { label: 'Sectors', value: '4' },
      { label: 'Built In', value: '2 Years' },
    ],
    accent: '#0E9F9F',
    caseStudy: {
      challenge:
        'Most small and mid-sized businesses already know roughly what to do. What they lack is execution: someone to build the operating system that makes it happen every week, and the honesty to cut what is not working. Doing that as a student, with no brand and no balance sheet, meant every engagement had to sell the next one.',
      strategy: [
        'Diagnose before prescribing. The presenting problem ("we need more marketing") is almost never the actual constraint.',
        'Own the P&L along with the deliverable. Running the business taught me more than any single engagement did.',
        'Go deep in one sector before going wide, because a reputation in one vertical is what gets you into the next.',
        'Leave behind an operating cadence the client keeps running after the engagement ends.',
      ],
      execution: [
        'Built the agency from scratch while at Symbiosis, owning strategy, sales and delivery end to end.',
        'Ran menu reengineering and table-turnaround operations for restaurant clients.',
        'Took a magazine client through a redesign, SEO and distribution overhaul over six months.',
        'Expanded across four sectors via rebrand, hiring and growth mandates, including a brand redesign and mascot for a paint brand and a hiring and digital overhaul for a leading Pune realtor.',
      ],
      results: [
        'Scaled to seven-figure annual revenue in two years.',
        'Grew three restaurant clients 30% in revenue, at 7% month on month.',
        'Raised a magazine client’s sales 3.5x, from ₹2L to ₹7L per month, at 23% month on month over six months.',
        'Expanded the practice across four sectors.',
      ],
      lessons: [
        'What small-business founders pay for is momentum.',
        'Running your own P&L teaches you which advice is actually expensive to follow.',
        'Turning down the wrong client is the most valuable decision a services business makes.',
        'Every engagement compounded. Cairros is why I could walk into PwC already knowing how a business breaks.',
      ],
    },
  },
  {
    slug: 'mccs-infra',
    name: 'MCCS Infra',
    subtitle: 'Infrastructure & construction',
    role: 'Business Transformation Consultant',
    period: 'Nov 2024 to Jul 2025',
    summary:
      'Restructured manpower and hiring for an infrastructure business, unlocking ₹2 Cr in cost savings and 4.5x inbound enquiries.',
    tags: ['Transformation', 'Workforce', 'Digital Strategy'],
    metrics: [
      { label: 'Cost Unlocked', value: '₹2 Cr' },
      { label: 'Enquiries', value: '4.5x' },
      { label: 'Hiring TAT', value: '−80%' },
    ],
    accent: '#FF9F0A',
    caseStudy: {
      challenge:
        'Construction businesses carry their cost base in people and idle capacity, and typically hire reactively, paying a premium for speed they rarely get. The commercial front door was also invisible: with no digital presence, every enquiry came through the same handful of relationships.',
      strategy: [
        'Treat manpower as capacity planning against the project pipeline.',
        'Fix the hiring system before hiring anyone else, since a broken funnel only scales the cost.',
        'Open a second demand channel so the business is not hostage to its existing network.',
      ],
      execution: [
        'Restructured manpower and rebuilt capacity planning against the actual project pipeline.',
        'Redesigned the hiring system and resource allocation end to end.',
        'Drove the digital strategy and a full brand overhaul to open inbound as a channel.',
      ],
      results: [
        'Unlocked ₹2 Cr in cost savings through manpower restructuring and capacity planning.',
        'Accelerated inbound enquiries 4.5x.',
        'Compressed hiring turnaround time by 80% and halved cost per hire.',
      ],
      lessons: [
        'In a people-heavy business, the org chart is the cost structure. Change one and you have changed the other.',
        'Reactive hiring is the most expensive hiring. Fixing the system beat fixing any individual role.',
        'A brand overhaul is a growth lever in sectors that assume it is a vanity spend.',
      ],
    },
  },
  {
    slug: 'shaadi-mangalam',
    name: 'Shaadi Mangalam',
    subtitle: 'Matrimony platform',
    role: 'Growth & Business Strategy Consultant',
    period: 'Apr 2026 to Present',
    summary:
      'Built the full conversion funnel for a matrimony platform: monthly revenue up 4x, from ₹2L to ₹8L, and conversion from 1.4% to 4%.',
    tags: ['Funnel', 'Pricing', 'Product', 'Growth'],
    metrics: [
      { label: 'Monthly Revenue', value: '₹2L → ₹8L' },
      { label: 'Conversion', value: '1.4% → 4%' },
      { label: 'Monthly Leads', value: '3,000' },
    ],
    accent: '#C05CE0',
    caseStudy: {
      challenge:
        'A matrimony platform sells trust to families making a high-stakes decision. Leads were arriving, but pricing, the sales motion and the website were not built to turn them into paying customers. The constraint was conversion.',
      strategy: [
        'Fix conversion before chasing volume, because tripling leads into a 1.4% funnel multiplies the waste.',
        'Restructure pricing and sales so the conversation starts from what a family is getting.',
        'Run the website and service journey as a product with a backlog: ship fixes in sprints and measure each one.',
      ],
      execution: [
        'Worked with the founder across product development, UI/UX, the website, service and customer-service design, marketing and branding.',
        'Restructured pricing and the sales process end to end.',
        'Shipped 100+ product and UX fixes across sprints, redesigning the website, service journey and brand.',
      ],
      results: [
        'Quadrupled monthly revenue from ₹2L to ₹8L, at 26% month on month.',
        'Tripled monthly leads from 1,000 to 3,000.',
        'Lifted conversion from 1.4% to 4%.',
        'Revenue grew 4x while leads times conversion grew more, because average package sizes became smaller as conversion widened.',
      ],
      lessons: [
        'Conversion first, volume second. Almost every growth brief I get has this backwards.',
        'Pricing is the fastest lever in a services business and the one founders are most reluctant to touch.',
        'Shipping 100 small fixes beat waiting to ship one big redesign.',
      ],
    },
  },
  {
    slug: 'equip9',
    name: 'Equip9',
    subtitle: 'Construction-tech marketplace',
    role: 'Digital Marketing Executive',
    period: 'Dec 2022 to Oct 2024',
    summary:
      'Segmentation-led acquisition for a construction-tech marketplace: 40% better lead conversion and 300% profit growth.',
    tags: ['Performance Marketing', 'Segmentation', 'Content', 'AI Workflows'],
    metrics: [
      { label: 'Profit Growth', value: '300%' },
      { label: 'Conversion', value: '+40%' },
      { label: 'Revenue', value: '₹30L+' },
    ],
    accent: '#0A84FF',
    caseStudy: {
      challenge:
        'A marketplace selling to contractors and equipment owners cannot run one message at everyone: the buyer renting a machine for a week and the owner listing a fleet want completely different things. Undifferentiated acquisition was burning spend on the wrong half of the audience.',
      strategy: [
        'Segment the audience properly and let each segment have its own message and funnel.',
        'Optimise for conversion quality, because sales capacity was the real bottleneck.',
        'Industrialise content production so the channel could scale without linear headcount.',
      ],
      execution: [
        'Rebuilt acquisition around segments, each with its own message and funnel.',
        'Owned branding and client delivery across 15+ accounts.',
        'Built a content engine plus AI workflow agents to compress production time.',
      ],
      results: [
        'Improved lead conversion by 40% and drove 300% profit growth.',
        'Generated ₹30L+ in annual revenue across 15+ accounts.',
        'Halved content production turnaround.',
      ],
      lessons: [
        'Segmentation is the cheapest performance lever there is, and the most skipped.',
        'If sales capacity is the bottleneck, more leads make things worse.',
        'Automating the content pipeline was the first time I saw AI move a real operating metric.',
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
