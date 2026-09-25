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
  excerpt: `The most useful thing I built at ZenCabs was a weekly meeting. How it was designed, from the metric tree to the agenda, and how these reviews usually fail.`,
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

export const citySizing: Article = {
  slug: 'sizing-cab-market-tier-2-city',
  title: 'Sizing the cab market in a tier-2 city before you launch in it',
  seoTitle: 'Bottom-Up Market Sizing: The Cab Market in Jammu',
  description:
    'A bottom-up market sizing for app-booked cabs in Jammu from public data: residents, airport passengers and Vaishno Devi pilgrims, with every assumption stated.',
  excerpt: `An expansion case starts with a number you can defend. A bottom-up model of cab demand in Jammu from public data, with every assumption written down and tested.`,
  category: 'Operating Playbook',
  keywords: [
    'market sizing example',
    'bottom-up market sizing',
    'TAM SAM SOM example India',
    'cab market size Jammu',
    'expansion case',
    'founder office case study',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `At ZenCabs the fleet grew by 10+ cars a month to 40, and every batch of cars had to be justified by a market sizing and an expansion case. That case used our own data. This is a rebuild of the method from public numbers only, so anyone can check it, and so the assumptions are visible enough to argue with.`,
    },
    {
      type: 'p',
      text: `The question: how many app-booked cab trips could Jammu support in a month? I build it from three pools of demand, give each a low, base and high case, and then compare the result with what ZenCabs actually did.`,
    },

    { type: 'h2', text: 'The public inputs' },
    {
      type: 'table',
      head: ['Input', 'Figure', 'Source'],
      rows: [
        ['Jammu city population', '5,02,197 (2011)', 'Census of India'],
        ['Jammu urban agglomeration', '6,57,314 (2011)', 'Census of India'],
        ['Jammu airport passengers', '1.61 million (2024-25)', 'Ministry of Civil Aviation, in the Lok Sabha'],
        ['Vaishno Devi pilgrims', '94.8 lakh (2024)', 'Shri Mata Vaishno Devi Shrine Board'],
      ],
    },
    {
      type: 'p',
      text: `The Census is fifteen years old, so the first assumption is growth. At about 1.4% a year the 2011 urban agglomeration becomes roughly 8 lakh people in 2026. I use 8 lakh throughout. It matters less than the behavioural assumptions that follow.`,
    },

    { type: 'h2', text: 'Pool one: residents' },
    {
      type: 'p',
      text: `Most residents will never book a cab through an app in a given month. They own a two-wheeler or a car, take an auto, or do not travel far. So the model starts from an addressable share: people with a smartphone, a reason to travel across the city and the income to pay a cab fare. My base case is 10% of 8 lakh, or 80,000 people, taking two app-booked trips a month each.`,
    },
    { type: 'p', text: `Base case: 80,000 people × 2 trips = 1,60,000 trips a month.` },

    { type: 'h2', text: 'Pool two: the airport' },
    {
      type: 'p',
      text: `The airport handled 1.61 million passengers in 2024-25, which counts arrivals and departures separately, so each passenger movement is one ground trip to or from the airport. That is about 1,34,000 a month. Many are collected by family or drive themselves; my base case is that 30% take a cab.`,
    },
    { type: 'p', text: `Base case: 1,34,000 × 30% = about 40,000 trips a month.` },

    { type: 'h2', text: 'Pool three: pilgrims' },
    {
      type: 'p',
      text: `94.8 lakh pilgrims visited the Vaishno Devi shrine in 2024, about 7.9 lakh a month, and Katra, the base town, is a road journey from Jammu. Many pilgrims take the train straight to Katra, travel by bus, or come in their own vehicles, so my base case is that 10% take a cab between Jammu and Katra. Pilgrims usually travel in groups, so I divide by an average of three people per cab.`,
    },
    { type: 'p', text: `Base case: 7.9 lakh × 10% ÷ 3 = about 26,000 trips a month.` },

    { type: 'h2', text: 'The total, and how wrong it could be' },
    {
      type: 'table',
      head: ['Pool', 'Low', 'Base', 'High'],
      rows: [
        ['Residents', '5% × 1 trip = 40,000', '10% × 2 trips = 1,60,000', '15% × 3 trips = 3,60,000'],
        ['Airport', '20% = 26,800', '30% = 40,250', '40% = 53,700'],
        ['Pilgrims', '5% ÷ 3 = 13,200', '10% ÷ 3 = 26,300', '15% ÷ 3 = 39,500'],
        ['Trips a month', 'about 80,000', 'about 2,27,000', 'about 4,53,000'],
      ],
      caption: 'Monthly trips. The shares and trip rates are my assumptions; the population, airport and pilgrim figures are public.',
    },
    {
      type: 'p',
      text: `The range is wide, more than five times from low to high, and almost all of the width comes from one line: how many residents book cabs and how often. The airport and pilgrim pools together are between 40,000 and 93,000 trips a month in every case. That tells me where to spend research effort. A week of surveying residents would narrow the estimate more than a year of refining the airport numbers.`,
    },

    { type: 'h2', text: 'Checking it against reality' },
    {
      type: 'p',
      text: `ZenCabs ran 7,500+ rides a month at a ₹331 average order value. That is about 3.3% of the base case, 9% of the low case and under 2% of the high case. Even on the pessimistic view, the service had reached a small share of the market, which is what justified adding cars.`,
    },
    {
      type: 'p',
      text: `Priced at ZenCabs' ₹331 average order value, the base case is about ₹7.5 Cr of fares a month, or roughly ₹90 Cr a year. That understates it, because a Jammu to Katra trip costs far more than a city ride.`,
    },

    { type: 'h2', text: 'From market size to a fleet plan' },
    {
      type: 'p',
      text: `A market size only becomes a decision when it turns into cars. At ZenCabs' actual rate of about 187 rides per car a month, serving 10% of the base case, about 22,700 trips, would need roughly 120 cars. That number is the useful output: it is a target the team can plan driver recruitment against.`,
    },
    {
      type: 'p',
      text: `The pace of adding cars should be set by utilisation. Each new batch is justified when the existing fleet is running near its target and cancellations from no car being available start to rise. If utilisation falls after a batch arrives, the next batch waits. That rule is a stop rule in the sense of my [Push and Absorb framework](/articles/push-and-absorb-framework): the condition for stopping is decided before the money is spent.`,
    },

    { type: 'h2', text: 'What would change the answer' },
    {
      type: 'ul',
      items: [
        'A resident survey. The resident pool drives most of the range, so this is the first thing to measure.',
        'Katra rail traffic. Direct trains reduce the pilgrims who pass through Jammu by road.',
        'A national aggregator arriving in force, which would split the market and raise driver costs.',
        'Seasonality. Pilgrim numbers rise sharply around festivals, so a monthly average hides peaks the fleet has to cover.',
      ],
    },
    {
      type: 'p',
      text: `The economics of each car in that fleet are in [the unit economics of an electric cab fleet](/articles/ev-cab-fleet-unit-economics-tier-2-india).`,
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[Census 2011: Jammu city population](https://www.census2011.co.in/census/city/3-jammu.html)',
        '[Census 2011: Jammu metropolitan region](https://www.census2011.co.in/census/metropolitan/2-jammu.html)',
        '[Kashmir Observer: Jammu airport records 1.61 million passengers in 2024-25](https://kashmirobserver.net/2025/08/07/jammu-airport-records-1-61-million-passengers-in-2024-25/)',
        '[Daily Excelsior: 9.5 million pilgrims visited the Vaishno Devi shrine in 2024](https://www.dailyexcelsior.com/9-5-million-pilgrims-visited-mata-vaishno-devi-shrine-in-2024/)',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you do a bottom-up market sizing?',
      a: 'Split demand into pools you can count from public data, apply an explicit assumption for the share of each pool that would buy and how often, and give each assumption a low, base and high case. Then check the result against any real sales you have, and find which assumption drives most of the range.',
    },
    {
      q: 'How big is the cab market in Jammu?',
      a: 'On public data and stated assumptions, between about 80,000 and 4.5 lakh app-booked trips a month, with a base case of about 2.27 lakh. At ZenCabs average order value the base case is about ₹7.5 Cr of fares a month.',
    },
    {
      q: 'How do you turn a market size into an expansion plan?',
      a: 'Convert trips into the fleet needed at a realistic rides-per-car rate, then pace additions by utilisation: add capacity when the current fleet is near its utilisation target, and pause when a new batch pulls utilisation down.',
    },
  ],
};

