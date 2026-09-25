import type { Article } from '@/types';

/**
 * Founder's Office and Chief of Staff (FOCOS) articles.
 *
 * Every claim about Archit's own work is taken from content/projects.ts,
 * content/resume.ts or content/timeline.ts, the same verified source the AI
 * clone reads. General advice is written as opinion and carries no invented
 * statistics.
 */

export const whatIsFoundersOffice: Article = {
  slug: 'what-is-a-founders-office-role',
  title: 'What Is a Founder’s Office Role? What the Job Actually Involves',
  seoTitle: 'What Is a Founder’s Office Role? Job, Skills and Career Path',
  description:
    'What a Founder’s Office role really involves day to day, the skills it needs, how it is judged, and where it leads, from someone who built one at an EV startup.',
  excerpt:
    'The title means something different at every startup. Underneath, the job is always the same: take the problem that matters most this quarter and has no owner yet, and close it.',
  category: 'Founder’s Office',
  keywords: [
    'founder’s office role',
    'what is founder’s office',
    'founder’s office job description',
    'founder’s office associate',
    'founder’s office career',
    'startup generalist role',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: 'Ask five founders what their Founder’s Office does and you will get five answers. One means a single generalist who sits next to them. Another means a team of four running special projects. A third means the person who prepares the board deck. The title is loose because the need behind it is loose.',
    },
    {
      type: 'p',
      text: 'Underneath the variety, the job is the same everywhere. **A Founder’s Office takes the problem that matters most right now and has no owner yet, and closes it.** Then it takes the next one.',
    },
    {
      type: 'p',
      text: 'I built this layer at ZenCabs, an EV mobility venture in Jammu, as Head of Strategy and Growth. This is what the work looked like there and what I think it looks like anywhere.',
    },

    { type: 'h2', text: 'Why the role exists' },
    {
      type: 'p',
      text: 'A startup always has more important problems than people who own them. The founder can see all of them and can personally work on one or two. Functions like sales, operations and product each own their lane. The problems that fall between lanes, or that are too new to have a lane, pile up on the founder’s desk.',
    },
    {
      type: 'p',
      text: 'A Founder’s Office is how a founder extends their reach without hiring a full department for every new problem. It is borrowed authority applied to unowned problems.',
    },

    { type: 'h2', text: 'The four kinds of work' },
    {
      type: 'p',
      text: 'Most of what a Founder’s Office does falls into four buckets. The mix changes every quarter, which is the point.',
    },
    { type: 'h3', text: '1. Problems with no owner yet' },
    {
      type: 'p',
      text: 'A new city, a pricing change, a process that keeps breaking, a partnership nobody has time to structure. At ZenCabs the first of these was supply. A rider who opens the app to zero cars never opens it again, so driver partners had to come first. I designed the recruitment, training and incentive frameworks and onboarded 43 driver partners. Nobody else owned that problem when I started.',
    },
    { type: 'h3', text: '2. The operating cadence' },
    {
      type: 'p',
      text: 'Someone has to decide which numbers the company looks at, how often, and what happens when one goes red. At ZenCabs this became a weekly KPI review with the founder, tracking 15+ KPIs. It was the single most useful thing I built there, and I have written about [how to run a weekly operating cadence](/articles/weekly-operating-cadence-founders-office) separately.',
    },
    { type: 'h3', text: '3. Projects that become functions' },
    {
      type: 'p',
      text: 'Good Founder’s Office work often ends with a handover. You build something by hand until it works, then write it down and give it to a team. The 10+ SOPs we put in across onboarding and dispatch were exactly this: problems solved once, then turned into a way of working that did not need me in the room.',
    },
    { type: 'h3', text: '4. Founder leverage' },
    {
      type: 'p',
      text: 'Preparing decisions so the founder can make them in minutes instead of hours. Following up after meetings so what was agreed actually happens. Building the case for a big call, like the market sizing and expansion case that justified adding 10+ cars a month. This is the least visible work and it compounds.',
    },

    { type: 'h2', text: 'What the role is not' },
    {
      type: 'ul',
      items: [
        '**Not an executive assistant.** Calendar and inbox work may land on you in a small company, but if it is most of the job, the title is wrong.',
        '**Not an in-house consultant.** A recommendation is not the deliverable. The problem being closed is the deliverable. If you hand over a deck and walk away, you have done the easy half.',
        '**Not a permanent seat.** The best Founder’s Office roles are a tour of duty. You rotate through problems, and eventually one of them becomes yours to run as a function.',
      ],
    },

    { type: 'h2', text: 'The skills that matter' },
    {
      type: 'table',
      head: ['Skill', 'What it looks like in the job', 'How to show it before you have the job'],
      rows: [
        ['Structuring a vague problem', 'Turning “growth is slow” into three questions with owners', 'A written teardown of the company’s biggest problem'],
        ['Working with numbers', 'Building the model behind a pricing or expansion call', 'A clear, sourced sizing of one market'],
        ['Writing', 'One page the founder can decide from in five minutes', 'Anything you have published, including a long post'],
        ['Execution without authority', 'Getting function heads to act on something they do not own', 'A project you ran where nobody reported to you'],
        ['Comfort with unglamorous work', 'Calling fifty drivers in a week because supply is the bottleneck', 'Past work where you did the boring part yourself'],
      ],
    },
    {
      type: 'p',
      text: 'The last row matters more than people expect. The problems that reach a Founder’s Office are often unowned because they are unpleasant. Being willing to do the unpleasant part yourself is most of the job’s credibility.',
    },

    { type: 'h2', text: 'How the role is judged' },
    {
      type: 'p',
      text: 'By problems closed, not activity. A good test at the end of any quarter: list the three things that are true now that were not true before you arrived, with a number next to each. At ZenCabs that list included cancellations falling from 40% to 6% and fleet utilisation rising from 40% to 75%. Those were team results, and the Founder’s Office’s part was making sure they were measured, reviewed every week and owned by someone.',
    },
    {
      type: 'p',
      text: 'Before starting any change, it helps to write down what will make you stop. My [Push and Absorb framework](/articles/push-and-absorb-framework) calls this a stop rule, and it is the habit I would most want in anyone working in a founder’s office.',
    },

    { type: 'h2', text: 'Where it leads' },
    {
      type: 'p',
      text: 'Because the role touches every function, it is one of the best places to find out what you are good at. The common paths out are an operating role you built into (head of growth, strategy or operations), a general manager seat for a new business line, starting your own company, or moving to the investing side. I compare the last two in [Founder’s Office or venture capital: which first?](/articles/founders-office-or-venture-capital).',
    },
    {
      type: 'p',
      text: 'If you are weighing the role against a Chief of Staff position, the two overlap but are not the same. I lay out the differences in [Founder’s Office vs Chief of Staff](/articles/founders-office-vs-chief-of-staff).',
    },
  ],
  faq: [
    {
      q: 'What does a Founder’s Office associate do?',
      a: 'They work directly with the founder on the problems that matter most and have no owner yet: a new market, a pricing change, a broken process. They also run the operating cadence, turn solved problems into repeatable processes, and prepare decisions for the founder.',
    },
    {
      q: 'Is a Founder’s Office role good for your career?',
      a: 'It is one of the fastest ways to see every part of a business and to find out what you are good at. The risk is staying a generalist for too long. The best roles end with you owning one of the problems as a function.',
    },
    {
      q: 'Do you need an MBA for a Founder’s Office role?',
      a: 'No. Founders hire for evidence that you can take a vague problem and close it. A degree can help you get the conversation, but proof of ownership, such as a project you ran or a business you built, carries more weight in the interview.',
    },
    {
      q: 'How is a Founder’s Office different from a Chief of Staff?',
      a: 'A Chief of Staff usually extends the CEO’s reach across an existing leadership team: planning, meetings, follow-through. A Founder’s Office usually builds things that do not exist yet, and is more common at earlier-stage startups. In small companies the two often merge.',
    },
  ],
};

