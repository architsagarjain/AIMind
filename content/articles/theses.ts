import type { Article } from '@/types';

/**
 * Investment theses: how Archit would evaluate and back businesses, argued
 * from what he has operated. House rules as in sectors.ts.
 */

export const tier2Thesis: Article = {
  slug: 'tier-2-india-investment-thesis',
  title: "Building for India beyond the metros: an operator's investment thesis",
  seoTitle: "Tier-2 India Investment Thesis: An Operator's View",
  description:
    'An investment thesis for tier-2 India from an operator: where demand is growing, why reliability beats price, why supply is the moat, and what would prove it wrong.',
  excerpt: `Outside the metros the competitor is usually a phone number and a relationship. What mobility in Jammu, wedding services and construction equipment taught me about building against that.`,
  category: 'Investment Thesis',
  keywords: [
    'tier 2 India investment thesis',
    'Bharat startups',
    'tier 2 cities consumer demand',
    'local services marketplace',
    'venture capital India thesis',
    'operator investor',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: `Much of my operating work has been in markets the large platforms underserve: an electric cab service in Jammu, a wedding services business, a construction equipment marketplace, and restaurants and a magazine through my agency Cairros. The businesses had little in common. The markets they sold into behaved alike, and this is my attempt to write that behaviour down as a thesis I would invest against.`,
    },

    { type: 'h2', text: 'Where the demand is coming from' },
    {
      type: 'p',
      text: `A report covered by The Week in February 2025 expects shoppers from tier-2 and tier-3 markets to drive a fourfold growth in Indian e-commerce by 2035. Redseer found that about 65% of users on Indian short-video platforms come from tier-2 cities and beyond. More of the new demand for consumer businesses is coming from smaller cities, and a lot of it is already online.`,
    },
    {
      type: 'p',
      text: `Demand being online does not mean supply is. The services people in these cities buy most, a ride, a wedding vendor, a machine for a site, are still delivered by small local operators who are found through a phone call. That mismatch is where I think the opportunity sits.`,
    },

    { type: 'h2', text: 'The incumbent is a relationship' },
    {
      type: 'p',
      text: `In Jammu the main competitor for ZenCabs was a driver's number saved in a rider's phone. In wedding services and construction equipment it is a vendor or an owner the family or the site manager already knows. These incumbents cost nothing to use and arrive with trust already built.`,
    },
    {
      type: 'p',
      text: `A new business has to beat them on something a relationship cannot promise, and in my experience that is reliability. A relationship is only as dependable as the one person behind it being free today. A service that turns up every time can win against one that turns up most of the time.`,
    },

    { type: 'h2', text: 'Reliability beats price' },
    {
      type: 'p',
      text: `The instinct in a price-sensitive market is to discount. At ZenCabs we chose to compete on reliability, because in a small market a ride that shows up is worth more than a cheaper one that might not. We cut cancellations from 40% to 6%, and 27% of users became monthly active riders.`,
    },
    {
      type: 'p',
      text: `Discounts also carry a cost that arrives later. My [Push and Absorb framework](/articles/push-and-absorb-framework) calls it the expectation channel: a festival discount becomes the price people expect all year, and it is the hardest change to take back.`,
    },

    { type: 'h2', text: 'Supply is the moat' },
    {
      type: 'p',
      text: `In each of these markets the constrained side was supply. At ZenCabs we built recruitment, training and incentives for driver partners from scratch before pushing for riders, and onboarded 43 of them. At Equip9 the owners listing machines needed a different message and funnel from the contractors renting them.`,
    },
    {
      type: 'p',
      text: `Supply built like this is slow and does not scale with ad spend. The slowness protects the business, because a competitor arriving later has to do the same local work again, city by city.`,
    },

    { type: 'h2', text: 'Trust travels by word of mouth' },
    {
      type: 'p',
      text: `In smaller cities and close communities, people ask each other before they try something new, so the quality of delivery becomes the main acquisition channel. At Shaadi Mangalam, where a family books once, referral is effectively the only repeat business there is. At Cairros, a reputation in one sector was what got me into the next, and the agency grew across four sectors that way.`,
    },

    { type: 'h2', text: 'What it means for unit economics' },
    {
      type: 'p',
      text: `Prices are lower outside the metros and so are many costs, but density is lower as well. Fewer customers per square kilometre means a cab drives further empty between rides and a vendor serves fewer customers a week. The businesses that work here tend to combine a high value per transaction with high use of an expensive asset. ZenCabs earns ₹62.5K per car per month at 75% utilisation, and long trips to the airport or to Katra raise the value of a single booking. I broke those numbers down in [the unit economics of an electric cab fleet](/articles/ev-cab-fleet-unit-economics-tier-2-india).`,
    },

    { type: 'h2', text: 'Where I would invest, and where I would be careful' },
    {
      type: 'p',
      text: `I would look for services with fragmented local supply and demand that is either frequent or high in value: mobility, home and repair services, equipment rental, weddings and events, and local logistics. The model that tends to work is an operator that organises supply and stands behind its quality. It is harder to build than a listings site, and for the same reason harder to copy.`,
    },
    {
      type: 'p',
      text: `I would be careful with models that depend on metro density, such as very fast delivery, where the economics rely on many orders from a small area. I would be equally careful with businesses that need large amounts of borrowed capital for assets. BluSmart, which ran an owned electric fleet and stopped operating in April 2025 after a SEBI order over the use of its loans, showed how much of that kind of business's risk sits in its financing.`,
    },
    {
      type: 'p',
      text: `The [wedding industry breakdown](/articles/indian-wedding-industry-breakdown) and [construction equipment breakdown](/articles/construction-equipment-rental-india) go deeper on two of these sectors.`,
    },

    { type: 'h2', text: 'What would prove this thesis wrong' },
    {
      type: 'ul',
      items: [
        'Large platforms reaching reliable supply in smaller cities at metro cost, which would remove the local operator\'s edge.',
        'Zero-commission subscriptions spreading so far that organised supply can no longer recruit drivers, vendors or owners.',
        'Retention in smaller cities staying low even when the service is reliable, which would mean trust matters less than I think.',
        'Lower density making utilisation impossible to raise past a ceiling that breaks the economics.',
      ],
    },
    {
      type: 'p',
      text: `Writing down what would change my mind before backing a thesis is the investing version of the stop rule in my framework. I would check this list against the numbers every six months.`,
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[The Week: Shoppers from tier 2 and 3 markets to drive fourfold growth in India\'s e-commerce by 2035 (February 2025)](https://www.theweek.in/news/biz-tech/2025/02/20/growing-shoppers-from-tier-2-3-markets-to-drive-a-four-times-growth-in-indias-ecommerce-market-by-2035-report.html)',
        '[Redseer: Indian short-form video platforms, with about 65% of users from tier 2 and beyond](https://redseer.com/media/fueled-by-250-mn-users-and-a-65-tier-2-user-base-indian-sfv-platforms-become-more-than-just-a-blip-on-the-advertising-radar-redseer-strategy-consultants/)',
        '[Business Standard: BluSmart halts cab bookings amid Gensol crisis (April 2025)](https://www.business-standard.com/industry/news/electric-ride-hailing-co-blusmart-halts-cab-bookings-amid-gensol-crisis-125041601190_1.html)',
      ],
    },
  ],
  faq: [
    {
      q: 'Why invest in tier-2 India?',
      a: 'More of the new demand for consumer businesses is coming from smaller cities, and much of it is already online, while the services people there buy are still delivered by small local operators found by phone. Businesses that organise that supply and deliver reliably can build a moat that is slow for competitors to copy.',
    },
    {
      q: 'What kind of startups work in tier-2 cities?',
      a: 'In my view, services with fragmented local supply and frequent or high-value demand, such as mobility, home services, equipment rental, weddings and local logistics, run by an operator that organises supply and stands behind quality.',
    },
    {
      q: 'What are the risks of building in tier-2 India?',
      a: 'Lower density limits utilisation, large platforms may eventually reach reliable local supply, and asset-heavy models carry financing risk, as the collapse of BluSmart in 2025 showed.',
    },
  ],
};

