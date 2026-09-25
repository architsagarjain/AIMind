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
