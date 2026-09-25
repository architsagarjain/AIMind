import type { Article } from '@/types';

/**
 * Thought pieces: opinion and lessons, argued from Archit's own work.
 * House rules as in sectors.ts. Opinions are marked as opinions; facts
 * about his work come only from the verified content files.
 */

export const zeroCommissionChairs: Article = {
  slug: 'zero-commission-shift-push-and-absorb',
  title: 'The zero-commission shift, seen from every chair',
  seoTitle: 'Zero-Commission Ride-Hailing Through Push and Absorb',
  description:
    'Indian ride-hailing moved from commissions to driver subscriptions. The same change run through the Push and Absorb framework from four chairs: Rapido, Uber, drivers, fleets.',
  excerpt: `One change, four positions. Rapido made it, Uber and Ola absorbed it, drivers gained from it, and owned fleets had to answer it. Running my own framework on a real industry event from each chair.`,
  category: 'Thought Piece',
  keywords: [
    'Push and Absorb framework example',
    'zero commission ride hailing',
    'Rapido subscription model',
    'Uber zero commission India',
    'strategy case study',
    'competitive response',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `The claim at the centre of my [Push and Absorb framework](/articles/push-and-absorb-framework) is that whatever you are forced to deal with was, at some point, somebody else's decision. The best test of a framework is a real event, so here is one from my own industry, run from each chair in turn.`,
    },
    {
      type: 'p',
      text: `The event: Rapido moved its cab drivers to a flat subscription in December 2023 and extended it to autos in February 2024, so drivers paid a daily fee and kept the fare. Namma Yatri, on the open network, took no commission at all. Uber followed for autos in February 2025, saying it wanted to avoid a competitive disadvantage, and Ola launched a national version in June 2025 with passes at ₹67 a day.`,
    },

    { type: 'h2', text: "Rapido's chair: a push" },
    {
      type: 'p',
      text: `Rapido held the lever, so this is Push. Defined properly: the driver's take-home per ride rises and the platform's revenue per ride changes from a percentage to a flat fee. Drivers are better off, and Rapido pays in revenue per ride, betting it gains in supply.`,
    },
    {
      type: 'p',
      text: `Traced through the four channels, the change looks strong. Capacity: more drivers are willing to log in. Incentive: a driver who keeps the whole fare prefers the platform that lets them. Expectation: once drivers keep the fare, they will never again accept a large cut without a fight, which makes the change nearly irreversible for Rapido and, as it turned out, for everyone else. Response: rivals have to answer it.`,
    },
    {
      type: 'p',
      text: `Rehearsing from the other side is where the push shows its strength. From Uber's chair, the cheapest posture was to match, which is what Uber did. A push whose best counter is imitation still leaves the first mover with the head start.`,
    },

    { type: 'h2', text: "Uber's and Ola's chair: an absorb" },
    {
      type: 'p',
      text: `For the incumbents this arrived as a condition. Classified, it was slow and permanent: it spread over more than a year, from Rapido's cabs in December 2023 to Uber's autos in February 2025, and no driver was going to ask for the commission back. Slow and permanent is the most dangerous box in the framework, because no single week feels like a crisis while drivers drift.`,
    },
    {
      type: 'p',
      text: `Traced back, the layer the incumbents could act on was their own fee structure. The posture Uber stated publicly was adapt: follow the industry's shift to avoid a disadvantage. The move to look for would have been turning it around, for example using the change to win drivers back with products an open network cannot easily offer. The public record shows Uber chose to adapt.`,
    },

    { type: 'h2', text: "The driver's chair: a change that helps" },
    {
      type: 'p',
      text: `Absorb also applies to good news. For a driver the change is fast and, for now, favourable. The posture that pays is turning it around: running several apps at once and choosing trips on each, now that no platform takes a cut worth staying loyal for. What a driver should watch is the subscription price, which is the new lever the platforms hold.`,
    },

    { type: 'h2', text: "The owned fleet's chair: the hardest seat" },
    {
      type: 'p',
      text: `An owned electric fleet, like the one I work on at ZenCabs, recruits from the same pool of drivers. When aggregators let drivers keep nearly the whole fare, the fleet's offer to a driver has to be worth more than that. The change is slow and permanent here as well.`,
    },
    {
      type: 'p',
      text: `Traced back, the levers a fleet holds are the car itself, which the driver does not have to buy, and the flow of bookings, which depends on utilisation. The posture is adapt: compete on steady earnings from a busy car. That puts even more weight on utilisation, the number I describe in [the unit economics of an electric cab fleet](/articles/ev-cab-fleet-unit-economics-tier-2-india).`,
    },

    { type: 'h2', text: 'What running it from every chair shows' },
    {
      type: 'p',
      text: `Every party's condition was another party's decision, which is the framework's central claim playing out in public. The push worked because the first mover checked, correctly, that the other side's cheapest answer was to copy it. And the expectation channel did the most damage and the most good: it made the change irreversible for the whole industry within about eighteen months.`,
    },
    {
      type: 'p',
      text: `The open-network side of the story, and why it took hold in mobility first, is in [open networks worked first in mobility](/articles/open-networks-mobility-namma-yatri).`,
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        '[Inc42: Uber follows Rapido with a zero-commission model for auto drivers](https://inc42.com/buzz/exclusive-uber-follows-rapido-rolls-out-zero-commission-model-for-auto-drivers/)',
        '[YourStory: Ola rolls out zero-commission rides pan-India (June 2025)](https://yourstory.com/2025/06/ola-rolls-0-commission-rides-pan-india-rapido-uber)',
        '[Business Standard: Namma Yatri launches zero-commission cabs in Bengaluru](https://www.business-standard.com/technology/apps/namma-yatri-launches-zero-commission-cab-service-in-bengaluru-124041601064_1.html)',
      ],
    },
  ],
  faq: [
    {
      q: 'What is an example of the Push and Absorb framework?',
      a: 'The shift to zero-commission ride-hailing in India. For Rapido, which started it, the change was a push. For Uber and Ola it arrived as a slow, permanent force they had to absorb, and their stated posture was to adapt.',
    },
    {
      q: 'Why did Uber and Ola move to zero commission?',
      a: 'Rapido moved drivers to flat subscriptions from December 2023. Uber followed for autos in February 2025, saying it wanted to avoid a competitive disadvantage, and Ola launched a national version in June 2025.',
    },
  ],
};