export const foundersOfficeVsChiefOfStaff: Article = {
  slug: 'founders-office-vs-chief-of-staff',
  title: 'Founder’s Office vs Chief of Staff: How the Two Roles Really Differ',
  seoTitle: 'Founder’s Office vs Chief of Staff: Key Differences',
  description:
    'Founder’s Office vs Chief of Staff: what each role does, the stage each suits, how each is judged, and how to tell which one a job posting is really describing.',
  excerpt:
    'Both roles sit next to the founder. One builds what does not exist yet; the other makes the existing leadership team move as one. Here is how to tell them apart.',
  category: 'Founder’s Office',
  keywords: [
    'founder’s office vs chief of staff',
    'chief of staff startup',
    'chief of staff role',
    'what does a chief of staff do',
    'founder’s office role',
    'FOCOS',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: 'Founder’s Office and Chief of Staff roles get listed together so often that people treat them as one job. They share a lot. Both sit next to the person running the company, both borrow authority rather than holding it, and both are judged on what changes because they were there.',
    },
    {
      type: 'p',
      text: 'They differ in direction. **A Founder’s Office mostly builds what does not exist yet. A Chief of Staff mostly makes what already exists move as one.** Everything else follows from that.',
    },

    { type: 'h2', text: 'Side by side' },
    {
      type: 'table',
      head: ['', 'Founder’s Office', 'Chief of Staff'],
      rows: [
        ['Main job', 'Close unowned problems and build new things', 'Extend the leader’s reach across the leadership team'],
        ['Typical company stage', 'Early, before most functions have leaders', 'Later, once there is a leadership team to coordinate'],
        ['Typical work', 'New markets, pricing, supply, special projects, the first version of a process', 'Planning cycles, leadership meetings, board preparation, decision follow-through'],
        ['Shape of the team', 'Often several people on separate projects', 'Usually one person'],
        ['Judged on', 'Problems closed and functions handed over', 'Decisions made faster and executed without drift'],
        ['What you learn', 'How each part of a business works, by doing it', 'How a leadership team actually decides'],
        ['Common next step', 'Owning a function you built, or founding', 'An operating leadership role, often COO track'],
      ],
    },
    {
      type: 'p',
      text: 'These are tendencies, not rules. In a twenty-person startup one person does both, and the title depends on which word the founder likes.',
    },

    { type: 'h2', text: 'What a Founder’s Office day looks like' },
    {
      type: 'p',
      text: 'Most of the time is spent inside one or two problems. You are talking to customers or suppliers, building the model, writing the proposal, and then running the first version yourself. I wrote about this work in detail in [What is a Founder’s Office role?](/articles/what-is-a-founders-office-role).',
    },
    {
      type: 'p',
      text: 'At ZenCabs the problems were concrete: onboard driver partners, cut cancellations, raise utilisation on an owned EV fleet. Each one had a number, and each had to be solved by hand before it could be handed to a team.',
    },

    { type: 'h2', text: 'What a Chief of Staff day looks like' },
    {
      type: 'p',
      text: 'Most of the time is spent between people. You are preparing the leadership meeting, making sure last week’s decisions were acted on, noticing that two teams are about to build the same thing, and writing the update the CEO will send. The work is coordination, and done well it makes a leadership team faster than the sum of its members.',
    },
    {
      type: 'p',
      text: 'The closest I have come to this half of the job was at PwC India, where I designed delegation-of-authority matrices and approval workflows for CXOs and cut decision turnaround by 30%+. That is Chief of Staff work in its purest form: nobody’s output changed, but decisions stopped waiting in queues.',
    },

    { type: 'h2', text: 'Where they overlap' },
    {
      type: 'p',
      text: 'The operating cadence belongs to both. Someone has to decide which numbers leadership reviews and what happens when one goes red. At ZenCabs I ran a weekly KPI review with the founder across 15+ KPIs, which is textbook Chief of Staff work inside a Founder’s Office role. I explain how I would set one up in [The weekly operating cadence](/articles/weekly-operating-cadence-founders-office).',
    },

    { type: 'h2', text: 'How to tell which one a job really is' },
    { type: 'p', text: 'Titles lie. These tell you more:' },
    {
      type: 'ul',
      items: [
        '**Read the verbs in the job description.** “Launch, own, build, run” describes a Founder’s Office. “Align, coordinate, prepare, drive alignment” describes a Chief of Staff.',
        '**Ask what you will have shipped in ninety days.** A Founder’s Office answer names an outcome, like a new city live. A Chief of Staff answer names a system, like a planning process running.',
        '**Ask which meetings you will run.** If the answer is the leadership meeting, it is a Chief of Staff role whatever it is called.',
        '**Ask who has held it before and where they went.** Past holders who now run functions suggest a Founder’s Office. Past holders who moved into operating leadership suggest a Chief of Staff.',
      ],
    },

    { type: 'h2', text: 'Which one should you take?' },
    {
      type: 'p',
      text: 'Earlier in your career, a Founder’s Office usually teaches more, because you do each piece of the business yourself. A Chief of Staff role pays off most once you already understand functions well enough to coordinate them, because the job is judging their work rather than doing it.',
    },
    {
      type: 'p',
      text: 'There is a way to frame this with my [Push and Absorb framework](/articles/push-and-absorb-framework). A Founder’s Office spends most of its time in Push: it holds the lever on a specific problem and makes a change. A Chief of Staff spends more time helping a leadership team decide which pushes to make, and making sure they happen. Both are valuable. Pick the one whose daily work you want to be very good at in five years.',
    },
    {
      type: 'p',
      text: 'If you are trying to get into either, I have written a practical guide on [how to get a Founder’s Office job](/articles/how-to-get-a-founders-office-job).',
    },
  ],
  faq: [
    {
      q: 'Is a Chief of Staff senior to a Founder’s Office associate?',
      a: 'Usually, though not always. Chief of Staff roles tend to appear at later-stage companies and often go to people with more experience, because the job involves coordinating an existing leadership team. Founder’s Office roles range from fresh graduates to senior operators.',
    },
    {
      q: 'What does FOCOS stand for?',
      a: 'FOCOS is shorthand for Founder’s Office and Chief of Staff roles, the family of jobs that work directly with a founder or CEO on whatever matters most.',
    },
    {
      q: 'Can one person be both Founder’s Office and Chief of Staff?',
      a: 'Yes, especially in small startups. One person may run the weekly leadership review, which is Chief of Staff work, while also launching a new market, which is Founder’s Office work.',
    },
  ],
};

