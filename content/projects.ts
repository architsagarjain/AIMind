import type { Project } from '@/types';

/**
 * Case studies.
 *
 * Every number below is from Archit's CV. The AI clone reads this file as fact
 * and is instructed never to invent a figure, so nothing speculative goes in
 * `metrics` or `results`.
 */
export const projects: Project[] = [
  {
    slug: 'zencabs',
    name: 'ZenCabs',
    subtitle: 'EV mobility, built for Jammu',
    role: 'Head of Strategy & Growth',
    period: 'Jan 2026 to Present',
    summary:
      'Took an EV mobility venture from launch to 25,000+ users and a ₹3 Cr annualised run-rate in four months.',
    tags: ['Founder’s Office', 'GTM', 'Marketplace Ops', 'Growth'],
    metrics: [
      { label: 'Users', value: '25K+' },
      { label: 'Run-Rate', value: '₹3 Cr' },
      { label: 'Monthly GMV', value: '₹25L+' },
    ],
    accent: '#0A84FF',
    caseStudy: {
      challenge:
        'Jammu is a market the national aggregators never prioritised. Riders defaulted to informal, phone-call bookings and unpredictable fares; drivers had no dependable pipeline of work. An EV fleet adds a second constraint: every idle car is capital sitting still, so utilisation decides whether the model works at all.',
      strategy: [
        'Treat supply as the harder half: sign and retain driver partners first, because a rider who opens the app to zero cars never opens it again.',
        'Make utilisation the north-star metric. On an owned EV fleet revenue per car is what compounds, and ride count can grow while utilisation falls.',
        'Compete on reliability. In a small market a ride that shows up is worth more to a rider than a discount.',
        'Institutionalise the operating cadence early: weekly KPI reviews with the founder, so problems surface within days.',
      ],
      execution: [
        'Built the founder’s-office layer end to end: GTM strategy, pricing, and the weekly operating cadence the growth function ran on.',
        'Onboarded 43 driver partners by designing the recruitment, training and incentive frameworks from scratch.',
        'Institutionalised 10+ SOPs across onboarding and dispatch to attack the cancellation problem directly.',
        'Ran voice-of-customer loops and retention plays to convert first-time riders into monthly actives.',
        'Built the market sizing and expansion case that justified adding 10+ cars a month.',
      ],
      results: [
        'Scaled from launch to 25,000+ users and a ₹3 Cr annualised run-rate in four months.',
        'Grew monthly GMV past ₹25L across 7,500+ rides at a ₹331 average order value.',
        'Converted 27% of the user base into 6,679 monthly active riders.',
        'Cut ride cancellations from 40% to 6%.',
        'Lifted fleet utilisation from 40% to 75%, tracked against 15+ KPIs in weekly founder reviews.',
        'Raised revenue per car to ₹62.5K per month.',
        'Grew the fleet to 40 cars in three months.',
      ],
      lessons: [
        'In a marketplace the constrained side is usually supply, so that is the side to solve first.',
        'On an owned fleet, utilisation is the business. A 40% to 75% move is worth more than any acquisition campaign I could have run with the same effort.',
        'Cancellations look like an ops problem and cost you retention. Every cancelled ride costs more than the acquisition that produced it.',
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
        'Co-developed an internal audit AI tool, then led firm-level training across 10 pilot engagements to drive adoption.',
        'Anchored DOA, internal audit and SOP development across 10 functions in two international mandates.',
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
      'The agency I started in college and scaled to seven-figure annual revenue in two years, owning strategy, sales and delivery end to end.',
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
        'Took a magazine client through a pricing and sales restructure over six months.',
        'Expanded across four sectors via rebrand, hiring and growth mandates backed by market research.',
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
    subtitle: 'Wedding services',
    role: 'Growth & Business Strategy Consultant',
    period: 'Apr 2026 to Present',
    summary:
      'Restructured pricing and sales for a wedding services business: monthly leads tripled to 3,000 and conversion moved from 1.4% to 4%.',
    tags: ['Growth', 'Pricing', 'Lead Generation', 'Product'],
    metrics: [
      { label: 'Monthly Leads', value: '3,000' },
      { label: 'Conversion', value: '1.4% → 4%' },
      { label: 'Fixes Shipped', value: '100+' },
    ],
    accent: '#C05CE0',
    caseStudy: {
      challenge:
        'Wedding services is a crowded, trust-driven and high-consideration category. Volume alone does nothing: a business can triple its leads and go backwards if pricing and the sales motion are not built to convert them. The constraint was conversion.',
      strategy: [
        'Fix conversion before chasing volume, because tripling leads into a 1.4% funnel multiplies the waste.',
        'Restructure pricing so the sales conversation starts from the value a family is getting.',
        'Run the website as a product with a backlog: ship fixes in sprints and measure each one.',
      ],
      execution: [
        'Restructured pricing and the sales process end to end.',
        'Led the website redesign and the digital strategy behind it.',
        'Shipped 100+ process and product fixes across sprints.',
      ],
      results: [
        'Tripled monthly leads to 3,000.',
        'Lifted conversion from 1.4% to 4%.',
        'Shipped 100+ process and product fixes.',
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
