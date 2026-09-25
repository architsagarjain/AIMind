import type { Article } from '@/types';

/**
 * Sector breakdowns: how an industry works, told from inside a business in it.
 *
 * House rules for everything in content/articles (see README):
 * - Figures about Archit's own work come only from content/projects.ts and
 *   content/resume.ts, the same verified source the AI clone reads.
 * - Figures about an industry carry a linked source in the article's
 *   Sources section. Derived numbers show their working.
 * - No dashes, no not-X-but-Y contrasts, no one-line closers, no bold labels.
 */

export const evCabEconomics: Article = {
  slug: 'ev-cab-fleet-unit-economics-tier-2-india',
  title: 'Electric cabs in a tier-2 city: the unit economics from inside one',
  seoTitle: 'EV Cab Fleet Unit Economics in Tier-2 India',
  description:
    'Electric cab fleet economics in a tier-2 Indian city from ZenCabs operating numbers, plus what BluSmart and zero-commission apps changed for the sector.',
  excerpt: `Forty cars, 7,500 rides a month and a ₹3 Cr run-rate. How an owned electric fleet makes money in Jammu, and what the last two years of Indian ride-hailing mean for the model.`,
  category: 'Sector Breakdown',
  keywords: [
    'EV cab unit economics',
    'electric taxi fleet India',
    'ride-hailing tier 2 cities',
    'fleet utilisation',
    'BluSmart',
    'zero commission ride hailing',
    'ZenCabs',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: `Since January I have run strategy and growth at ZenCabs, an electric cab service in Jammu. Jammu was never a priority city for the national aggregators, so riders booked cabs over the phone and argued about fares, and drivers had no dependable flow of work. ZenCabs was built to fill that gap.`,
    },
    {
      type: 'p',
      text: `This piece walks through how the model works in numbers. Everything about ZenCabs comes from our own reporting. Everything about the wider sector is linked to its source at the end.`,
    },

    { type: 'h2', text: 'The operating numbers' },
    {
      type: 'table',
      head: ['Metric', 'Where it stands'],
      rows: [
        ['Users after four months', '25,000+'],
        ['Monthly active riders', '6,679, which is 27% of users'],
        ['Rides per month', '7,500+'],
        ['Average order value', '₹331'],
        ['Monthly GMV', '₹25L+'],
        ['Fleet', '40 cars, added at 10+ a month'],
        ['Revenue per car', '₹62.5K a month'],
        ['Fleet utilisation', 'From 40% to 75%'],
        ['Ride cancellations', 'From 40% to 6%'],
        ['Annualised run-rate', '₹3 Cr'],
      ],
    },
    {
      type: 'p',
      text: `The figures reconcile, which is the first thing I would check in anyone else's deck. Forty cars at ₹62.5K each comes to ₹25L a month, the same as monthly GMV, so revenue per car here means the gross value of the rides that car carried. ₹25L a month annualises to the ₹3 Cr run-rate, and 7,500 rides at ₹331 comes to about ₹24.8L.`,
    },
    {
      type: 'p',
      text: `Per car, 7,500 rides across 40 cars is roughly 187 rides a month. That is about six rides a day, worth a little over ₹2,000 in fares.`,
    },

    { type: 'h2', text: 'Utilisation decides everything else' },
    {
      type: 'p',
      text: `An owned fleet has costs that barely change with how much the cars move. Financing, insurance, parking and upkeep arrive every month. Revenue only arrives when a car is carrying someone. The distance between those two lines depends on the share of the day each car spends earning.`,
    },
    {
      type: 'p',
      text: `When utilisation rose from 40% to 75%, the same 40 cars could earn close to twice as much, because 75 is nearly 1.9 times 40. I could not have bought that with a marketing budget. With supply already stretched, more riders at 40% utilisation would only have produced more requests with no car to send.`,
    },
    {
      type: 'p',
      text: `So utilisation became the top number, with everything else underneath it: driver hours on the road, requests by hour and area, completed rides and the empty time between trips. We tracked 15+ KPIs in a weekly review with the founder, and every discussion had to connect back to utilisation. I have written up [how that weekly review ran](/articles/weekly-operating-review-kpi-cadence) separately.`,
    },

    { type: 'h2', text: 'Why cancellations came before growth' },
    {
      type: 'p',
      text: `At a 40% cancellation rate, four in every ten people who asked for a cab did not get one. In a city where the fallback is a phone call to a driver you already know, a rider let down twice goes back to making that call.`,
    },
    {
      type: 'p',
      text: `We brought cancellations down to 6% with 10+ standard operating procedures across driver onboarding and dispatch, checked every week in the review. Retention followed. 27% of users became monthly active riders, 6,679 people who now use the service as a habit.`,
    },

    { type: 'h2', text: 'Supply comes first, and it is slow to build' },
    {
      type: 'p',
      text: `In a city with no good alternative, riders are cheap to find and drivers are hard to find. We designed recruitment, training and incentives for driver partners from scratch and onboarded 43 of them, while the fleet grew by 10+ cars a month to 40, backed by a market sizing and expansion case for the city.`,
    },
    {
      type: 'p',
      text: `Every car that arrives before there are drivers to run it pulls utilisation down. Any expansion plan in this model has to be paced by the supply of trained drivers, whatever demand looks like.`,
    },

    { type: 'h2', text: 'What the rest of Indian ride-hailing changed' },
    {
      type: 'p',
      text: `Two things happened in the sector between 2023 and 2025 that anyone building or backing a fleet now has to price in.`,
    },
    { type: 'h3', text: 'Commission is turning into a subscription' },
    {
      type: 'p',
      text: `Rapido moved its cab drivers to a zero-commission subscription in December 2023 and extended it to autos in February 2024, charging a flat daily fee in place of a cut of each fare. Uber followed for autos in February 2025 and said it did so to avoid being at a competitive disadvantage. Ola launched a pan-India version in June 2025, with passes at ₹67 a day covering autos, bikes and cabs.`,
    },
    {
      type: 'p',
      text: `An aggregator now lets a driver keep close to the whole fare, and an owned fleet recruits from the same pool of drivers. What a fleet can offer in return is a car the driver does not have to buy and a steady flow of bookings, and the second only holds while utilisation stays high. The subscription shift raised the bar that an owned fleet's driver economics have to clear.`,
    },
    { type: 'h3', text: 'BluSmart showed that a fleet is also a financing structure' },
    {
      type: 'p',
      text: `BluSmart was India's first all-electric ride-hailing platform and ran its own fleet in Delhi-NCR, Mumbai and Bengaluru. It stopped taking bookings in April 2025 after SEBI's interim order of 15 April alleged that its founders had diverted ₹262 crore of loans raised to buy 6,400 electric vehicles. Most of BluSmart's cars were owned by Gensol Engineering, a listed company run by the same founders, and BluSmart later filed for insolvency.`,
    },
    {
      type: 'p',
      text: `SEBI's allegations were about the use of borrowed money, and they took down a working transport service with them. The broader point for the sector is that an owned electric fleet is a financing structure as much as a mobility business. The cars are bought with debt, utilisation services the debt, and whoever owns the vehicles controls the company. Diligence on a fleet business has to cover the lenders and the legal owner of every car, alongside the ride metrics.`,
    },

    { type: 'h2', text: 'How a tier-2 city behaves differently' },
    {
      type: 'p',
      text: `Jammu is small next to Delhi or Bengaluru, and size cuts both ways. There are fewer competitors and a real gap to fill, which is why reliability wins over price here: a cab that turns up is worth more to a rider than a discount on one that might not. A smaller city also has fewer rides per square kilometre, so cars spend longer driving empty between trips, and utilisation has to be won through dispatch and demand planning.`,
    },
    {
      type: 'p',
      text: `The region shapes demand too. ZenCabs offers airport transfers and trips to Katra, the base town for the Vaishno Devi pilgrimage, alongside city rides. A long trip like that raises the value of a single booking and takes a car out of the city for hours, which the dispatch plan has to allow for.`,
    },

    { type: 'h2', text: 'What I would ask any fleet operator' },
    {
      type: 'ul',
      items: [
        'Utilisation by hour of the day, and how it has moved month on month.',
        'Revenue per car against the monthly cost of financing that car.',
        'Cancellations split by cause: no car nearby, driver declined, rider cancelled.',
        'The share of rides that come from repeat riders.',
        'How many drivers are still active 90 days after onboarding.',
        'Who legally owns the vehicles, and on what terms.',
      ],
    },
    {
      type: 'p',
      text: `The same lens works on marketplaces generally. I wrote a longer list of [the metrics I trust and the ones that flatter](/articles/marketplace-metrics-due-diligence) for anyone evaluating one.`,
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[Business Standard: BluSmart halts cab bookings amid Gensol crisis (April 2025)](https://www.business-standard.com/industry/news/electric-ride-hailing-co-blusmart-halts-cab-bookings-amid-gensol-crisis-125041601190_1.html)',
        '[YourStory: BluSmart files for insolvency (July 2025)](https://yourstory.com/2025/07/blusmart-insolvency-corporate-governance-challenges-nclt-gensol)',
        '[Wikipedia: BluSmart](https://en.wikipedia.org/wiki/BluSmart)',
        '[Inc42: Uber follows Rapido with a zero-commission model for auto drivers](https://inc42.com/buzz/exclusive-uber-follows-rapido-rolls-out-zero-commission-model-for-auto-drivers/)',
        '[YourStory: Ola rolls out zero-commission rides pan-India (June 2025)](https://yourstory.com/2025/06/ola-rolls-0-commission-rides-pan-india-rapido-uber)',
        '[ZenCabs](https://zencabs.in/)',
      ],
    },
  ],
  faq: [
    {
      q: 'How does an electric cab fleet make money in India?',
      a: 'An owned fleet earns the fare from each ride and carries the fixed costs of its cars, such as financing, insurance, parking and upkeep. Profit depends on utilisation, the share of time each car spends carrying riders. At ZenCabs, raising utilisation from 40% to 75% took revenue per car to ₹62.5K a month.',
    },
    {
      q: 'What happened to BluSmart?',
      a: 'BluSmart stopped taking bookings in April 2025 after a SEBI interim order alleged that its founders diverted ₹262 crore of loans meant for 6,400 electric vehicles. Most of its cars were owned by Gensol Engineering, which the same founders ran. BluSmart later filed for insolvency.',
    },
    {
      q: 'What is the zero-commission model in ride-hailing?',
      a: 'Drivers pay the platform a flat daily or monthly subscription and keep the fare, where before they paid a percentage of each ride. Rapido introduced it for cabs in December 2023, Uber adopted it for autos in February 2025, and Ola rolled it out nationally in June 2025.',
    },
  ],
};

