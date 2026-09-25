import type { Article } from '@/types';

/**
 * Venture capital articles.
 *
 * Archit has not worked at a fund, and these say so: they are written from
 * the operator's side of the table. Claims about his own work come only from
 * the verified content files; the rest is opinion, with no invented figures.
 */

export const breakIntoVentureCapital: Article = {
  slug: 'how-to-break-into-venture-capital-india',
  title: 'How to Break Into Venture Capital in India: An Operator’s Route',
  seoTitle: 'How to Break Into Venture Capital in India (VC Roles Guide)',
  description:
    'VC roles explained, from analyst to partner, what funds look for in hires, and a practical route into venture capital in India for operators and students.',
  excerpt:
    'There are few seats in venture capital and no single door. Operators have an advantage most do not use: they already know what running the business behind the pitch is like.',
  category: 'Venture Capital',
  keywords: [
    'how to break into venture capital',
    'venture capital jobs India',
    'VC analyst role',
    'VC associate',
    'venture capital career',
    'operator to VC',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: 'I should say where I stand first. I have not worked at a fund. My career so far has been on the operating side: building Cairros at college, risk consulting at PwC India, and running strategy and growth at ZenCabs. This is how the route into venture capital looks from there, and why I think operators undersell what they bring.',
    },

    { type: 'h2', text: 'What the roles actually are' },
    {
      type: 'p',
      text: 'Titles vary by fund, but most follow a similar ladder. What changes as you go up is how much of the decision is yours.',
    },
    {
      type: 'table',
      head: ['Role', 'What the work is', 'How people usually get in'],
      rows: [
        ['Analyst', 'Market research, screening inbound decks, first calls, supporting diligence', 'Straight from college or after a short first job'],
        ['Associate', 'Sourcing companies, running diligence, writing investment memos', 'After a few years in consulting, banking, or operating roles'],
        ['Senior associate or VP', 'Leading deals with a partner, supporting portfolio companies', 'Promotion, or a lateral move with strong operating experience'],
        ['Principal', 'Leading deals end to end, building toward partnership', 'Usually promotion'],
        ['Partner', 'Final investment decisions, board seats, raising the fund', 'Promotion, or a successful founder or operator joining'],
        ['Platform', 'Helping portfolio companies with hiring, go-to-market, community', 'Operators with a specific functional depth'],
        ['Scout', 'Referring early companies to a fund, often part-time', 'Anyone with good access to founders'],
      ],
    },
    {
      type: 'p',
      text: 'Outside traditional funds there are also investing roles at family offices, corporate venture arms and accelerators. They are often more open to operators and are a real entry point, not a consolation prize.',
    },

    { type: 'h2', text: 'What funds are really hiring for' },
    { type: 'p', text: 'Strip away the titles and a fund needs three things from the people it hires:' },
    {
      type: 'ol',
      items: [
        '**Access.** Can you find good founders before everyone else? This is sourcing, and it is why networks matter so much in venture.',
        '**Judgement.** Can you form a view on a company and defend it? This is diligence and writing.',
        '**Help.** Can you make a portfolio company better after the money goes in? This is where operators have the edge.',
      ],
    },
    {
      type: 'p',
      text: 'Most candidates try to show the first two and skip the third. Operators start with the third and need to build the first two on purpose.',
    },

    { type: 'h2', text: 'What an operator brings' },
    {
      type: 'p',
      text: 'When a founder tells an investor their utilisation will rise, an operator knows what it takes to make that happen. At ZenCabs I watched fleet utilisation move from 40% to 75% and cancellations fall from 40% to 6%, and I know how much unglamorous process sat behind each point. That makes it easier to tell a plan that will work from one that only reads well.',
    },
    {
      type: 'p',
      text: 'Operators also know which metrics can be gamed. I wrote a checklist of [the questions I would ask a marketplace startup](/articles/marketplace-startup-due-diligence-checklist) that comes entirely from running one.',
    },

    { type: 'h2', text: 'Building the route, step by step' },
    { type: 'h3', text: '1. Pick a thesis you can actually defend' },
    {
      type: 'p',
      text: 'Choose a sector or pattern where your experience gives you an unusual view. Mine would start from something ZenCabs taught me: markets the national players never prioritised, like Jammu, can be won on reliability rather than price. A thesis like that is specific, testable and yours.',
    },
    { type: 'h3', text: '2. Write in public' },
    {
      type: 'p',
      text: 'Investing is judgement written down. Publishing short, specific analysis on companies and markets is the closest thing to a portfolio a would-be investor can have. It also brings founders to you, which is sourcing.',
    },
    { type: 'h3', text: '3. Practise the investment memo' },
    { type: 'p', text: 'Pick a real startup and write the memo you would send a partner. A good memo answers, in order:' },
    {
      type: 'ul',
      items: [
        'What the company does, in one sentence a stranger would understand.',
        'Why now: what changed that makes this possible or necessary.',
        'How big it can get, sized from the bottom up.',
        'Why this team.',
        'What has to be true for it to work, and the evidence so far.',
        'The main risks, and what would make you walk away.',
      ],
    },
    {
      type: 'p',
      text: 'The last point is the one people skip. It is the investing version of a stop rule in my [Push and Absorb framework](/articles/push-and-absorb-framework): decide in advance what evidence would change your mind.',
    },
    { type: 'h3', text: '4. Get close to founders' },
    {
      type: 'p',
      text: 'Scout for a fund, help at an accelerator, or take a role that sits next to founders every day. A Founder’s Office is one of the best seats for this, which is why I compared the two paths in [Founder’s Office or venture capital: which first?](/articles/founders-office-or-venture-capital).',
    },

    { type: 'h2', text: 'What VC interviews usually test' },
    {
      type: 'ul',
      items: [
        '**Pitch us a company.** Bring one you know deeply, with a clear view on why it could be very large and what could kill it.',
        '**Walk through a market map.** Who the players are, where the gaps are, and where you would invest.',
        '**Critique a portfolio company.** Be specific and fair. Name what you would ask the founder.',
        '**Why venture, why now?** An honest answer about what you want to learn beats a polished one about changing the world.',
      ],
    },

    { type: 'h2', text: 'The honest trade-offs' },
    {
      type: 'p',
      text: 'Venture has few seats and slow feedback. You may not know whether an investment was good for years, which is hard if you are used to the weekly feedback of operating. Many people who want to be investors are better served by operating longer first and arriving with more to offer. Neither order is wrong, but it is worth choosing deliberately.',
    },
  ],
  faq: [
    {
      q: 'Can you get into venture capital without an MBA?',
      a: 'Yes. Many investors come from operating roles, consulting or founding. Funds hire for access to founders, judgement and the ability to help portfolio companies. A degree can open doors, but a written track record of analysis and real operating experience often matter more.',
    },
    {
      q: 'What does a VC analyst do?',
      a: 'An analyst researches markets, screens incoming pitches, takes first calls with founders and supports diligence on deals. It is the usual entry role at a fund and is often filled by recent graduates.',
    },
    {
      q: 'Is a Founder’s Office a good path into venture capital?',
      a: 'It can be. A Founder’s Office gives you close exposure to how startups are run, which builds the operating judgement funds value, and it puts you near founders and investors. Pair it with written analysis to show investing judgement.',
    },
  ],
};