export const marketplaceMetrics: Article = {
  slug: 'marketplace-metrics-due-diligence',
  title: 'Marketplace metrics that flatter, and the ones I trust',
  seoTitle: 'Marketplace Due Diligence: Metrics That Flatter and Hold Up',
  description:
    'A marketplace due diligence guide from an operator: supply, utilisation, completion, cohort retention and unit economics, and the numbers most often dressed up.',
  excerpt: `Downloads, GMV and run-rate are the easiest marketplace numbers to inflate. The questions I would ask instead, learned from running growth on two marketplaces.`,
  category: 'Investment Thesis',
  keywords: [
    'marketplace due diligence',
    'marketplace metrics',
    'how to evaluate a marketplace startup',
    'two-sided marketplace',
    'cohort retention',
    'take rate',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: `Most marketplace pitches lead with demand: users, downloads, GMV. Those numbers are real, and they are also the easiest to buy. I have run strategy and growth at ZenCabs, an electric cab service in Jammu, and growth at Equip9, a construction equipment marketplace. These are the questions I care about, roughly in the order I would ask them.`,
    },

    { type: 'h2', text: 'Start with the side that is harder to get' },
    {
      type: 'p',
      text: `In most marketplaces one side is harder to recruit and keep, and for ride-hailing it is drivers. A rider who opens the app to no cars rarely opens it again, so money spent on demand before supply is ready is money wasted. At ZenCabs we onboarded 43 driver partners, with recruitment, training and incentives designed from scratch, before pushing for riders.`,
    },
    {
      type: 'ul',
      items: [
        'Which side is constrained today, and how do you know?',
        'What does it cost to add one unit of supply, and how long until it earns?',
        'What share of the supply active six months ago is still active?',
        'What happens to supply earnings if demand dips for a month?',
      ],
    },

    { type: 'h2', text: 'Utilisation, and what each unit of supply earns' },
    {
      type: 'p',
      text: `If the company owns or finances its supply, utilisation is the business. At ZenCabs, moving fleet utilisation from 40% to 75% took revenue per car to ₹62.5K a month, which no acquisition campaign could have matched with the same effort. I would ask for utilisation month by month, revenue per unit of supply, and whether adding supply lowers utilisation for everyone already on the platform.`,
    },

    { type: 'h2', text: 'Completion rate, the metric hiding in operations' },
    {
      type: 'p',
      text: `Cancellations and failed transactions look like an operations issue and behave like a retention issue. Every cancelled ride costs more than the acquisition that produced it, because the customer you paid for is now less likely to return. ZenCabs cut cancellations from 40% to 6% with 10+ operating procedures across onboarding and dispatch.`,
    },
    {
      type: 'p',
      text: `The useful questions are what share of requests end in a completed transaction, which side cancels more and why, and how retention differs between customers whose first order went well and those whose first order failed.`,
    },

    { type: 'h2', text: 'Repeat usage by cohort' },
    {
      type: 'p',
      text: `Total users is the least informative number in the deck. What matters is how many come back. At ZenCabs, 27% of the user base became 6,679 monthly active riders, and a founder's version of that number is the first thing I would ask for on demand. Monthly cohorts show more than a blended rate: whether usage flattens, declines or grows as each group ages.`,
    },

    { type: 'h2', text: 'Unit economics that survive the discounts ending' },
    {
      type: 'table',
      head: ['Metric', 'Why it matters', 'What to check'],
      rows: [
        ['GMV', 'Total value flowing through the platform', 'Whether growth comes from volume, price or subsidy'],
        ['Take rate', 'The share of GMV the company keeps', 'Whether it is stable, and what stops it being competed down'],
        ['Average order value', 'Revenue per transaction', 'Whether it is rising for real reasons or because of mix'],
        ['Contribution per transaction', 'What is left after direct costs and incentives', 'Whether it is positive without discounts'],
        ['Payback on acquisition', 'How fast a new customer repays their cost', 'Measured on retained customers, excluding one-time sign-ups'],
      ],
    },
    {
      type: 'p',
      text: `Take rates deserve extra scrutiny in categories where competitors are changing the model. Indian ride-hailing moved toward flat driver subscriptions in 2024 and 2025, which turns a percentage commission into a software fee. I cover that shift in [the unit economics of an electric cab fleet](/articles/ev-cab-fleet-unit-economics-tier-2-india).`,
    },

    { type: 'h2', text: 'The numbers most often dressed up' },
    {
      type: 'ul',
      items: [
        'Downloads and sign-ups presented as users.',
        'GMV that includes heavy discounts which will stop when the subsidy does.',
        'Supply counted when onboarded, including partners who have since stopped working.',
        'Blended retention that lets a strong early cohort hide a weak recent one.',
        'Annualised run-rate taken from one strong month.',
      ],
    },
    {
      type: 'p',
      text: `Run-rate is a fair measure of momentum when the month behind it is typical, so ask to see the months either side. ZenCabs' ₹3 Cr is a run-rate too, which is why on this site I show the monthly GMV of ₹25L+ and the 7,500+ rides behind it.`,
    },

    { type: 'h2', text: 'Who owns the supply, and who paid for it' },
    {
      type: 'p',
      text: `For any marketplace that owns or finances its supply, the balance sheet belongs in the diligence alongside the product. BluSmart ran an owned electric fleet in three cities and stopped taking bookings in April 2025 after SEBI alleged that ₹262 crore of loans raised for 6,400 vehicles had been diverted. Most of its cars were owned by a separate listed company run by the same founders. The questions to ask are who legally owns the assets, who lent against them, and on what terms.`,
    },

    { type: 'h2', text: 'How the team runs the business' },
    {
      type: 'p',
      text: `Finally, ask how the founders know what is happening. A team that reviews its main numbers every week, with owners and thresholds, finds problems in days. At ZenCabs a weekly KPI review with the founder was the most useful thing we built, and I describe it in [the weekly operating review](/articles/weekly-operating-review-kpi-cadence).`,
    },
    {
      type: 'p',
      text: `One more question tells me a lot: which slow, permanent change in the market worries you most? Founders who have thought about it answer at once. The phrase comes from the classify step of my [Push and Absorb framework](/articles/push-and-absorb-framework), where slow, permanent forces are the ones that do the most damage.`,
    },
  ],
  faq: [
    {
      q: 'What are the most important marketplace metrics?',
      a: 'The share of transactions that complete, active supply and its utilisation, repeat usage by monthly cohort, take rate, and contribution per transaction after incentives. Total users and headline GMV matter less than whether customers return and whether each transaction makes money without subsidy.',
    },
    {
      q: 'Why is supply usually the hard side of a marketplace?',
      a: 'Demand without supply is wasted, because a buyer who finds nothing available rarely comes back. Supply is often costlier to acquire and slower to start earning, so strong marketplaces secure the constrained side before scaling demand.',
    },
    {
      q: 'How do you spot inflated marketplace numbers?',
      a: 'Ask for active users and suppliers, GMV with and without discounts, retention by monthly cohort, and the months either side of any run-rate figure.',
    },
  ],
};