export const weddingIndustry: Article = {
  slug: 'indian-wedding-industry-breakdown',
  title: 'The Indian wedding economy: enormous spend, one-time buyers and leaky funnels',
  seoTitle: 'Indian Wedding Industry Breakdown: Size, Segments, Funnels',
  description:
    "A breakdown of India's wedding services market: its size, how spending splits by budget, why it resists repeat business, and what makes a wedding funnel convert.",
  excerpt: `India spends around ₹6 lakh crore on weddings in a single season, and almost none of those customers will buy again. That one fact explains why most wedding businesses get growth wrong.`,
  category: 'Sector Breakdown',
  keywords: [
    'Indian wedding industry',
    'wedding market size India',
    'wedding services business',
    'CAIT wedding season',
    'wedding lead conversion',
    'Shaadi Mangalam',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: `Since April I have been a growth and business strategy consultant for Shaadi Mangalam, a wedding services business. We restructured pricing and the sales process, redesigned the website and shipped more than 100 process and product fixes in sprints. Monthly leads tripled to 3,000 and conversion rose from 1.4% to 4%.`,
    },
    {
      type: 'p',
      text: `Working inside the category changed how I read it. This is the market as the public numbers describe it, and the structural facts that should decide how a wedding business grows.`,
    },

    { type: 'h2', text: 'How big the market is' },
    {
      type: 'p',
      text: `The Confederation of All India Traders (CAIT) estimates that the 2025 wedding season will see about 46 lakh weddings and ₹6.5 lakh crore of spending. Its estimate for the 2024 season was 48 lakh weddings and close to ₹6 lakh crore, up 41% on the ₹4.25 lakh crore it recorded for 35 lakh weddings in 2023. A Jefferies report put the Indian wedding industry at about $130 billion a year, second only to food and grocery among consumption categories.`,
    },
    {
      type: 'p',
      text: `These are estimates from a trade body and a broker, built on spending surveys, and the season totals rise and fall with the number of auspicious dates in the calendar. They are still the best public view of scale, and they agree on its shape: very large and very seasonal.`,
    },

    { type: 'h2', text: 'Where the money sits' },
    {
      type: 'p',
      text: `CAIT's 2024 estimate also split weddings by budget. For anyone building a business, that split says more than the headline.`,
    },
    {
      type: 'table',
      head: ['Spend per wedding', 'Weddings (2024 estimate)', 'Implied spend'],
      rows: [
        ['₹3 lakh', '10 lakh', '₹30,000 crore'],
        ['₹6 lakh', '10 lakh', '₹60,000 crore'],
        ['₹10 lakh', '10 lakh', '₹1 lakh crore'],
        ['₹15 lakh', '10 lakh', '₹1.5 lakh crore'],
        ['₹25 lakh', '7 lakh', '₹1.75 lakh crore'],
        ['₹50 lakh', '50,000', '₹25,000 crore'],
        ['₹1 crore or more', '50,000', '₹50,000 crore or more'],
      ],
      caption: 'Wedding counts and budgets from CAIT. The implied spend column is my multiplication; it totals about ₹5.9 lakh crore, consistent with the headline estimate.',
    },
    {
      type: 'p',
      text: `Weddings of ₹15 lakh or less are 40 of the 48 lakh, about 83% of the count, and carry roughly ₹3.4 lakh crore, or 58% of the spend. The 7 lakh weddings at ₹25 lakh add about 30%. The top one lakh weddings, at ₹50 lakh and above, are 2% of the count and at least 13% of the money.`,
    },
    {
      type: 'p',
      text: `That makes the category two markets sharing a name. The mass middle is most of the volume and over half the money, bought by families comparing prices across many local vendors. The premium end is a small number of weddings with planners, destination venues and large budgets. A business that tries to serve both with one brand, one price list and one sales script tends to convert neither well.`,
    },

    { type: 'h2', text: 'What makes the category hard' },
    { type: 'h3', text: 'Customers almost never come back' },
    {
      type: 'p',
      text: `Most families buy wedding services once per child. There is no repeat purchase to spread acquisition cost over, so the economics of a lead have to work on the first sale. The repeat business that exists comes through referral, when a family that had a good wedding recommends the vendor to the next one. Referral is the only retention a wedding business really has, which makes the quality of delivery part of the acquisition strategy.`,
    },
    { type: 'h3', text: 'Demand arrives in waves' },
    {
      type: 'p',
      text: `Spending bunches around auspicious dates, and CAIT counted 18 of them in Delhi's 2024 season. Enquiries spike in the weeks before those windows and thin out between them, so sales capacity that is right in one month is wrong in the next. Lead handling has to be planned against the calendar, with the fastest response in the run-up to peak dates, because a family that does not hear back books someone else.`,
    },
    { type: 'h3', text: 'Trust decides the sale' },
    {
      type: 'p',
      text: `The purchase is large, emotional and very public, and the buyer is often a family committee. Reviews, photographs of past work and a clear price range all lower the risk the family feels. Hidden pricing raises it: when a price is only revealed on a call, the call has to rebuild trust from nothing before it can sell.`,
    },

    { type: 'h2', text: 'What changed the numbers at Shaadi Mangalam' },
    {
      type: 'p',
      text: `The brief I was handed was more leads. The funnel converted 1.4% of them, so tripling volume at that rate would have tripled the waste as well. We worked on conversion and volume together.`,
    },
    {
      type: 'p',
      text: `Pricing came first. We restructured it so the sales conversation starts from the value a family is getting, and a discount is no longer the opening move. Then the website, which we ran as a product with a backlog. We shipped more than 100 fixes across sprints and measured each one.`,
    },
    {
      type: 'p',
      text: `Monthly leads reached 3,000 and conversion reached 4%. Measured from lead to booking, that is about 120 conversions a month, against roughly 14 from the thousand or so monthly leads at the old rate. The business closes around eight times as many customers a month from one funnel.`,
    },

    { type: 'h2', text: 'What I would look for in a wedding services company' },
    {
      type: 'ul',
      items: [
        'Conversion from lead to booking, split by budget band.',
        'Response time to a new enquiry during peak weeks.',
        'The share of bookings that arrive through referral.',
        'Revenue by month, to see how deep the off-season falls.',
        'Whether prices are published or only given on a call.',
      ],
    },
    {
      type: 'p',
      text: `The pattern of a big, fragmented, trust-driven market outside the metros shows up in other sectors too. I have written about it as [an investment thesis for tier-2 India](/articles/tier-2-india-investment-thesis).`,
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[CAIT: Wedding season 2025 to generate ₹6.5 lakh crore from 46 lakh weddings](https://cait.in/wedding-season-2025-to-generate-%E2%82%B96-5-lakh-crore-business-from-46-lakh-weddings-across-india-cait-delhi-alone-to-witness-%E2%82%B91-8-lakh-crore-trade-from-4-8-lakh-weddings-indian/)',
        '[The Tribune: Wedding season business expected to surge 41% to ₹6 lakh crore, CAIT (2024)](https://www.tribuneindia.com/news/business/wedding-season-business-expected-to-surge-41-per-cent-to-rs-6-lakh-crore-confederation-of-all-india-traders)',
        '[IBTimes India: CAIT 2024 estimate and budget breakdown](https://www.ibtimes.co.in/indias-wedding-season-biz-expected-surge-41-pc-rs-6-lakh-crore-cait-874246)',
        '[WION: Jefferies on the $130 billion wedding industry](https://www.wionews.com/business-economy/the-big-fat-indian-paychecks-wedding-industry-drives-consumption-economic-boom-734884)',
      ],
    },
  ],
  faq: [
    {
      q: 'How big is the Indian wedding industry?',
      a: 'The Confederation of All India Traders estimated about ₹6.5 lakh crore of spending across 46 lakh weddings in the 2025 season. A Jefferies report sized the industry at about $130 billion a year, second only to food and grocery among consumption categories.',
    },
    {
      q: 'How is wedding spending split in India?',
      a: "By CAIT's 2024 estimate, 40 of 48 lakh weddings had budgets of ₹15 lakh or less, about 83% of weddings and roughly 58% of spending. The top one lakh weddings, at ₹50 lakh and above, were about 2% of weddings and at least 13% of spending.",
    },
    {
      q: 'Why is growth hard for wedding businesses?',
      a: 'Customers rarely buy twice, so each lead has to pay back on the first sale. Demand is seasonal and bunches around auspicious dates, and the purchase depends on trust, which hidden pricing and slow responses erode.',
    },
  ],
};