export const foundersOfficeOrVentureCapital: Article = {
  slug: 'founders-office-or-venture-capital',
  title: 'Founder’s Office or Venture Capital: Which Should You Do First?',
  seoTitle: 'Founder’s Office or Venture Capital: Which Career First?',
  description:
    'Founder’s Office vs venture capital as a career: the daily work, feedback loops, skills and exit options of each, and how to decide which to do first.',
  excerpt:
    'Both put you next to founders. One gives you the lever; the other asks you to judge people who hold it. How to choose which to learn first.',
  category: 'Venture Capital',
  keywords: [
    'founder’s office vs venture capital',
    'operator or investor career',
    'VC or startup job',
    'founder’s office career path',
    'venture capital career path',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: 'A lot of people choosing between a Founder’s Office role and a job at a venture fund are really asking the same question: how do I get close to founders and learn how great companies get built? The two paths answer it from opposite sides of the table.',
    },
    {
      type: 'p',
      text: 'The simplest way I know to see the difference comes from my [Push and Absorb framework](/articles/push-and-absorb-framework). Every change is either one you make, where you hold the lever, or one that lands on you, where somebody else does. **A Founder’s Office lives in Push. Venture capital lives mostly in Absorb.** An investor does not hold the lever on the company; the founder does. The investor’s job is to judge who will pull it well.',
    },

    { type: 'h2', text: 'Side by side' },
    {
      type: 'table',
      head: ['', 'Founder’s Office', 'Venture capital'],
      rows: [
        ['Your relationship to the decision', 'You make it, or prepare it for the founder', 'You back the person who makes it'],
        ['Daily work', 'Closing one or two problems inside one company', 'Meeting many companies and judging a few'],
        ['Feedback loop', 'Weeks. The number moves or it does not', 'Years. Outcomes arrive long after the decision'],
        ['Skills you build', 'Execution, operating judgement, cross-functional influence', 'Pattern recognition, market breadth, evaluating people'],
        ['What you are judged on', 'Problems closed with a number next to them', 'Quality of deals found and the returns they produce'],
        ['Common next steps', 'Running a function, general management, founding', 'Moving up at the fund, joining a portfolio company, founding'],
      ],
    },

    { type: 'h2', text: 'The case for operating first' },
    {
      type: 'p',
      text: 'Fast feedback is the best teacher there is. At ZenCabs, a weekly review with the founder meant I found out within days whether a change was working. Over a few months that loop taught me things about marketplaces that I would not have learned from watching many of them from outside: that supply is usually the constrained side, that cancellations are a retention problem, and that on an owned fleet utilisation is the business.',
    },
    {
      type: 'p',
      text: 'That kind of knowledge makes you a better investor later. You can tell which plans are hard, which metrics can be gamed, and which founders understand their own operations. It also makes you useful to portfolio companies, which is the part of venture most junior investors struggle to offer.',
    },

    { type: 'h2', text: 'The case for venture first' },
    {
      type: 'p',
      text: 'Breadth is the other great teacher. In venture you see more business models in a year than most operators see in a decade. You learn how markets are shaped, which founders stand out and why, and how companies at different stages raise money. That breadth can make you a sharper operator or founder later, because you know what good looks like across many companies.',
    },
    {
      type: 'p',
      text: 'Venture also builds a network quickly. If your long-term plan is to found a company, knowing investors and founders early is a real advantage.',
    },

    { type: 'h2', text: 'How to decide' },
    { type: 'p', text: 'Four questions help more than any general advice:' },
    {
      type: 'ol',
      items: [
        '**What do you want to be very good at in five years?** Doing, or judging? Both are skills, and the first job shapes which one you build.',
        '**How do you handle slow feedback?** If not knowing for years whether you were right would bother you, start where the loop is short.',
        '**What will you bring?** Funds value operators who can help portfolio companies. If you do not yet have that depth, operating first builds it.',
        '**Which door is open?** Venture has few entry seats. A strong Founder’s Office offer beats a weak fund offer, and the reverse is also true.',
      ],
    },

    { type: 'h2', text: 'You do not have to choose forever' },
    {
      type: 'p',
      text: 'The paths cross often. Operators join funds as platform leads or partners. Investors leave to join a portfolio company or start their own. What matters is choosing the first step deliberately and knowing what you want to take from it.',
    },
    {
      type: 'p',
      text: 'If you lean toward operating, start with [what a Founder’s Office role involves](/articles/what-is-a-founders-office-role). If you lean toward investing, start with [how to break into venture capital in India](/articles/how-to-break-into-venture-capital-india).',
    },
  ],
  faq: [
    {
      q: 'Is it better to work at a startup before venture capital?',
      a: 'It often helps. Operating teaches execution and fast feedback, and it gives you the depth to help portfolio companies later, which funds value. But venture first builds breadth and a network quickly, so the right order depends on what you want to be good at.',
    },
    {
      q: 'Can you move from venture capital to a Founder’s Office?',
      a: 'Yes. Investors regularly join portfolio companies in operating or Founder’s Office roles, bringing their market breadth and investor relationships with them.',
    },
    {
      q: 'Which pays better, a Founder’s Office or venture capital?',
      a: 'It varies widely by company, fund and stage, so compare specific offers rather than the categories. Also weigh what each role teaches, since the skills you build early shape your later options.',
    },
  ],
};