export const appliedAiThesis: Article = {
  slug: 'applied-ai-indian-businesses-thesis',
  title: "Where applied AI pays inside Indian businesses: an operator's thesis",
  seoTitle: 'Applied AI in Indian Businesses: An Investment Thesis',
  description:
    'An investment thesis on applied AI in India from three builds that moved real metrics: where AI pays, why adoption is the moat, and what would prove it wrong.',
  excerpt: `I have shipped three AI builds that moved an operating number: an audit tool, a content engine and the clone on this site. What they taught me about where applied AI earns money in India.`,
  category: 'Investment Thesis',
  keywords: [
    'applied AI India',
    'enterprise AI adoption India',
    'AI investment thesis',
    'AI agents workflow automation',
    'vertical AI',
    'AI in services businesses',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `I have built or co-built three AI systems that moved an operating number. At PwC India, an internal audit AI tool saved 10,000+ consulting hours across 200+ consultants and reached 50% adoption in six months. At Equip9, a content engine with AI workflow agents halved content production turnaround. And this site runs an AI clone of me that answers from my verified work, on free models with fallbacks, so it costs almost nothing to run. I have also built Nexus AI on Google AI Studio.`,
    },
    {
      type: 'p',
      text: `None of these is a frontier model. All of them are the same kind of product: a model placed inside a specific workflow, with a number that shows whether it worked. That is the category I think will produce most of the returns in Indian AI over the next few years.`,
    },

    { type: 'h2', text: 'Indian companies are adopting fast, and short of expertise' },
    {
      type: 'p',
      text: `Deloitte's 2026 State of AI in the Enterprise survey found that 40% of Indian respondents reported significant or full use of AI, against a global average of about 28%. At-scale deployment in India was strongest in product development (62%), strategy and operations (56%), marketing and sales (55%) and supply chain (48%). The same survey found Indian organisations lagging global peers on deep AI expertise.`,
    },
    {
      type: 'p',
      text: `Internal audit shows the same pattern from another angle. In a 2024 study by Wolters Kluwer and the Internal Audit Foundation, about half of audit leaders said their organisations were implementing generative AI, while about 26% of auditors were using it in their work. I cover that gap in [AI in internal audit](/articles/ai-in-internal-audit).`,
    },
    {
      type: 'p',
      text: `Put together, the demand is real and the ability to turn a model into a working process is scarce. The companies that supply that ability, as products or as services built into products, have the opening.`,
    },

    { type: 'h2', text: 'What my three builds had in common' },
    { type: 'h3', text: 'Each one replaced hours in one workflow' },
    {
      type: 'p',
      text: `The audit tool took over document-heavy steps in an engagement. The content engine took over production steps that had been done by hand for every audience segment. The clone answers the questions a recruiter would otherwise ask me one call at a time. Each had a single workflow and a number, hours saved or turnaround time, that could be measured before and after.`,
    },
    { type: 'h3', text: 'Adoption was harder than the model' },
    {
      type: 'p',
      text: `The PwC tool reached 50% adoption because we trained people inside 10 live pilot engagements, on their own client work. The model was the easier half. In most service businesses a tool that slows someone down in its first week gets dropped, so the product has to fit the job as people already do it.`,
    },
    { type: 'h3', text: 'Reliability decided whether people trusted it' },
    {
      type: 'p',
      text: `The clone on this site is held to one hard rule: it may only state figures that are in its knowledge base. Free models fail often, so it falls back from one to the next, cancels slow ones, and answers from pre-written responses if all of them fail. A visitor never sees an error page. Getting that right took far longer than getting a first answer out of a model, and it is what makes the product usable.`,
    },

    { type: 'h2', text: 'Where I think applied AI pays in India' },
    {
      type: 'ul',
      items: [
        'Professional services, where hours are the product: audit, tax, compliance, legal and consulting delivery.',
        'Marketing and sales operations, where content and outreach have to be produced for many segments at once.',
        'Operations in fragmented sectors, such as dispatch, scheduling and vendor coordination in mobility, logistics and construction.',
        'Customer support in Indian languages, where most volume is repetitive and most tools were built for English.',
      ],
    },
    {
      type: 'p',
      text: `The companies I would back sell a measurable outcome in one of these workflows, charge in a way tied to that outcome, and have a way of getting the tool adopted that does not depend on the customer figuring it out alone.`,
    },

    { type: 'h2', text: 'Questions I would ask an applied AI company' },
    {
      type: 'ul',
      items: [
        'Which workflow does it change, and how many hours or rupees per customer per month?',
        'What adoption do customers reach after six months, and what did the company do to get there?',
        'What happens when the model is wrong, and how does the user find out?',
        'How much of the product would survive a much better model becoming free next year?',
        'Who inside the customer owns the number the product moves?',
      ],
    },

    { type: 'h2', text: 'What would prove this thesis wrong' },
    {
      type: 'ul',
      items: [
        'General-purpose assistants becoming good enough inside existing software that a workflow product adds little.',
        'Indian customers, especially small businesses, refusing to pay enough for time saved to support a company.',
        'Adoption problems turning out to be temporary, which would remove the advantage of companies that solve them.',
      ],
    },
    {
      type: 'p',
      text: `I would check these against the market every six months, the same way I would check a stop rule in my [Push and Absorb framework](/articles/push-and-absorb-framework).`,
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[Deloitte India: Indian enterprises lead global peers in at-scale AI adoption](https://www.deloitte.com/in/en/about/press-room/indian-enterprises-lead-global-peers-in-at-scale-ai-adoption-across-most-functions.html)',
        '[Deloitte India: State of AI in the Enterprise, 2026](https://www.deloitte.com/in/en/issues/generative-ai/state-of-ai-in-enterprise.html)',
        '[The Accountant: Wolters Kluwer and IIA report on generative AI in internal audit](https://www.theaccountant-online.com/news/wolters-kluwer-iia-report/)',
      ],
    },
  ],
  faq: [
    {
      q: 'How widely is AI used in Indian companies?',
      a: "In Deloitte's 2026 State of AI in the Enterprise survey, 40% of Indian respondents reported significant or full AI use, against about 28% globally. Deployment at scale was strongest in product development, strategy and operations, marketing and sales, and supply chain.",
    },
    {
      q: 'Where does applied AI create the most value?',
      a: 'In specific workflows where hours are the cost, such as professional services, marketing and sales operations, and coordination work in fragmented sectors, and where the product can show the hours or rupees it saves.',
    },
    {
      q: 'What is the hardest part of deploying AI in a business?',
      a: 'Adoption. At PwC India, an internal audit AI tool reached 50% adoption in six months because people were trained on it inside live client engagements. A tool that slows people down in its first week tends to be dropped.',
    },
  ],
};