export const buildingTheClone: Article = {
  slug: 'building-an-ai-clone-of-myself',
  title: 'What building an AI clone of myself taught me about shipping AI',
  seoTitle: 'Building an AI Clone of Myself: Lessons in Shipping AI',
  description:
    'Lessons from building the AI clone on this site on free models: a reasoning leak, a timeout, cut-off answers and voice lag, and what fixing each one taught me.',
  excerpt: `The AI clone on this site answers as me, from my real work, on free models. Getting a first answer was quick. Making it reliable enough to put in front of recruiters took nearly all the work.`,
  category: 'Thought Piece',
  keywords: [
    'building an AI chatbot',
    'AI clone',
    'shipping LLM products',
    'free LLM models fallback',
    'AI reliability',
    'OpenRouter',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `This site has an AI clone of me that answers questions about my work. I built it on two constraints: it may only state figures that appear in its knowledge base, which is compiled from the same verified content as the rest of the site, and it runs only on free models. Both constraints shaped every problem that followed.`,
    },

    { type: 'h2', text: 'Free models fail often, so fallback is the product' },
    {
      type: 'p',
      text: `Free models on OpenRouter are rate-limited, and they appear and disappear. The clone checks a live catalogue for models priced at exactly zero, keeps a preference order, and falls back from one model to the next when a request fails. If every model fails, it answers from pre-written responses and says so. I treat the fallback chain as the product and the model as a replaceable part.`,
    },

    { type: 'h2', text: 'The first real failure: the model thought out loud' },
    {
      type: 'p',
      text: `Soon after launch, the question "How did you scale ZenCabs?" got an answer that began "Here's a thinking process". A free reasoning model had written its working into the reply, including the rules it had been given. Another request thought silently for so long that the platform's time limit cut it off and the visitor saw a gateway error.`,
    },
    {
      type: 'p',
      text: `The fixes were structural. The response now starts immediately and every model is tried inside a fixed time budget. The first 80 characters of each answer are held back and checked, and a model whose opening reads like reasoning is dropped for the next one before the visitor sees a word. Reasoning models moved to the back of the queue.`,
    },

    { type: 'h2', text: 'Then it was slow' },
    {
      type: 'p',
      text: `The next complaint was lag in both chat and voice. Voice was waiting for the whole answer to be turned into audio before playing anything, so it now speaks sentence by sentence and fetches the next sentence while the first plays. Chat was waiting up to 15 seconds on a slow model before trying another, so it now starts a second model after 4 seconds and keeps whichever produces a clean answer first. The knowledge base was trimmed by about a fifth, removing lines the case studies already covered.`,
    },

    { type: 'h2', text: 'Then answers were cut off' },
    {
      type: 'p',
      text: `Answers started losing their last word. The filter that removes hidden reasoning tags held back the last few characters in case they were the start of a tag, and once an answer was showing, it never released them. Every test I had run checked how answers began, and none checked how they ended. The lesson I took is to test the way a person reads, all the way to the last line.`,
    },

    { type: 'h2', text: 'Style is a constraint too' },
    {
      type: 'p',
      text: `A clone that writes like a chatbot undermines the point of the site. The model is instructed to write plain sentences without dashes or stock phrasing, and because free models ignore instructions some of the time, dashes are also normalised as the answer streams. The pre-written fallback answers were rewritten in the same style.`,
    },

    { type: 'h2', text: 'What I took from it' },
    {
      type: 'p',
      text: `Getting a model to produce a good answer once was the easy part. Nearly all the work went into what happens when it fails, stalls, leaks or drifts: the fallbacks, the time budget, the checks on the opening, the test on the ending. That matches what I saw with the internal audit AI tool at PwC India, where adoption and reliability took more effort than the model did, and it is why my [thesis on applied AI](/articles/applied-ai-indian-businesses-thesis) puts reliability and adoption at the centre.`,
    },
    {
      type: 'p',
      text: `You can test the result yourself: [ask the clone](/ask) anything about my work.`,
    },
  ],
  faq: [
    {
      q: 'How does the AI clone on this site work?',
      a: 'It answers from a knowledge base compiled from the same verified content as the site, using free models on OpenRouter with fallback between them, a time budget, a check that drops models that leak their reasoning, and pre-written answers if every model fails.',
    },
    {
      q: 'What is the hardest part of shipping an AI product?',
      a: 'Handling failure: slow models, leaked reasoning, timeouts and truncated answers. Getting a good answer once is easy; making every answer reliable takes most of the work.',
    },
  ],
};