export const constructionEquipment: Article = {
  slug: 'construction-equipment-rental-india',
  title: 'Construction equipment in India: a large market that still rents by phone',
  seoTitle: 'Construction Equipment Rental in India: A Market Breakdown',
  description:
    "How India's construction equipment market works: who buys the machines, why rental is fragmented, and what a construction marketplace has to get right.",
  excerpt: `India sold over 1.4 lakh construction machines in FY25, and most of them end up with small rental owners. What that means for anyone building a marketplace in the sector.`,
  category: 'Sector Breakdown',
  keywords: [
    'construction equipment rental India',
    'construction equipment market India',
    'ICEMA sales FY25',
    'construction tech marketplace',
    'backhoe loader sales India',
    'Equip9',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: `I spent close to two years on growth at Equip9, a marketplace for construction equipment, and later nine months on a business transformation at MCCS Infra, an infrastructure and construction company. One job sold to the sector and the other worked inside it. Between them they showed me how differently construction buys from the rest of the economy.`,
    },

    { type: 'h2', text: 'The size of the machine market' },
    {
      type: 'p',
      text: `The Indian Construction Equipment Manufacturers Association (ICEMA) reported sales of 1,40,191 machines in FY25, up 3% from 1,35,650 in FY24. Domestic sales grew only 2.7%, and exports, up about 10%, carried the year. ICEMA describes India as the world's third largest construction equipment market.`,
    },
    {
      type: 'table',
      head: ['Segment', 'FY25 units'],
      rows: [
        ['Earthmoving equipment', '99,159'],
        ['of which backhoe loaders', '53,133'],
        ['of which crawler excavators', '35,816'],
        ['Material handling', '17,050'],
        ['Concrete equipment', '14,473'],
        ['Road construction', '7,002'],
        ['Material processing', '2,507'],
      ],
      caption: 'ICEMA annual sales report, FY25. The five segments add up to the 1,40,191 total.',
    },
    {
      type: 'p',
      text: `Earthmoving is 71% of all units, and the backhoe loader alone is 38%. It is a general purpose machine that one owner can keep busy across very different sites, which makes it the natural unit of a small rental business.`,
    },

    { type: 'h2', text: 'Who owns the machines' },
    {
      type: 'p',
      text: `Most machines are not bought by the contractor that ends up using them. Off-Highway Research data, reported by International Rental News, puts about two thirds of Indian construction equipment sales into the rental channel. The rental side is fragmented, made up of small private and regional owners, with no large national chain.`,
    },
    {
      type: 'p',
      text: `A common transaction looks like this: a site manager needs an excavator for two weeks and calls owners they know until one has a machine free. Price, availability and the quality of the operator are all settled on the phone. That is the gap construction marketplaces are built to close, and it is harder than it looks, because the phone call comes with a relationship and a marketplace starts without one.`,
    },

    { type: 'h2', text: 'A marketplace here has two customers with little in common' },
    {
      type: 'p',
      text: `The first thing Equip9 taught me is that a contractor renting a machine for a week and an owner listing a fleet want different things. The contractor wants a machine that is available now, at a known price, with an operator they can trust. The owner wants machines that are expensive to leave idle to stay busy. We had been running one message at both audiences, and a large share of the spend was reaching the wrong half.`,
    },
    {
      type: 'p',
      text: `Rebuilding acquisition around segments, each with its own message and funnel, improved lead conversion by 40% and helped drive 300% profit growth. Sales capacity was the real bottleneck, so we optimised for lead quality: more weak leads would only have slowed the sales team down. I also owned branding and client delivery across 15+ accounts, which generated ₹30L+ in annual revenue.`,
    },
    {
      type: 'p',
      text: `Content had its own bottleneck. Every segment needed its own material, and producing it by hand did not scale, so I built a content engine with AI workflow agents that halved production turnaround. It was the first time I saw AI move an operating metric directly.`,
    },

    { type: 'h2', text: 'The buyer side, seen from inside a construction company' },
    {
      type: 'p',
      text: `At MCCS Infra the problem sat on the other side of the market. Construction companies carry their cost base in people and idle capacity, and they tend to hire when a project lands, paying a premium for speed. We rebuilt capacity planning against the actual project pipeline, redesigned hiring and resource allocation, and opened a digital inbound channel with a brand overhaul.`,
    },
    {
      type: 'p',
      text: `Hiring turnaround fell 80% and cost per hire halved. Inbound enquiries rose 4.5 times, and the manpower restructuring saved ₹2 Cr. A contractor that plans capacity against its pipeline can also see its equipment needs weeks ahead, and that forward demand is exactly what an equipment marketplace wants to capture before the phone calls start.`,
    },

    { type: 'h2', text: 'What a marketplace in this sector has to get right' },
    {
      type: 'ul',
      items: [
        'Verified availability. A listing that turns out to be booked sends the buyer straight back to the phone.',
        'Information about the operator, since the person running the machine decides how the job goes.',
        'Separate funnels, messages and pricing for owners and renters.',
        'A way to fill an owner\'s idle weeks, which is the real product on the supply side.',
        'Payment terms that fit how contractors get paid, which is often late and in stages.',
      ],
    },
    {
      type: 'p',
      text: `The same shape, a fragmented local supply side and a buyer who trusts a phone number, shows up well beyond construction. I pulled the pattern together in [a thesis on tier-2 India](/articles/tier-2-india-investment-thesis).`,
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[ICEMA annual sales report FY25 (press release PDF)](https://www.i-cema.in/wp-content/uploads/2025/06/ICEMA-Press-Release_Annual-Sales-Report-FY25_28May25.pdf)',
        '[NBMCW: Indian construction equipment industry grows 3% in FY25](https://www.nbmcw.com/news/indian-construction-equipment-industry-grows-3-in-fy25-icema.html)',
        '[International Rental News: Why rental dominates in India](https://www.internationalrentalnews.com/news/why-rental-dominates-in-india/8019740.article)',
      ],
    },
  ],
  faq: [
    {
      q: "How big is India's construction equipment market?",
      a: 'ICEMA reported sales of 1,40,191 construction machines in FY25, up 3% on FY24, with exports growing faster than domestic sales. It describes India as the third largest construction equipment market in the world.',
    },
    {
      q: 'Is construction equipment in India mostly rented or owned?',
      a: 'Mostly rented. Off-Highway Research data puts about two thirds of construction equipment sales into the rental channel, and the rental side is fragmented among small private and regional owners.',
    },
    {
      q: 'What is the best-selling construction machine in India?',
      a: 'The backhoe loader. ICEMA counted 53,133 sold in FY25, about 38% of all construction equipment units.',
    },
  ],
};