export const pricingPlaybook: Article = {
  slug: 'pricing-services-business-playbook',
  title: 'Pricing is the fastest lever in a services business, and the one founders avoid',
  seoTitle: 'Pricing Strategy for Services Businesses: A Playbook',
  description:
    "How pricing restructures moved conversion from 1.4% to 4% at a wedding business and tripled a magazine's monthly sales, and how to change prices safely.",
  excerpt: `Two pricing restructures, one wedding business and one magazine, moved more revenue than any campaign I have run. How to change prices without losing the customers you have.`,
  category: 'Operating Playbook',
  keywords: [
    'pricing strategy services business',
    'how to raise prices',
    'value based pricing',
    'pricing restructure',
    'conversion rate optimisation',
    'price testing',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `The two largest revenue moves I have been part of both started with pricing. At Shaadi Mangalam, a wedding services business, restructuring pricing and the sales process took conversion from 1.4% to 4% while monthly leads tripled to 3,000. Through Cairros, a pricing and sales restructure took a magazine client from ₹2L to ₹7L of sales a month over six months.`,
    },
    {
      type: 'p',
      text: `Founders are more reluctant to touch pricing than almost anything else, usually because they fear losing customers they already have. These are the patterns that made those changes work, and how to change a price without taking that risk blind.`,
    },

    { type: 'h2', text: 'Why pricing moves faster than anything else' },
    {
      type: 'p',
      text: `A price change reaches every sale at once. A marketing campaign reaches the people who see it, and a product change reaches the people who use that feature. In the language of my [Push and Absorb framework](/articles/push-and-absorb-framework), it is a change with a direct path: you set the price yourself and the number moves, with nobody else having to act first.`,
    },
    {
      type: 'p',
      text: `The magazine numbers show how fast that compounds. ₹2L to ₹7L is 3.5 times, and at the 23% monthly growth it ran at, six months of compounding comes to about 3.46 times. No single launch produced it; it came month by month from the new structure.`,
    },

    { type: 'h2', text: 'Pattern one: start the conversation from value' },
    {
      type: 'p',
      text: `At Shaadi Mangalam the sales conversation used to open with a discount, which told the family that the list price was not the real price. We restructured pricing so the conversation starts from what a family is getting, and the discount stops being the first move. A family comparing vendors is trying to reduce risk, and a clear account of what is included does that better than a lower number.`,
    },

    { type: 'h2', text: 'Pattern two: fix conversion before buying volume' },
    {
      type: 'p',
      text: `The brief at Shaadi Mangalam was more leads. At 1.4% conversion, tripling leads would have tripled the cost of the ones that never converted. Measured from lead to booking, the old rate turned roughly 1,000 monthly leads into about 14 bookings; the new one turns 3,000 into about 120. Volume and conversion each contributed close to a threefold gain, and pricing was where the conversion gain started.`,
    },

    { type: 'h2', text: 'Pattern three: price is part of a system' },
    {
      type: 'p',
      text: `At ZenCabs, GTM and pricing work together pushed monthly GMV past ₹25L across 7,500+ rides, and revenue per car reached ₹62.5K a month through utilisation, driver incentives and ride allocation. On a two-sided platform the price a rider pays and the incentive a driver earns have to be set together. Raising one without the other moves the problem to the other side of the market.`,
    },

    { type: 'h2', text: 'How to change a price without guessing' },
    {
      type: 'ol',
      items: [
        'Write the change down as one sentence: what moves and by how much, who is better off, who pays, and from when.',
        'Check the four places it can break: capacity, incentives, expectations and what competitors do in response.',
        'Test it where the exposure is bounded, in one segment, one channel or one time of day, before rolling it out.',
        'Watch an early number, such as bookings a day, where monthly revenue would tell you only after the fact.',
        'Write the stop rule before you start: the result that makes you reverse the change, and by when.',
      ],
    },
    {
      type: 'p',
      text: `Expectation is the channel people miss. A price rise is close to irreversible, and a discount that runs too long becomes the price people expect. The canteen example in the framework, raising the price only at the evening counter where the competition is closed, is the shape of a good first test.`,
    },

    { type: 'h2', text: 'Signs a business has a pricing problem' },
    {
      type: 'ul',
      items: [
        'Most sales close with a discount the salesperson offered without being asked.',
        'Prices are only shared on a call, so every enquiry needs a conversation to go anywhere.',
        'Conversion is low while demand is healthy.',
        'Prices have not changed in years while costs have.',
        'Customers compare the business on price because nothing else about the offer is clear.',
      ],
    },
    {
      type: 'p',
      text: `The same thinking applied to restaurants, where the menu is the price list, is in [Indian restaurants: where a 30% revenue lift comes from](/articles/indian-restaurant-economics).`,
    },
  ],
  faq: [
    {
      q: 'Why is pricing the fastest growth lever?',
      a: 'A price change reaches every sale at once, and the business controls it directly, with no customer, partner or team having to change behaviour first. That makes it faster than marketing or product changes, which reach only the people they touch.',
    },
    {
      q: 'How do you raise prices without losing customers?',
      a: 'Test the change where the exposure is bounded, such as one segment or one time of day, watch an early number like daily bookings, and write down in advance the result that would make you reverse it. Lead the sales conversation with what the customer gets.',
    },
    {
      q: 'Should you fix conversion or buy more leads first?',
      a: 'Fix conversion first. At 1.4% conversion, tripling leads triples the cost of leads that never convert. At Shaadi Mangalam, conversion moved from 1.4% to 4% while leads tripled, and the combination multiplied bookings roughly eight times.',
    },
  ],
};