export const leavingBigFour: Article = {
  slug: 'leaving-big-4-for-a-startup',
  title: 'Why I left Big 4 consulting to build in my hometown',
  seoTitle: 'Why I Left Big 4 Consulting for a Startup',
  description:
    'What fifteen months at PwC India taught me, why I moved to run strategy and growth at an EV startup in Jammu, and what carried over and what did not.',
  excerpt: `Fifteen months at PwC India gave me a standard of rigour I still use every week. It also showed me how large organisations decide, which is exactly why I wanted to build inside a small one.`,
  category: 'Thought Piece',
  keywords: [
    'leaving consulting for a startup',
    'Big 4 to startup',
    'consulting vs operating',
    'PwC India',
    'career in startups',
    'founder office',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `I spent fifteen months in risk consulting at PwC India and was promoted from Specialist to Specialist 2 inside a year. In January 2026 I joined ZenCabs, an electric cab service in my hometown of Jammu, as Head of Strategy & Growth. This is how I think about that move.`,
    },

    { type: 'h2', text: 'What PwC gave me' },
    {
      type: 'p',
      text: `The biggest thing was a standard of rigour. At a Big 4 firm your analysis has to survive people actively looking for holes in it, and after a while you start looking for the holes yourself before anyone else does. The work taught me to size every finding, because a finding without a number does not get funded, and to walk a process as people actually run it before judging the policy that describes it.`,
    },
    {
      type: 'p',
      text: `It also gave me results I am proud of: ₹6+ Cr in annual client cost savings, engagements worth ₹12 Cr+ for clients including Cars24, Stryker India and PIF, and an internal audit AI tool that saved 10,000+ consulting hours. I wrote about the cost work in [where margin leaks in Indian companies](/articles/where-margin-leaks-indian-companies) and the tool in [AI in internal audit](/articles/ai-in-internal-audit).`,
    },

    { type: 'h2', text: 'Why I left' },
    {
      type: 'p',
      text: `Consulting showed me in detail how large organisations make decisions: slowly, through layers of approval, with the adviser some distance from the outcome. I had already run Cairros, my agency, through college, so I knew what it was like to own a result end to end, and I wanted that ownership again. ZenCabs sat at the far end of the spectrum from a Big 4 firm: a new venture, a small team and a number that moved every week.`,
    },
    {
      type: 'p',
      text: `Jammu mattered too. I come from a fourth-generation business family there, and the city was a market the national aggregators had never prioritised, which made it a real gap to build into.`,
    },

    { type: 'h2', text: 'What carried over' },
    {
      type: 'ul',
      items: [
        'Sizing. The expansion case behind adding 10+ cars a month started from a market sizing, the same habit as sizing an audit finding.',
        'Structure. A vague problem such as growth being slow still breaks down the same way into questions with owners.',
        'Decision rights. Knowing who can approve what, and making it fast, matters as much in a startup as in a client.',
        'Leadership reporting. The weekly KPI review with the founder is a lighter version of the structured reviews I ran for CXOs.',
      ],
    },

    { type: 'h2', text: 'What I had to unlearn' },
    {
      type: 'p',
      text: `The finish line moved. In consulting a well-supported recommendation is a finished piece of work; in a startup it is the start. I also had to stop waiting for complete data. At ZenCabs a decision that could be undone cheaply was usually worth taking this week and correcting next week, which is the logic of the commit step in my [Push and Absorb framework](/articles/push-and-absorb-framework): think hard about the changes that are expensive to reverse, and move quickly on the rest.`,
    },
    {
      type: 'p',
      text: `The feedback loop changed most. At PwC an engagement took months to show a result. At ZenCabs the weekly review showed within days whether a change was working, and over those first four months the service went from launch to 25,000+ users and a ₹3 Cr annualised run-rate.`,
    },

    { type: 'h2', text: 'What it cost' },
    {
      type: 'p',
      text: `A startup has less structure, less certainty and a smaller brand behind it, and there is nobody to escalate to when a problem is yours. I chose that knowingly, and I am now adding the technology layer on top at Masters' Union, so the next thing I build I can also build the product for.`,
    },
  ],
  faq: [
    {
      q: 'Is it a good idea to leave Big 4 consulting for a startup?',
      a: 'It depends on what you want to be good at. Consulting builds rigour, sizing and structured problem solving. A startup builds ownership and fast feedback. Moving after consulting lets you carry the first set of skills into the second.',
    },
    {
      q: 'What skills transfer from consulting to a startup?',
      a: 'Sizing problems, structuring vague questions, designing decision rights and running structured reviews with leadership. What needs unlearning is treating the recommendation as the finish line and waiting for complete data.',
    },
  ],
};