export const howToGetFoundersOfficeJob: Article = {
  slug: 'how-to-get-a-founders-office-job',
  title: 'How to Get a Founder’s Office Job, Especially From Consulting',
  seoTitle: 'How to Get a Founder’s Office Job: Interview and Case Prep',
  description:
    'How to get a Founder’s Office or Chief of Staff job: what founders hire for, how to reframe a consulting CV, how to prepare for the case round, and red flags to avoid.',
  excerpt:
    'Founders do not hire the best CV. They hire the person most likely to take a vague problem off their desk and close it. Here is how to show that.',
  category: 'Founder’s Office',
  keywords: [
    'how to get a founder’s office job',
    'founder’s office interview',
    'founder’s office case study',
    'consulting to startup',
    'chief of staff interview questions',
    'founder’s office for freshers',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: 'I have come to Founder’s Office work from both directions: from building my own consulting and marketing agency, Cairros, at college, and from fifteen months of risk consulting at PwC India before I ran strategy and growth at ZenCabs. Both routes work. Both need translating before a founder will listen.',
    },
    {
      type: 'p',
      text: 'This guide covers what founders are actually hiring for, how to reframe your background, and how to handle the case round that almost every Founder’s Office process includes.',
    },

    { type: 'h2', text: 'What founders are actually hiring for' },
    {
      type: 'p',
      text: 'One thing: **will this person take a problem off my desk and close it without me having to manage them?** Pedigree, polish and frameworks are all proxies for that. The strongest candidates skip the proxies and show the thing itself.',
    },
    { type: 'p', text: 'In practice founders look for three signals:' },
    {
      type: 'ol',
      items: [
        '**Ownership.** Have you been responsible for an outcome, not just a piece of analysis? A business you ran, a number you moved, a project nobody told you to start.',
        '**Speed with judgement.** Can you move fast without breaking things you cannot fix? This is about knowing which decisions are cheap to undo and which are not.',
        '**Low ego about the work.** Will you do the unglamorous part yourself when it is the bottleneck?',
      ],
    },

    { type: 'h2', text: 'If you are coming from consulting' },
    { type: 'p', text: 'Consulting gives you real advantages. It also trains habits a founder will want to see you drop.' },
    {
      type: 'table',
      head: ['What transfers', 'What you have to unlearn'],
      rows: [
        ['Structuring messy problems quickly', 'Treating the recommendation as the finish line'],
        ['Diagnosing root causes from data', 'Waiting for complete data before acting'],
        ['Communicating with senior people', 'Long decks when one page would do'],
        ['Working across functions', 'Relying on the client’s team to execute'],
      ],
    },
    {
      type: 'p',
      text: 'The fix is in how you describe your work. Lead with what changed, then how. At PwC, the line I would lead with is not that I ran diagnostics. It is that engagements I worked on delivered ₹6+ Cr in annual client cost savings, and that I co-developed an internal audit AI tool that saved 10,000+ consulting hours across 200+ consultants. The second one matters more for a Founder’s Office, because it is something I built and drove to adoption, not something I advised on.',
    },
    {
      type: 'p',
      text: 'Go through your CV and ask of every line: did I own this outcome, or did I contribute analysis to someone else’s? Keep the first kind. Rewrite the second kind to show the part you owned.',
    },

    { type: 'h2', text: 'If you are coming from elsewhere' },
    {
      type: 'ul',
      items: [
        '**Ex-founders, including small ones.** A business you ran, however small, is the strongest ownership signal there is. Starting Cairros in my second year of college and scaling it to seven-figure annual revenue in two years taught me more about owning outcomes than anything else. Talk about what went wrong, not just the revenue.',
        '**Growth, operations or sales.** You already own numbers. Show the breadth: where did your work touch product, finance or hiring?',
        '**Students and freshers.** You will not have big outcomes yet, so make the proof yourself. The next section is for you.',
      ],
    },

    { type: 'h2', text: 'Build proof before you apply' },
    {
      type: 'p',
      text: 'The single best thing you can send a founder is a short piece of work on their company. Not a pitch about yourself. A page on their problem.',
    },
    {
      type: 'ol',
      items: [
        '**Pick one real problem.** Use the product, read reviews, talk to two customers if you can. Find the thing that is clearly hurting.',
        '**Define it properly.** What moves and by how much, who is better off, who pays, by when. These are the four questions from the Define step of my [Push and Absorb framework](/articles/push-and-absorb-framework), and they turn a vague idea into a plan.',
        '**Say what you would do on Monday.** A first step small enough to start this week, and the early number that would tell you it is working.',
        '**Keep it to one page.** Being able to write one page a founder can decide from is itself the audition.',
      ],
    },

    { type: 'h2', text: 'The interview process' },
    {
      type: 'p',
      text: 'Processes vary, but most include a conversation with the founder, a case or take-home assignment built on a real company problem, and sometimes a short paid work trial. The case is usually where the decision gets made.',
    },
    { type: 'h3', text: 'Questions you should be ready for' },
    {
      type: 'ul',
      items: [
        '“Our main metric dropped last month. Walk me through your first two weeks.”',
        '“We want to launch in a new city. How would you decide whether to, and how would you run it?”',
        '“Tell me about something you owned that failed. What would you do differently?”',
        '“Here is our pricing. What would you change and what could go wrong?”',
        '“What is the one thing you would fix first if you joined tomorrow?”',
      ],
    },
    { type: 'h3', text: 'How to answer a case well' },
    {
      type: 'p',
      text: 'Start by asking what the founder already knows, so you do not spend ten minutes rediscovering it. Then separate what the company controls from what it does not. A demand drop caused by a competitor’s discount needs a different answer from one caused by your own cancellations.',
    },
    {
      type: 'p',
      text: 'For anything you propose, name who pays for it and what it might break. The four places a change usually breaks something are capacity, incentives, expectations and competitor response. Checking each by name sounds like someone who has run things, because it is what people who have run things do.',
    },
    {
      type: 'p',
      text: 'End with a measure and a stop rule: the early number you would watch, and the result that would make you reverse course. Almost nobody does this in a case round. It is the clearest signal that you think like an owner.',
    },

    { type: 'h2', text: 'Red flags in a Founder’s Office role' },
    {
      type: 'ul',
      items: [
        '**No real time with the founder.** If you will report to someone three levels down, it is a generalist role with a borrowed title.',
        '**“You will do everything.”** Every Founder’s Office does a lot. A good one still has this quarter’s top two problems named.',
        '**No path to owning something.** Ask what past holders own now. If the answer is nothing, the role does not grow.',
        '**Nobody can say what success looks like.** If the founder cannot describe a good first ninety days, you will spend them guessing.',
      ],
    },
    {
      type: 'p',
      text: 'Once you are in, the first three months set the tone. I wrote a practical plan for [your first 90 days in a Founder’s Office](/articles/first-90-days-founders-office).',
    },
  ],
  faq: [
    {
      q: 'Can a fresher get a Founder’s Office job?',
      a: 'Yes. Many startups hire graduates into Founder’s Office roles. Without big past outcomes, the best way in is proof you create yourself: a sharp one-page analysis of a real problem at the company you are applying to, plus anything you have built or run.',
    },
    {
      q: 'What is asked in a Founder’s Office interview?',
      a: 'Expect a founder conversation about ownership and failures, and a case built on a real company problem such as a metric drop, a pricing change or a new market launch. Strong answers separate what the company controls from what it does not, name who pays for a change, and end with a measure and a stop rule.',
    },
    {
      q: 'Is consulting a good route into a Founder’s Office?',
      a: 'It is a common and good route, because consulting trains structuring, diagnosis and senior communication. The work is in showing that you can own an outcome and execute, not only recommend.',
    },
  ],
};