export const marketplaceDueDiligence: Article = {
  slug: 'marketplace-startup-due-diligence-checklist',
  title: 'How to Evaluate a Marketplace Startup: An Operator’s Due Diligence Checklist',
  seoTitle: 'Marketplace Startup Due Diligence Checklist for Investors',
  description:
    'A due diligence checklist for marketplace startups from someone who ran one: supply, demand, reliability, unit economics and the metrics founders can dress up.',
  excerpt:
    'Marketplaces are supply problems wearing a demand costume. The questions I would ask a marketplace founder, learned from running one.',
  category: 'Venture Capital',
  keywords: [
    'marketplace due diligence',
    'how to evaluate a marketplace startup',
    'marketplace metrics',
    'startup due diligence checklist',
    'two-sided marketplace',
    'unit economics',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: 'Most marketplace pitches lead with demand: users, downloads, GMV. Those numbers are real and they are the easiest ones to buy. After running strategy and growth at ZenCabs, an EV ride-hailing marketplace in Jammu, the questions I care about most are further down the deck.',
    },
    {
      type: 'p',
      text: 'This is the checklist I would use to evaluate a marketplace, whether as an investor, an acquirer, or someone deciding whether to join one.',
    },

    { type: 'h2', text: 'Start with the constrained side' },
    {
      type: 'callout',
      text: 'Marketplaces are supply problems wearing a demand costume. Solve the constrained side first.',
    },
    {
      type: 'p',
      text: 'In almost every marketplace one side is harder to get and keep. For ride-hailing it is drivers and cars. A rider who opens the app to zero cars never opens it again, so demand spent before supply is ready is demand wasted. At ZenCabs we onboarded driver partners before pushing riders, and designed the recruitment, training and incentive frameworks to keep them.',
    },
    { type: 'p', text: '**Questions to ask:**' },
    {
      type: 'ul',
      items: [
        'Which side is constrained right now, and how do you know?',
        'What does it cost to add one unit of supply, and how long until it earns?',
        'What share of supply from six months ago is still active?',
        'What happens to supply earnings if demand dips for a month?',
      ],
    },

    { type: 'h2', text: 'Utilisation and supply productivity' },
    {
      type: 'p',
      text: 'If the company owns or finances supply, utilisation is the business. At ZenCabs every idle car was capital sitting still, and moving fleet utilisation from 40% to 75% lifted revenue per car to ₹62.5K a month. That move was worth more than any acquisition campaign we could have run with the same effort.',
    },
    {
      type: 'ul',
      items: [
        'What is utilisation today, and how has it moved month by month?',
        'What is revenue per unit of supply, and is it rising as the network grows?',
        'Does adding supply lower utilisation for everyone else? If so, how is growth paced?',
      ],
    },

    { type: 'h2', text: 'Reliability: the metric hiding in operations' },
    {
      type: 'p',
      text: 'Cancellations and failed transactions look like an operations problem. They are a retention problem. Every cancelled ride costs more than the acquisition that produced it, because the customer you paid for is now less likely to come back. At ZenCabs we cut cancellations from 40% to 6% by putting 10+ SOPs in across onboarding and dispatch.',
    },
    {
      type: 'ul',
      items: [
        'What share of requests end in a completed transaction?',
        'Who cancels more, buyers or sellers, and why?',
        'How does retention differ between customers whose first order went well and those whose did not?',
      ],
    },
    {
      type: 'p',
      text: 'In smaller markets especially, reliability often beats price. A ride that shows up is worth more than a discount. A founder who competes on reliability usually understands their market better than one who competes on subsidies.',
    },

    { type: 'h2', text: 'Demand quality, not just demand volume' },
    {
      type: 'p',
      text: 'Total users is the least informative number in the deck. What matters is how many come back. At ZenCabs, 27% of the user base converted into 6,679 monthly active riders, and I would always ask a founder for their version of that number before anything else about demand.',
    },
    {
      type: 'ul',
      items: [
        'What share of users transact in a typical month?',
        'How do monthly cohorts behave: does usage flatten, decline or grow?',
        'What share of new customers arrive without paid acquisition?',
        'How is demand split across customers? A few large buyers is a different business from many small ones.',
      ],
    },

    { type: 'h2', text: 'Unit economics that survive scrutiny' },
    {
      type: 'table',
      head: ['Metric', 'Why it matters', 'What to check'],
      rows: [
        ['GMV', 'Total value flowing through the platform', 'Is it growing through volume, price or subsidies?'],
        ['Take rate', 'The share of GMV the company keeps', 'Is it stable, and what stops it being competed down?'],
        ['Average order value', 'Revenue per transaction', 'Is it rising for real reasons, or because of mix?'],
        ['Contribution per transaction', 'What is left after direct costs and incentives', 'Is it positive without discounts?'],
        ['Payback on acquisition', 'How fast a new customer repays their cost', 'Measured on retained customers, not all sign-ups'],
      ],
    },
    {
      type: 'p',
      text: 'For reference, ZenCabs grew monthly GMV past ₹25L across 7,500+ rides at a ₹331 average order value. The GMV was the headline; the average order value and the ride count behind it were what showed the business was working.',
    },

    { type: 'h2', text: 'The metrics most often dressed up' },
    {
      type: 'ul',
      items: [
        '**Downloads and sign-ups** instead of active users.',
        '**GMV including heavy discounts** that will not survive the subsidy ending.',
        '**Supply “onboarded”** instead of supply active this month.',
        '**Blended retention** that hides a weak recent cohort behind a strong early one.',
        '**Annualised run-rate from one strong month.** Run-rate is a fair measure of momentum if the month is typical. Ask to see the months around it.',
      ],
    },

    { type: 'h2', text: 'How the team runs the business' },
    {
      type: 'p',
      text: 'Finally, ask how the founders know what is happening. A team that reviews its key numbers every week, with owners and thresholds, will find its problems in days. A team that looks monthly will find them a quarter late. At ZenCabs a weekly KPI review with the founder was the highest-leverage thing we built, and I explain how to run one in [The weekly operating cadence](/articles/weekly-operating-cadence-founders-office).',
    },
    {
      type: 'p',
      text: 'A useful last test comes from my [Push and Absorb framework](/articles/push-and-absorb-framework): ask the founder which slow, permanent change in their market worries them most. A strong founder answers at once. A weak one talks about competitors’ funding rounds.',
    },
  ],
  faq: [
    {
      q: 'What are the most important marketplace metrics?',
      a: 'The share of transactions that complete, active supply and its utilisation, repeat usage by monthly cohort, take rate, and contribution per transaction after incentives. Total users and GMV matter less than whether customers come back and whether each transaction makes money without subsidies.',
    },
    {
      q: 'Why is supply usually the hard side of a marketplace?',
      a: 'Because demand without supply is wasted: a buyer who finds nothing available rarely returns. Supply is often costlier to acquire and slower to earn, so strong marketplaces secure and retain the constrained side before scaling demand.',
    },
    {
      q: 'How do you spot inflated marketplace numbers?',
      a: 'Ask for active rather than registered users and suppliers, GMV with and without discounts, retention by cohort rather than blended, and the months around any run-rate figure.',
    },
  ],
};