export const agencyInCollege: Article = {
  slug: 'running-an-agency-in-college',
  title: 'What running an agency in college taught me about selling and delivering',
  seoTitle: 'Running an Agency in College: Lessons From Cairros',
  description:
    'Lessons from building Cairros to seven-figure revenue while at Symbiosis: diagnosing before prescribing, pricing, saying no, and making each engagement sell the next.',
  excerpt: `I started Cairros in my second year of college with no brand and no balance sheet, and scaled it to seven-figure annual revenue in two years. Every engagement had to sell the next one, which taught me more than any course did.`,
  category: 'Thought Piece',
  keywords: [
    'student entrepreneur India',
    'running an agency in college',
    'consulting agency lessons',
    'small business growth',
    'Cairros',
    'Symbiosis',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `I started Cairros, a consulting and marketing agency, in my second year at Symbiosis in Pune, and scaled it to seven-figure annual revenue in two years. I owned strategy, sales and delivery end to end. With no brand and no balance sheet, every engagement had to produce results good enough to win the next one.`,
    },

    { type: 'h2', text: 'Diagnose before prescribing' },
    {
      type: 'p',
      text: `Clients almost always arrived with a solution already in mind, usually "we need more marketing". The presenting problem was rarely the real constraint. For three restaurant clients, the constraint sat inside the building: the menu and how quickly tables turned. Menu reengineering and table-turnaround operations grew their revenue 30%, at about 7% a month. I wrote up the arithmetic in [where a 30% revenue lift comes from](/articles/indian-restaurant-economics).`,
    },

    { type: 'h2', text: 'Pricing is the fastest lever' },
    {
      type: 'p',
      text: `A magazine client went from ₹2L to ₹7L of sales a month over six months, growing at about 23% a month, after a pricing and sales restructure. It showed me how much faster a price change moves revenue than a campaign does, and it is why I now look at pricing first in any services business. There is more in [pricing as the fastest lever](/articles/pricing-services-business-playbook).`,
    },

    { type: 'h2', text: 'Small-business founders pay for momentum' },
    {
      type: 'p',
      text: `What a small-business founder wants is to see something move, week after week. So the engagements I set up left behind a cadence, a short list of numbers reviewed regularly with a clear next step each time, that the client could keep running after the engagement ended.`,
    },

    { type: 'h2', text: 'Turning down the wrong client' },
    {
      type: 'p',
      text: `Some of the best decisions I made were the engagements I declined. A client whose problem I could not move, or who wanted a deliverable more than a result, would have taken the time the next good client needed and produced nothing to show them. In a services business with no reputation yet, each result is the marketing for the next sale.`,
    },

    { type: 'h2', text: 'Depth before breadth' },
    {
      type: 'p',
      text: `Going deep in one sector before entering another is what let the agency grow. A reputation in one vertical got me into the next, and Cairros expanded across four sectors through rebrand, hiring and growth mandates backed by market research.`,
    },

    { type: 'h2', text: 'Running my own P&L' },
    {
      type: 'p',
      text: `Owning the P&L taught me which advice is actually expensive to follow. A recommendation looks different when you are the one paying for it. I also did it alongside the degree, where I finished with a CGPA of 8.16 in the top 10% of my batch and was elected Placement Coordinator from a cohort of 400.`,
    },
    {
      type: 'p',
      text: `Cairros is why I walked into PwC India already knowing how a business breaks, and why I later wanted to go back to owning outcomes, which I wrote about in [why I left Big 4 consulting](/articles/leaving-big-4-for-a-startup).`,
    },
  ],
  faq: [
    {
      q: 'Can you run a business while in college in India?',
      a: 'Yes. I started Cairros in my second year at Symbiosis and scaled it to seven-figure annual revenue in two years, while finishing with a CGPA of 8.16 in the top 10% of my batch.',
    },
    {
      q: 'What is the biggest lesson from running a small agency?',
      a: 'Diagnose before prescribing. The problem a client arrives with is rarely the real constraint, and results in the first few weeks decide whether they stay.',
    },
  ],
};

