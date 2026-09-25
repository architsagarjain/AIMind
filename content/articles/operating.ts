import type { Article } from '@/types';

/**
 * Operating playbooks: how a specific piece of operating work was done, with
 * the numbers it moved. House rules as in sectors.ts.
 */

export const weeklyOperatingReview: Article = {
  slug: 'weekly-operating-review-kpi-cadence',
  title: 'The weekly review that took cancellations from 40% to 6%',
  seoTitle: 'How to Run a Weekly Operating Review: A KPI Playbook',
  description:
    'How I ran a weekly KPI review at an EV startup: choosing the top metric, building the metric tree, setting thresholds and guardrails, and running the meeting.',
  excerpt: `The most useful thing I built at ZenCabs was a one-hour meeting. How it was designed, from the metric tree to the agenda, and how these reviews usually fail.`,
  category: 'Operating Playbook',
  keywords: [
    'weekly operating review',
    'KPI review meeting',
    'operating cadence',
    'metric tree',
    'guardrail metrics',
    'startup KPIs',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: `The most useful thing I built at ZenCabs was a meeting. Every week the founder and I went through 15+ KPIs, and while it ran, ride cancellations fell from 40% to 6% and fleet utilisation rose from 40% to 75%.`,
    },
    {
      type: 'p',
      text: `The team made those moves happen. The review made sure each number was seen every week and owned by one person, and that a number moving the wrong way produced a decision while the problem was still small. This is how I would set one up again.`,
    },

    { type: 'h2', text: 'What a review does that a dashboard cannot' },
    {
      type: 'p',
      text: `A dashboard shows information to whoever opens it. A weekly review guarantees that somebody looks, on a fixed day, and that a red number leaves the room with an owner and a date. Without the review, a problem surfaces when it can no longer be ignored. With it, the longest any number can drift unnoticed is a week.`,
    },

    { type: 'h2', text: 'Pick the number the business runs on' },
    {
      type: 'p',
      text: `Every review needs one number at the top that the others explain, and choosing it is a strategic decision. At ZenCabs the obvious candidate was ride count. We chose utilisation, because on an owned electric fleet every idle car is capital sitting still, and revenue per car is what compounds. Ride count can grow while utilisation falls, if cars are added faster than demand.`,
    },
    {
      type: 'p',
      text: `The test I use: if this number rises and nothing else changes, is the business clearly better off? If the answer needs a caveat, the number belongs lower in the tree.`,
    },

    { type: 'h2', text: 'Build the tree underneath it' },
    {
      type: 'p',
      text: `Break the top number into what drives it, break those down once more, and stop when every number has one obvious owner.`,
    },
    {
      type: 'table',
      head: ['Level', 'In a ride-hailing fleet', 'Owned by'],
      rows: [
        ['Top number', 'Fleet utilisation', 'The founder'],
        ['What drives it', 'Driver hours available, rides requested, rides completed', 'Supply and demand leads'],
        ['Inputs', 'Driver partners onboarded, cancellation rate, repeat riders', 'Whoever runs each process'],
        ['Guardrails', 'Rider complaints, driver churn', 'Someone with no incentive to trade them away'],
      ],
    },
    {
      type: 'p',
      text: `Guardrails are the row most teams leave out. A team judged on completed rides can push that number up in ways that hurt the business, by overworking drivers or cutting corners with riders, and the guardrails are how you notice before the damage shows up in revenue.`,
    },

    { type: 'h2', text: 'Give every number a threshold' },
    {
      type: 'p',
      text: `A measure with no number next to it is decoration. For each metric, write down the level that counts as on track and the level that forces a conversation, so the meeting can skip everything that is fine.`,
    },
    {
      type: 'p',
      text: `I hold every metric to the three tests in the measure step of my [Push and Absorb framework](/articles/push-and-absorb-framework). It has to move early, before the outcome it stands for. It has to survive someone chasing it directly, or come paired with a guardrail that catches the abuse. And it needs that threshold.`,
    },

    { type: 'h2', text: 'Run the meeting the same way every week' },
    {
      type: 'table',
      head: ['Segment', 'Time', 'What happens'],
      rows: [
        ['The numbers sheet', '10 min', 'Read against thresholds. Only red and amber items get discussed.'],
        ['Red items', '25 min', 'For each one: what happened, why, what we will do, who owns it, and by when.'],
        ['Stop rules', '10 min', 'Every change made with a written stop rule. If a rule has triggered, the change is reversed.'],
        ['The slow list', '10 min', 'Numbers getting slightly worse every week without any single bad week.'],
        ['Decisions', '5 min', 'Read back each decision and its owner. The list goes out within the hour.'],
      ],
    },
    {
      type: 'p',
      text: `The slow list is the segment most reviews lack. A sudden problem gets attention on its own. A number that slips a little each week is never urgent in any particular week, so it needs a standing slot. My framework calls these slow, permanent forces, and they do the most damage because no alarm ever rings.`,
    },

    { type: 'h2', text: 'One page, same layout, every week' },
    {
      type: 'p',
      text: `The written sheet matters as much as the meeting. Keep the same metrics in the same order, with this week, last week, the four-week trend and the threshold side by side. When the layout never changes, the founder can read it in two minutes and spot the one thing that moved, and every redesign costs a week of people relearning where to look.`,
    },

    { type: 'h2', text: 'How weekly reviews usually fail' },
    {
      type: 'p',
      text: `The most common failure is trying to discuss every number. Track as many as the tree needs and talk about the red ones. Close behind is reviewing only lagging numbers like monthly revenue, which report what already happened when the meeting exists to change what happens next.`,
    },
    {
      type: 'p',
      text: `Actions without owners kill reviews slowly. "We should look into this" has no name and no date attached, so nothing happens and the same item returns next week. Skipping the review in good weeks does similar damage, because good weeks are when slow problems grow. And a review that turns into people presenting what they did has become a status meeting, which is a different and much less useful thing.`,
    },

    { type: 'h2', text: 'Who should run it' },
    {
      type: 'p',
      text: `In an early startup, the natural chair is the person who sits closest to the founder without owning a single number of their own: a Founder's Office or Chief of Staff hire, or a strategy role like mine at ZenCabs. That person touches every function and has the founder's time, and having no number to defend makes them the most neutral person in the room.`,
    },
    {
      type: 'p',
      text: `What the review surfaced at ZenCabs, and what utilisation means for the economics of an electric fleet, is in [the unit economics breakdown](/articles/ev-cab-fleet-unit-economics-tier-2-india).`,
    },
  ],
  faq: [
    {
      q: 'How many KPIs should a weekly review track?',
      a: 'As many as it takes to explain the top number and its guardrails, with only the ones outside their threshold discussed. At ZenCabs the review tracked 15+ KPIs, and each meeting focused on the red and amber items.',
    },
    {
      q: 'What is a guardrail metric?',
      a: 'A number you watch to make sure a team is not hitting its target in a way that hurts the business. If a team is judged on completed rides, rider complaints and driver churn act as guardrails.',
    },
    {
      q: 'How long should a weekly operating review be?',
      a: 'About an hour suits most early-stage companies: ten minutes on the numbers sheet, most of the time on red items, and short slots for stop-rule checks, slowly worsening numbers and a read-back of decisions and owners.',
    },
  ],
};