export const vcFunding2025: Article = {
  slug: 'indian-startup-funding-2025',
  title: 'Where Indian venture money went in 2025, and what it says',
  seoTitle: 'Indian Startup Funding 2025: What the Data Says',
  description:
    'Indian tech raised $10.5B in 2025, down 17%, while early-stage funding rose and late-stage fell. What the Tracxn data says about where investors see returns.',
  excerpt: `Indian tech startups raised $10.5 billion in 2025, 17% less than in 2024. Early-stage money grew while late-stage money shrank by a quarter. Read closely, the year says a lot about what investors now pay for.`,
  category: 'Investment Thesis',
  keywords: [
    'Indian startup funding 2025',
    'India venture capital 2025',
    'Tracxn India tech report',
    'early stage funding India',
    'AI funding India',
    'startup IPOs India',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `Funding totals get reported as a single headline every year, and the headline usually hides the interesting part. Tracxn's annual report on Indian tech is detailed enough to read past it, so these are the figures I think matter and what I take from them as an operator who wants to back companies.`,
    },

    { type: 'h2', text: 'The year in numbers' },
    {
      type: 'table',
      head: ['Measure', '2025', 'Change on 2024'],
      rows: [
        ['Total raised by Indian tech', '$10.5 billion', 'Down 17% from $12.7 billion'],
        ['Early-stage funding', '$3.9 billion', 'Up 7% from $3.7 billion'],
        ['Late-stage funding', '$5.5 billion', 'Down 26% from $7.5 billion'],
        ['Enterprise applications', '$2.6 billion', 'Down 17% from $3.2 billion'],
        ['Fintech', '$2.4 billion', 'Up 2% from $2.3 billion'],
        ['AI', 'About $1.22 billion', 'Up about 58%'],
        ['IPOs', '42', ''],
        ['Acquisitions', '136', ''],
        ['New unicorns', '5', ''],
      ],
      caption: 'Tracxn, India Tech Annual Funding Report 2025. India remained the third most funded tech ecosystem, behind the US and the UK.',
    },
    {
      type: 'p',
      text: `Subtracting early and late stage from the total leaves about $1.1 billion for seed. The whole decline, and more, came from late stage: it fell by about $2 billion while early stage grew.`,
    },

    { type: 'h2', text: 'What I take from it' },
    { type: 'h3', text: 'Investors are paying for proof earlier' },
    {
      type: 'p',
      text: `Early-stage funding rising while late-stage funding falls says investors still want to back new companies and are less willing to pay large late-stage prices for growth without profits. Forty-two IPOs in one year also means the public market has become a real exit, and public investors look at margins. A company raising a Series A in this market has to show the path to unit economics that a later investor, or a public one, will eventually demand.`,
    },
    { type: 'h3', text: 'Fintech held steady and AI grew from a small base' },
    {
      type: 'p',
      text: `Fintech was flat at about $2.4 billion, which for a mature category counts as resilience. AI grew fastest, by about 58%, but at around $1.22 billion it was still a small share of the total. I read that as the market funding applied AI in Indian businesses cautiously, which fits the gap between adoption and expertise I wrote about in [where applied AI pays inside Indian businesses](/articles/applied-ai-indian-businesses-thesis).`,
    },
    { type: 'h3', text: 'Enterprise software cooled' },
    {
      type: 'p',
      text: `Enterprise applications fell 17% and were still the largest single sector at $2.6 billion. Software that sells to businesses remains where the most money goes, and the fall suggests buyers and investors both want clearer proof of the hours or rupees a product saves.`,
    },

    { type: 'h2', text: 'What it means for founders and operators' },
    {
      type: 'ul',
      items: [
        'Unit economics now matter at the early stage, because the later rounds that used to cover losses are smaller.',
        'A credible path to an IPO or acquisition is part of the pitch, since both were active exits in 2025.',
        'Capital-heavy models, such as owned fleets, need their financing thought through before growth, as BluSmart showed.',
        'Businesses with fragmented supply and reliable delivery, the kind I describe in [my thesis on India beyond the metros](/articles/tier-2-india-investment-thesis), can raise early money on operating proof.',
      ],
    },

    { type: 'h2', text: 'What would change my reading' },
    {
      type: 'p',
      text: `If late-stage funding recovers sharply in 2026 without a matching improvement in the profitability of the companies raising it, then 2025 was a pause and not a change in what investors pay for. If the IPO window narrows, early-stage investors will need other exits, and seed and Series A would likely tighten next. I would check both against the next annual report, the way my [Push and Absorb framework](/articles/push-and-absorb-framework) suggests checking any assumption: decide in advance what evidence would change your mind.`,
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[Tracxn: India Tech Annual Funding Report 2025](https://tracxn.com/d/insights/market-reports/india-tech-annual-funding-report-2025/__pvsyFahv-Ilo6lB2JbwcePNNWOdgWGMsVyntzEVDIn0)',
        '[Tracxn: India Tech raises $10.5B in 2025, ranks third most funded ecosystem](https://w.tracxn.com/report-releases/india-tech-annual-funding-report-2025)',
        '[Tracxn: India FinTech Annual Funding Report 2025](https://tracxn.com/d/insights/market-reports/india-fintech-annual-funding-report-2025/__KI88fIIv3fr5S2VBcl2e1wyQJn6Vtcx04wbRitnU33o)',
      ],
    },
  ],
  faq: [
    {
      q: 'How much did Indian startups raise in 2025?',
      a: 'Indian tech startups raised $10.5 billion in 2025 according to Tracxn, down 17% from $12.7 billion in 2024. India remained the third most funded tech ecosystem after the US and UK.',
    },
    {
      q: 'Did early-stage funding fall in India in 2025?',
      a: 'No. Early-stage funding rose 7% to $3.9 billion, while late-stage funding fell 26% to $5.5 billion. The overall decline came from late-stage rounds.',
    },
    {
      q: 'Which sectors got the most funding in India in 2025?',
      a: 'Enterprise applications raised about $2.6 billion and fintech about $2.4 billion. AI funding grew fastest, by about 58%, to around $1.22 billion.',
    },
  ],
};