export const weeklyOperatingCadence: Article = {
  slug: 'weekly-operating-cadence-founders-office',
  title: 'The Weekly Operating Cadence: The Most Useful Thing a Founder’s Office Builds',
  seoTitle: 'How to Run a Weekly Operating Review (KPI Cadence Guide)',
  description:
    'How to design a weekly operating review that surfaces problems in days: choosing KPIs, setting thresholds, running the meeting, and the mistakes that kill cadences.',
  excerpt:
    'At ZenCabs, the highest-leverage thing I built was not a strategy. It was a weekly review with the founder. Here is how to design one that works.',
  category: 'Founder’s Office',
  keywords: [
    'weekly operating review',
    'operating cadence',
    'KPI review meeting',
    'startup KPIs',
    'founder’s office',
    'weekly business review template',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: 'When people ask what I did as Head of Strategy and Growth at ZenCabs, they expect to hear about a growth campaign. The honest answer is a meeting. A weekly KPI review with the founder, tracking 15+ KPIs, was the single highest-leverage thing I built there. Not a deck. A cadence.',
    },
    {
      type: 'p',
      text: 'In the months it ran, cancellations fell from 40% to 6% and fleet utilisation rose from 40% to 75%. The review did not cause those moves. The team did. What the review did was make sure each number was seen every week, owned by one person, and acted on while the problem was still small.',
    },

    { type: 'h2', text: 'Why a cadence beats a dashboard' },
    {
      type: 'p',
      text: 'A dashboard is information waiting for someone to look at it. A cadence is a promise that someone will, on a fixed day, and that a red number will produce a decision before the meeting ends.',
    },
    {
      type: 'p',
      text: 'The difference is timing. Without a cadence, problems surface when they become impossible to ignore, which is usually a quarter late. With one, they surface within a week. In a startup that difference is often the whole game.',
    },

    { type: 'h2', text: 'Step 1: pick the number the business actually runs on' },
    {
      type: 'p',
      text: 'Every cadence needs one number at the top that everything else explains. Choosing it is a strategic decision, not a reporting one.',
    },
    {
      type: 'p',
      text: 'At ZenCabs the obvious choice was ride count. The right choice was utilisation. On an owned EV fleet every idle car is capital sitting still, so revenue per car is what compounds. Moving utilisation from 40% to 75% was worth more than any acquisition campaign we could have run with the same effort, and choosing it as the top number is what made the rest of the review make sense.',
    },
    {
      type: 'p',
      text: 'Ask: if this number goes up and nothing else changes, is the business clearly better? If the answer needs caveats, pick another number.',
    },

    { type: 'h2', text: 'Step 2: build the tree underneath it' },
    {
      type: 'p',
      text: 'Break the top number into the few things that drive it, then break those down once more. Stop when each number has one obvious owner.',
    },
    {
      type: 'table',
      head: ['Level', 'Example from a ride-hailing marketplace', 'Who owns it'],
      rows: [
        ['Top number', 'Fleet utilisation', 'The founder'],
        ['Drivers', 'Driver hours available, rides requested, rides completed', 'Supply and demand leads'],
        ['Inputs', 'Driver partners onboarded, cancellation rate, repeat riders', 'The person running each process'],
        ['Guardrails', 'Rider complaints, driver churn', 'Whoever would be tempted to trade them away'],
      ],
    },
    {
      type: 'p',
      text: 'Guardrails are the part most people leave out. Any number people are judged on will get gamed. If the team is chasing completed rides, you also need to watch complaints and driver churn, or you will hit the target and damage the business.',
    },

    { type: 'h2', text: 'Step 3: give every number a threshold' },
    {
      type: 'p',
      text: 'A number with no threshold next to it is decoration. For each metric, write down the level that counts as on track and the level that forces a conversation. This is what lets the meeting skip everything that is fine.',
    },
    {
      type: 'p',
      text: 'The three tests I use for any metric come from the Measure step of my [Push and Absorb framework](/articles/push-and-absorb-framework): **it moves early** (a number that moves after the outcome is a report card), **it survives being gamed** (or is paired with a guardrail that catches the abuse), and **it has a threshold attached**.',
    },

    { type: 'h2', text: 'Step 4: run the meeting the same way every week' },
    {
      type: 'table',
      head: ['Segment', 'Time', 'What happens'],
      rows: [
        ['Numbers against thresholds', '10 min', 'Read the one-page sheet. Only red and amber items get discussed.'],
        ['Red items', '25 min', 'For each: what happened, why, what we will do, who owns it, by when.'],
        ['Stop-rule checks', '10 min', 'Any change we made with a written stop rule: has it been triggered? If so, reverse it.'],
        ['The slow list', '10 min', 'Anything getting slightly worse every week. This is where the dangerous problems hide.'],
        ['Decisions log', '5 min', 'Read back every decision and owner. Send it within the hour.'],
      ],
    },
    {
      type: 'p',
      text: 'The slow list deserves a word. Fast problems get attention on their own. A number that slips a little every week never feels urgent on any single day, which is exactly why it needs a standing slot. My framework calls these slow and permanent forces, and they are what actually kill companies.',
    },

    { type: 'h2', text: 'Step 5: one page, same shape, every week' },
    {
      type: 'p',
      text: 'The written artefact matters as much as the meeting. One page, with the same metrics in the same order, showing this week, last week, the four-week trend and the threshold. Consistency is what lets the founder read it in two minutes and spot the one thing that changed.',
    },
    {
      type: 'p',
      text: 'Resist redesigning it. Every change to the format costs a week of people relearning where to look.',
    },

    { type: 'h2', text: 'Mistakes that kill a cadence' },
    {
      type: 'ul',
      items: [
        '**Discussing every number.** Track as many as you need; discuss only the red ones. At ZenCabs we tracked 15+ KPIs and talked about a handful each week.',
        '**Reviewing only lagging numbers.** Monthly revenue tells you what already happened. You need the numbers that move first.',
        '**Actions with no owner.** “We should look into this” is not an action. A name and a date is.',
        '**Skipping weeks when things are going well.** That is when the slow problems grow.',
        '**Letting it become a status meeting.** If people are presenting what they did, the meeting has lost its purpose. It exists to make decisions about numbers.',
      ],
    },

    { type: 'h2', text: 'Who should own it' },
    {
      type: 'p',
      text: 'In an early startup, the Founder’s Office or Chief of Staff is the natural owner. The role touches every function, has the founder’s time, and does not own any single number, which makes it the most neutral person to run the review. I wrote more about this in [Founder’s Office vs Chief of Staff](/articles/founders-office-vs-chief-of-staff).',
    },
    {
      type: 'p',
      text: 'If you are starting a new Founder’s Office role, setting up this cadence is one of the best things you can do in your first month. It forces you to learn the business through its numbers and gives you a reason to talk to every function. There is more on that in [your first 90 days in a Founder’s Office](/articles/first-90-days-founders-office).',
    },
  ],
  faq: [
    {
      q: 'How many KPIs should a weekly review track?',
      a: 'Track as many as you need to explain the top number and its guardrails, but only discuss the ones outside their threshold. At ZenCabs the review tracked 15+ KPIs, and each meeting focused on the few that were red or amber.',
    },
    {
      q: 'What is a guardrail metric?',
      a: 'A number you watch to make sure the team is not hitting its target in a way that damages the business. If a team is judged on completed rides, rider complaints and driver churn act as guardrails.',
    },
    {
      q: 'How long should a weekly operating review be?',
      a: 'About an hour works for most early-stage companies: a few minutes on the numbers sheet, most of the time on red items, and short segments for stop-rule checks, slowly worsening numbers, and a read-back of decisions and owners.',
    },
  ],
};