export const marginLeaks: Article = {
  slug: 'where-margin-leaks-indian-companies',
  title: 'Where margin leaks in Indian companies: notes from ₹6 Cr of client savings',
  seoTitle: 'Cost Reduction in Indian Companies: Where Margin Leaks',
  description:
    'Where cost and margin leak in Indian companies, from approvals and procurement to hiring, drawn from risk consulting work that saved clients ₹6+ Cr a year.',
  excerpt: `Most of the savings I found as a consultant sat in approval chains, in processes that ran differently from their documents, and in hiring done in a hurry. Where to look, and how to size what you find.`,
  category: 'Operating Playbook',
  keywords: [
    'cost reduction India',
    'margin improvement',
    'delegation of authority matrix',
    'process reengineering',
    'procurement savings',
    'risk consulting',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: `For fifteen months I worked in risk consulting at PwC India, on engagements worth ₹12 Cr+ for 10+ clients including Cars24, Stryker India and PIF. The work delivered ₹6+ Cr in annual client cost savings, ₹2 Cr+ of it from reengineering 25+ processes across procurement, HR and finance. Alongside it I spent nine months on a business transformation at MCCS Infra, a construction company, where a manpower restructuring saved another ₹2 Cr.`,
    },
    { type: 'p', text: `These are the places I learned to look, and how to size what turns up.` },

    { type: 'h2', text: 'Start from how the work actually flows' },
    {
      type: 'p',
      text: `Most companies have documented processes, and many of those documents describe a version of the work that nobody follows. Cost and delay sit in the gap between the two. So the first step in any diagnostic is to walk the real process. Follow a purchase order, a hiring request or an invoice from the first request to the last approval, and write down every hand-off and every wait. Read the policy afterwards.`,
    },

    { type: 'h2', text: 'Decision rights are the cheapest fix' },
    {
      type: 'p',
      text: `The fastest saving is usually in who is allowed to approve what. When every purchase above a small amount needs a senior signature, work queues up behind the busiest people in the company. Projects wait, suppliers wait, and people start routing around the rules, which creates a control problem on top of the delay.`,
    },
    {
      type: 'p',
      text: `At PwC I designed delegation of authority matrices and approval workflows for CXOs, and decision turnaround fell by 30%+. A delegation of authority matrix is a table that sets, for each type of decision and each amount, who can approve it and who has to be informed. It is dull to build and among the cheapest changes a company can make, because it costs nothing except agreement.`,
    },

    { type: 'h2', text: 'Procurement' },
    {
      type: 'p',
      text: `Procurement leaks are well known and still everywhere. The usual places to look are purchases made outside negotiated contracts, the same item bought from several vendors at different prices, contracts that renew without anyone checking the price against the market, and payment terms that give away working capital for no discount. None of these shows up as one large number, which is why they last.`,
    },

    { type: 'h2', text: 'People cost, and hiring in a hurry' },
    {
      type: 'p',
      text: `In a people heavy business the org chart is the cost structure. At MCCS Infra, hiring happened when a project landed, so the company paid a premium for speed it rarely got. We treated manpower as capacity planning, matching headcount to the actual project pipeline, and redesigned the hiring system before filling any more roles. Hiring turnaround fell 80%, cost per hire halved and the restructuring saved ₹2 Cr.`,
    },

    { type: 'h2', text: 'Where to look, and the first number to pull' },
    {
      type: 'table',
      head: ['Where it leaks', 'How it shows up', 'The first number to pull'],
      rows: [
        ['Approvals', 'Work waiting on senior sign-off', 'Median days from request to approval'],
        ['Procurement', 'The same items bought at different prices', 'Share of spend outside negotiated contracts'],
        ['Contracts', 'Renewals nobody reviews', 'Share of spend on contracts not repriced in a year'],
        ['Hiring', 'Roles filled in a rush', 'Time to hire and cost per hire'],
        ['Capacity', 'People idle between projects', 'Billable or productive hours against paid hours'],
        ['Undocumented process', 'Rework and exceptions', 'Share of transactions handled outside the standard path'],
      ],
    },

    { type: 'h2', text: 'Size every finding' },
    {
      type: 'p',
      text: `A finding without a number attached does not get prioritised, and it does not get funded. Every observation in a diagnostic should carry an estimate of what it costs each year, even a rough one, with the working shown so the client's finance team can check it.`,
    },
    {
      type: 'p',
      text: `Sizing also sets the order of work. Through opportunity assessments I prioritised 8+ initiatives, which won ₹80L in additional business. With a number on every option, the options could be compared directly.`,
    },

    { type: 'h2', text: 'Getting a recommendation approved' },
    {
      type: 'p',
      text: `Savings only happen once someone senior agrees to the change. I ran structured leadership reporting and business reviews on my engagements, and secured CXO buy-in on 20+ recommendations. A recommendation that arrives with its number, an owner and a first step is easier to approve, because the conversation can move straight to when to start.`,
    },
    {
      type: 'p',
      text: `Before cutting any cost, ask who pays for the saving, which is the define step of my [Push and Absorb framework](/articles/push-and-absorb-framework). A cut that shifts cost onto suppliers or staff tends to come back later as higher prices or attrition.`,
    },
    {
      type: 'p',
      text: `The other half of my PwC work was an internal audit AI tool, written up in [AI in internal audit](/articles/ai-in-internal-audit).`,
    },
  ],
  faq: [
    {
      q: 'What is a delegation of authority matrix?',
      a: 'A table that sets, for each type of decision and each amount, who can approve it and who must be informed. Redesigning these matrices and the approval workflows around them cut decision turnaround by 30%+ on PwC India engagements.',
    },
    {
      q: 'Where do Indian companies usually lose margin?',
      a: 'In approval queues, purchases outside negotiated contracts, contracts renewed without repricing, reactive hiring, idle capacity between projects, and processes that run differently from their documentation.',
    },
    {
      q: 'How do you prioritise cost reduction opportunities?',
      a: 'Put an annual rupee estimate on every finding, with the working shown, then rank by size and ease. A recommendation with a number, an owner and a first step is far easier for leadership to approve.',
    },
  ],
};