export const openNetworks: Article = {
  slug: 'open-networks-mobility-namma-yatri',
  title: 'Open networks worked first in mobility. Namma Yatri shows why',
  seoTitle: 'ONDC and Namma Yatri: Open Networks in Mobility',
  description:
    'Namma Yatri passed 100 million zero-commission rides while ONDC retail shrank as subsidies ended. Why open networks took hold in mobility first, and what follows.',
  excerpt: `Namma Yatri passed 100 million rides and ₹1,600 crore in driver earnings without taking a commission. On ONDC, mobility grew while retail shrank as subsidies ended. The difference says a lot about where open networks can win.`,
  category: 'Investment Thesis',
  keywords: [
    'ONDC mobility',
    'Namma Yatri',
    'zero commission ride hailing',
    'open network digital commerce',
    'Beckn protocol',
    'ride hailing India',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `Running strategy and growth for a cab service in Jammu means I pay close attention to how the national players price their drivers. The biggest change of the last two years did not come from Uber or Ola. It came from an open-network app in Bengaluru that refused to take a commission, and the rest of the industry followed.`,
    },

    { type: 'h2', text: 'The numbers' },
    {
      type: 'p',
      text: `Namma Yatri, which runs on India's Open Network for Digital Commerce (ONDC) with open data and open-source code, passed 100 million rides in 2025 and says it enabled more than ₹1,600 crore of earnings for over 6 lakh drivers. Bengaluru accounted for nearly 85 million of those trips and Kolkata about 10 million. It launched zero-commission cabs in Bengaluru in April 2024, after starting with autos.`,
    },
    {
      type: 'p',
      text: `On the wider network, mobility and retail went in opposite directions. ONDC logged 8.1 million mobility transactions in February 2025, up 47% from 5.5 million in October 2024. Retail orders peaked at 6.5 million in October 2024 and fell to 4.6 million by February 2025 as the network capped the incentives it paid sellers and buyers.`,
    },
    {
      type: 'table',
      head: ['Derived figure', 'Working', 'Result'],
      rows: [
        ['Driver earnings per ride', '₹1,600 crore ÷ 100 million rides', 'About ₹160'],
        ["Bengaluru's share of rides", '85 million ÷ 100 million', 'About 85%'],
        ['ONDC mobility growth in four months', '8.1 million against 5.5 million', 'Up 47%'],
        ['ONDC retail change over the same period', '4.6 million against 6.5 million', 'Down about 29%'],
      ],
      caption: 'My arithmetic on the reported figures.',
    },

    { type: 'h2', text: 'Why mobility worked when retail struggled' },
    {
      type: 'p',
      text: `A ride is a simple, repeatable transaction with two parties and a price that both can see. The driver gains the most from removing the commission, so supply has a reason to join the network without a subsidy. Retail on an open network needs catalogues, inventory, payments, returns and delivery to work across many independent apps, and much of the early usage was paid for by incentives. When the incentives were capped, retail orders fell and mobility kept growing.`,
    },
    {
      type: 'p',
      text: `The concentration is the caveat. With about 85% of Namma Yatri's rides in Bengaluru, the model is proven in one city with a strong local community of drivers, and the question for anyone investing is how well it travels.`,
    },

    { type: 'h2', text: 'What it did to the incumbents' },
    {
      type: 'p',
      text: `Rapido moved drivers to flat subscriptions from December 2023, Uber followed for autos in February 2025, saying it wanted to avoid a competitive disadvantage, and Ola rolled out a national version in June 2025. A zero-commission open network changed what drivers expect to keep, and the commission-based platforms adapted. I run that change through my framework, from each party's chair, in [the zero-commission shift, seen from every chair](/articles/zero-commission-shift-push-and-absorb).`,
    },

    { type: 'h2', text: 'The thesis' },
    {
      type: 'p',
      text: `Open networks win first where the supply side gains the most from removing the platform's cut and the transaction is simple enough to run across apps without subsidy. That points to mobility, local services and some kinds of logistics before complex retail. For investors, the value moves away from the commission and toward what sits around the transaction: driver financing, vehicle leasing, insurance, fleet software and reliability that an open network does not guarantee on its own.`,
    },
    {
      type: 'p',
      text: `That last point matters for any operator. An open network can make a ride cheaper to book. It cannot make a car turn up. The businesses that organise reliable supply on top of open rails, the kind I describe in [my thesis on building beyond the metros](/articles/tier-2-india-investment-thesis), should still have room to earn.`,
    },

    { type: 'h2', text: 'What would prove this wrong' },
    {
      type: 'ul',
      items: [
        "Namma Yatri failing to grow outside Bengaluru, which would mean the model depends on one city's driver community.",
        'Open-network mobility volumes falling once any remaining incentives end.',
        'Commission-based platforms winning drivers back with guaranteed earnings that an open network cannot match.',
      ],
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[Business Standard: Namma Yatri hits 100 million rides, enables ₹1,600 crore of driver earnings](https://www.business-standard.com/companies/news/namma-yatri-hits-100-million-rides-enables-1-600-cr-driver-earnings-125060600641_1.html)',
        '[Business Standard: Namma Yatri launches a zero-commission cab service in Bengaluru (April 2024)](https://www.business-standard.com/technology/apps/namma-yatri-launches-zero-commission-cab-service-in-bengaluru-124041601064_1.html)',
        '[Business Standard: Retail growth slows on ONDC as the platform caps incentives (March 2025)](https://www.business-standard.com/companies/news/ondc-retail-decline-incentive-cuts-service-fee-growth-mobility-logistics-125032700419_1.html)',
        '[Inc42: Uber follows Rapido with a zero-commission model for auto drivers](https://inc42.com/buzz/exclusive-uber-follows-rapido-rolls-out-zero-commission-model-for-auto-drivers/)',
      ],
    },
  ],
  faq: [
    {
      q: 'What is Namma Yatri?',
      a: "A zero-commission ride-hailing app that runs on India's Open Network for Digital Commerce with open data and open-source code. It passed 100 million rides in 2025, most of them in Bengaluru, and says it enabled over ₹1,600 crore of earnings for more than 6 lakh drivers.",
    },
    {
      q: 'How is ONDC doing in mobility compared with retail?',
      a: 'ONDC mobility transactions grew 47% to 8.1 million between October 2024 and February 2025, while retail orders fell from 6.5 million to 4.6 million as the network capped incentives.',
    },
    {
      q: 'Why did open networks work in mobility first?',
      a: 'A ride is a simple transaction between two parties, and drivers gain the most from removing the commission, so supply joins without a subsidy. Retail needs catalogues, inventory, payments and returns to work across apps, and much of its early use depended on incentives.',
    },
  ],
};