export const first90DaysFoundersOffice: Article = {
  slug: 'first-90-days-founders-office',
  title: 'Your First 90 Days in a Founder’s Office or Chief of Staff Role',
  seoTitle: 'First 90 Days in a Founder’s Office Role: A Practical Plan',
  description:
    'A practical 30-60-90 day plan for a new Founder’s Office or Chief of Staff hire: learning the business, earning trust, owning a first problem, and handing it off.',
  excerpt:
    'You arrive with borrowed authority and no lane of your own. The first ninety days decide whether the borrowing turns into trust.',
  category: 'Founder’s Office',
  keywords: [
    'first 90 days founder’s office',
    '30 60 90 day plan chief of staff',
    'new founder’s office hire',
    'chief of staff first 90 days',
    'startup onboarding plan',
  ],
  published: '2026-09-25',
  blocks: [
    {
      type: 'p',
      text: 'A new Founder’s Office hire starts in an odd position. You have the founder’s ear and nobody reporting to you. Every function head is wondering whether you are there to help them or to audit them. Whatever authority you have is borrowed, and the first ninety days decide whether it turns into trust.',
    },
    {
      type: 'p',
      text: 'This is the plan I would follow, based on building the founder’s-office layer at ZenCabs and on what I learned about working inside other people’s organisations as a consultant.',
    },

    { type: 'h2', text: 'Before day one: agree what success looks like' },
    {
      type: 'p',
      text: 'Ask the founder one question before you start: at the end of ninety days, what would make you say this hire was clearly worth it? Write the answer down and send it back. If they cannot answer, help them. You will spend the quarter guessing otherwise.',
    },

    { type: 'h2', text: 'Days 1 to 30: learn the business through its numbers and its people' },
    {
      type: 'ul',
      items: [
        '**Get the numbers first.** Find out which metrics the company runs on and where they live. If there is no weekly review, that gap is probably your first project. I explain how to build one in [The weekly operating cadence](/articles/weekly-operating-cadence-founders-office).',
        '**Meet every function head, and listen.** Ask each one what is slowing them down and what they wish the founder knew. Do not propose anything yet.',
        '**Do the frontline work once.** Take the support calls, ride along, sit with sales. In a marketplace, the people on the supply side will tell you things no spreadsheet shows.',
        '**Map who decides what.** For the problems you will touch, find out who can actually authorise a change. A lever you have identified but cannot authorise is a request, and it runs on a different timeline.',
      ],
    },
    {
      type: 'p',
      text: 'By day thirty you should be able to explain, on one page, how the business makes money, where it is constrained right now, and which two problems matter most.',
    },

    { type: 'h2', text: 'Days 31 to 60: own one problem end to end' },
    {
      type: 'p',
      text: 'Pick one of those two problems and take it completely. Choose one where the path from action to result is short, so you get an answer fast. A change you can make directly beats one that depends on persuading many people.',
    },
    {
      type: 'p',
      text: 'Write the change down properly before you start. What moves and by how much, who is better off, who pays for it, and by when. Then write the result that would make you stop. These come from the Push half of my [Push and Absorb framework](/articles/push-and-absorb-framework), and they protect you from the most common new-hire mistake: launching something vague and defending it past the point of evidence.',
    },
    {
      type: 'p',
      text: 'At ZenCabs the first problem was supply. We could not grow riders without cars on the road, so I built the recruitment, training and incentive frameworks for driver partners before anything else. It was not glamorous, and it was clearly the bottleneck. That combination is usually the right first problem.',
    },

    { type: 'h2', text: 'Days 61 to 90: hand it off and pick the next one' },
    {
      type: 'p',
      text: 'The goal is not to keep the problem. It is to make it not need you. Turn what worked into a written process, give it an owner and a number, and step back. At ZenCabs this became the 10+ SOPs across onboarding and dispatch that attacked cancellations.',
    },
    {
      type: 'p',
      text: 'Then go back to the founder with three things: what changed, with a number; what you learned about the business; and what you think the next most important unowned problem is. That conversation sets up your second quarter.',
    },

    { type: 'h2', text: 'How to work with the founder' },
    {
      type: 'ul',
      items: [
        '**A fixed weekly one-on-one.** Bring a written list: decisions you need, things you are worried about, what you will do next week.',
        '**Disagree in private, align in public.** Your usefulness depends on function heads trusting that you represent the founder faithfully.',
        '**Protect their time, not just your projects.** Some of the best work is taking a decision that has been sitting on their desk and preparing it so they can make it in five minutes.',
      ],
    },

    { type: 'h2', text: 'Mistakes to avoid' },
    {
      type: 'ul',
      items: [
        '**Becoming the founder’s inbox.** Being useful for small things is fine. Being only useful for small things is how the role shrinks.',
        '**Building dashboards nobody reads.** A dashboard without a meeting attached is a report nobody asked for.',
        '**Fighting function heads.** You have no authority of your own. Win them over by making their problems smaller.',
        '**Trying to fix everything.** Two problems closed beat ten problems started.',
      ],
    },
    {
      type: 'p',
      text: 'If you have not landed the role yet, start with [how to get a Founder’s Office job](/articles/how-to-get-a-founders-office-job).',
    },
  ],
  faq: [
    {
      q: 'What should a new Founder’s Office hire do in the first month?',
      a: 'Learn the business through its numbers and its people: find the metrics it runs on, meet every function head, do some frontline work yourself, and map who can authorise changes. By day thirty you should be able to name the two problems that matter most.',
    },
    {
      q: 'How do you earn trust as a new Chief of Staff?',
      a: 'By making other people’s problems smaller rather than auditing them, representing the founder faithfully, disagreeing in private, and closing one visible problem with a clear result within your first two months.',
    },
    {
      q: 'What is a good first project for a Founder’s Office?',
      a: 'A problem that is clearly the company’s current bottleneck and where the path from action to result is short, so you learn quickly whether it is working. Setting up a weekly operating review is also a strong first project if the company has none.',
    },
  ],
};