export const aiInInternalAudit: Article = {
  slug: 'ai-in-internal-audit',
  title: 'AI in internal audit: where the hours go, and what a tool can take over',
  seoTitle: 'AI in Internal Audit: What Actually Saves Time',
  description:
    'What happens when an AI tool meets a real audit practice: where audit hours go, what the tool took over, and why reaching 50% adoption took training.',
  excerpt: `At PwC India I co-built an internal audit AI tool that saved 10,000+ hours across 200+ consultants. The industry is spending heavily on AI, and most auditors still are not using it.`,
  category: 'Sector Breakdown',
  keywords: [
    'AI in internal audit',
    'generative AI audit',
    'audit automation',
    'Big 4 AI adoption',
    'risk consulting AI',
    'internal audit tools',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: `I spent fifteen months in risk consulting at PwC India, and part of that time went into co-developing an internal audit AI tool. It saved more than 10,000 consulting hours across 200+ consultants. Getting it used was harder than building it. I led firm-level training across 10 pilot engagements, and the tool reached 50% adoption within six months.`,
    },

    { type: 'h2', text: 'Where the profession is' },
    {
      type: 'p',
      text: `The large firms are spending heavily. PwC US announced in April 2023 that it would invest $1 billion over three years in generative AI and train its 65,000 people to use it. Use on the ground has moved more slowly. In a 2024 study by Wolters Kluwer and the Internal Audit Foundation, about half of internal audit leaders said their organisations were fully or partially implementing generative AI, while only about 26% of auditors said they were using it in their audit work. 76% of the leaders rated their own generative AI skills as novice or beginner.`,
    },
    {
      type: 'p',
      text: `That distance between investment and use is where I think most of the value of the next few years sits. The models can already do a lot of audit work. What holds adoption back is fitting a tool into how auditors actually work, and giving them reasons to trust what it produces.`,
    },

    { type: 'h2', text: 'Where the hours go in an audit' },
    {
      type: 'p',
      text: `An internal audit engagement spends much of its time on repetitive, document heavy work: reading policies and process notes, comparing what the documents say with what people actually do, building control matrices, sampling transactions and writing findings up in the firm's format. The judgement sits elsewhere, in scoping the audit, deciding whether a control gap matters and talking it through with the client.`,
    },
    {
      type: 'p',
      text: `The first kind of work is where a tool can take hours out. The second is what clients pay auditors for, and the hours a tool saves go back into it.`,
    },

    { type: 'h2', text: 'What made adoption work' },
    {
      type: 'p',
      text: `In a consulting firm nobody changes how they work because a new tool exists. Consultants are measured on client delivery, and a tool that slows them down in the first week gets dropped. We ran the training inside live pilot engagements, so people learned the tool on their own client work, and the 50% adoption we reached in six months came from that training far more than from any feature.`,
    },
    {
      type: 'p',
      text: `Training on real engagement work also lets people check the tool's output against their own before they rely on it. For audit, where every finding has to stand up to review, that check is how trust gets built.`,
    },

    { type: 'h2', text: 'Where AI in audit goes next' },
    {
      type: 'p',
      text: `Two directions look most promising to me. One is testing entire populations of transactions, which removes one of the oldest limits on what an audit can conclude from a sample. The other is drafting: turning notes and evidence into a first version of a finding in the firm's format, so the auditor starts from an edit.`,
    },
    {
      type: 'p',
      text: `Both carry the same requirement. Every statement in an audit report has to trace back to evidence, so a tool that cannot show where a claim came from will not be trusted with the work that matters.`,
    },

    { type: 'h2', text: 'What I would ask of any audit AI product' },
    {
      type: 'ul',
      items: [
        'Which step of the audit does it take hours out of, and how many per engagement?',
        'Can every output be traced back to a source document?',
        'How does it keep client data confidential?',
        'What adoption have customers reached after six months, and what did it take to get there?',
        'Does it replace a tool the auditor already uses, or add another screen?',
      ],
    },
    {
      type: 'p',
      text: `The rest of my PwC work was on cost and process, and I wrote up [where margin actually leaks in Indian companies](/articles/where-margin-leaks-indian-companies) separately.`,
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[SiliconANGLE: PwC announces a multiyear $1 billion investment in generative AI (April 2023)](https://siliconangle.com/2023/04/26/pricewaterhousecoopers-announces-multiyear-1b-investment-generative-ai/)',
        '[The Accountant: Wolters Kluwer and IIA report on generative AI in internal audit](https://www.theaccountant-online.com/news/wolters-kluwer-iia-report/)',
        '[Internal Audit Foundation: Harnessing generative AI for internal audit activities (2024, PDF)](https://www.theiia.org/globalassets/site/content/research/foundation/2024/harnessinggenerativeai_1.pdf)',
      ],
    },
  ],
  faq: [
    {
      q: 'How is AI used in internal audit?',
      a: 'Mostly on repetitive, document heavy work: reading policies and process notes, comparing documentation with practice, building control matrices, sampling transactions and drafting findings. Scoping, judging whether a gap matters and client conversations stay with the auditor.',
    },
    {
      q: 'How many internal auditors use generative AI?',
      a: 'In a 2024 study by Wolters Kluwer and the Internal Audit Foundation, about half of audit leaders said their organisations were implementing generative AI, but only about 26% of auditors were using it in audit work.',
    },
    {
      q: 'What makes AI adoption work in an audit team?',
      a: 'Training on live engagements, so people learn the tool on their own client work and can check its output before relying on it. At PwC India, training across 10 pilot engagements took an internal audit AI tool to 50% adoption in six months.',
    },
  ],
};