export const reliabilityStrategy: Article = {
  slug: 'reliability-as-growth-strategy',
  title: 'Reliability is the growth strategy most Indian businesses underprice',
  seoTitle: 'Reliability as a Growth Strategy in Indian Businesses',
  description:
    'Across cabs, weddings, construction, restaurants and AI, reliability moved retention more than discounts did. How to measure it, own it and sell it.',
  excerpt: `A discount shows up in next week's numbers. Reliability shows up in next quarter's retention, which is why it gets underfunded. What five different businesses taught me about treating it as the strategy.`,
  category: 'Thought Piece',
  keywords: [
    'reliability growth strategy',
    'customer retention India',
    'operational excellence',
    'reduce cancellations',
    'service reliability metrics',
    'discounts vs retention',
  ],
  published: '2026-09-26',
  blocks: [
    {
      type: 'p',
      text: `In almost every business I have worked in, the most effective growth work was making something happen every time it was supposed to. It is also the work that gets the least budget, because its effect shows up slowly. This is the case for treating reliability as the strategy.`,
    },

    { type: 'h2', text: 'The evidence from my own work' },
    {
      type: 'table',
      head: ['Business', 'The reliability problem', 'What it was worth'],
      rows: [
        ['ZenCabs', 'Four in ten ride requests were cancelled', 'Cancellations fell from 40% to 6%, and 27% of users became monthly active riders'],
        ['Shaadi Mangalam', 'A funnel that lost almost every lead before booking', 'Conversion rose from 1.4% to 4% with pricing, sales and website fixes'],
        ['Restaurants, through Cairros', 'Waits for the menu, the order, the food and the bill', 'Revenue grew 30% with menu and table-turnaround work'],
        ['This site', 'Free AI models that fail, stall or leak', 'Fallbacks mean a visitor always gets an answer'],
      ],
    },
    {
      type: 'p',
      text: `The ZenCabs row is the clearest. In Jammu the alternative to an app is a phone call to a driver you already know, so a rider let down twice goes back to making that call. Bringing cancellations down with 10+ standard procedures across onboarding and dispatch removed a reason people were leaving, which no discount addresses.`,
    },

    { type: 'h2', text: 'Why it gets underpriced' },
    {
      type: 'p',
      text: `A discount is easy to measure: it goes out on Monday and bookings rise by Friday. Reliability work shows up as customers who did not leave, which appears weeks later in a retention chart that few people watch. So budgets flow to what shows up fastest, and the business ends up paying to acquire customers it keeps losing to its own failures.`,
    },
    {
      type: 'p',
      text: `The two also build opposite expectations, which is the channel my [Push and Absorb framework](/articles/push-and-absorb-framework) flags as the most expensive. A discount teaches customers to wait for the next one. Reliability teaches them to stop checking alternatives, and a competitor then has to match it before a discount can even get them considered.`,
    },

    { type: 'h2', text: 'How to treat reliability as the strategy' },
    {
      type: 'ol',
      items: [
        'Define a failure in the customer\'s terms: a cancelled ride, an unanswered enquiry, a machine shown as available that was not.',
        'Measure the failure rate every week, split by cause.',
        'Give each cause one owner and a standard procedure.',
        'Review it in the same weekly meeting as growth, so it competes for attention on equal terms.',
        'Tell customers. A published promise that you keep is a marketing asset a discount cannot buy.',
      ],
    },
    {
      type: 'p',
      text: `The weekly review I describe in [the weekly review that took cancellations from 40% to 6%](/articles/weekly-operating-review-kpi-cadence) is where most of this happened at ZenCabs.`,
    },

    { type: 'h2', text: 'Where it matters most' },
    {
      type: 'p',
      text: `Reliability pays most where customers have a familiar fallback, where a single failure is costly, or where the purchase depends on trust. That describes most services outside India's largest cities, which is part of [my thesis on building beyond the metros](/articles/tier-2-india-investment-thesis). It also describes AI products, where one visible failure can undo a month of good answers, which I learned building [the AI clone on this site](/articles/building-an-ai-clone-of-myself).`,
    },
  ],
  faq: [
    {
      q: 'Why is reliability a growth strategy?',
      a: 'Because failures drive customers back to their alternatives. At ZenCabs, cutting ride cancellations from 40% to 6% coincided with 27% of users becoming monthly active riders. Reliability removes the reason customers leave, which a discount does not.',
    },
    {
      q: 'How do you measure service reliability?',
      a: "Define a failure in the customer's terms, measure its rate every week split by cause, give each cause an owner and a standard procedure, and review it alongside growth metrics.",
    },
  ],
};
