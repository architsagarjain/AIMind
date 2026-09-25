import type { Article } from '@/types';

/**
 * Archit's own framework, transcribed from his paper of the same name
 * (20 September 2026). The wording is his; only the structure is adapted for
 * the web: tables stay tables, and the three diagrams are redrawn as SVG.
 */
export const pushAndAbsorb: Article = {
  slug: 'push-and-absorb-framework',
  title: 'Push and Absorb: A Framework for Making Change and Meeting It',
  seoTitle: 'Push and Absorb: A Change Management Framework',
  description:
    'Push and Absorb, a decision framework by Archit Sagar Jain: one method for changes you start, a mirrored one for changes that arrive, and the bridges between them.',
  excerpt:
    'Whatever you are forced to deal with was, at some point, something somebody else chose to do. A framework in two mirrored halves: one for change you start, one for change that arrives.',
  category: 'Framework',
  keywords: [
    'Push and Absorb framework',
    'change management framework',
    'decision making framework',
    'strategy framework',
    'how to handle change in business',
    'stop rule',
    'leading indicators',
    'Archit Sagar Jain',
  ],
  published: '2026-09-20',
  featured: true,
  blocks: [
    { type: 'h2', text: 'The idea in one sentence' },
    {
      type: 'callout',
      text: 'Whatever you are forced to deal with was, at some point, something somebody else chose to do.',
    },
    {
      type: 'p',
      text: 'A fuel price rise is a decision taken in a ministry. A rival’s discount is a decision taken in a boardroom. A new rule is a decision taken by a regulator. None of it fell out of the sky. It reached you as a condition, and it left somebody else’s desk as a choice.',
    },
    {
      type: 'p',
      text: 'This runs both ways. The change you make this quarter lands on a supplier, a worker or a customer as a condition they did not pick.',
    },
    { type: 'p', text: 'So handling change is two skills, and they mirror each other.' },
    {
      type: 'table',
      head: ['', 'Push', 'Absorb'],
      rows: [
        ['Who caused it', 'You', 'Someone else'],
        ['Who holds the lever', 'You', 'A market, a rival, a regulator'],
        ['The hard question', 'What will this break?', 'What can I still control?'],
        ['Good work looks like', 'Nothing unexpected breaks', 'You saw it early and had already decided'],
      ],
    },
    {
      type: 'p',
      text: 'The vocabulary is the same in both columns and the direction of travel is opposite. Run them as one exercise and you get a checklist that fits every situation and settles none of them.',
    },
    {
      type: 'p',
      text: 'The practical aim is to spend more of your working life in the left column. Every firm does some of both. The strong ones have shifted the ratio.',
    },

    { type: 'h2', text: 'The first question: do I hold the lever?' },
    { type: 'p', text: 'Before any analysis, ask whether this change is yours to make or yours to take.' },
    {
      type: 'ul',
      items: [
        '**Yes, I hold it.** Run Push.',
        '**No, somebody else holds it.** Run Absorb.',
        '**Partly.** Split the situation in two and run one framework on each half.',
      ],
    },
    { type: 'figure', figure: 'lever', caption: 'The routing question comes before any analysis.' },
    {
      type: 'p',
      text: 'A lever here means a decision you can take and act on this week. Price, staffing, incentives, what you sell, where you sell it. Things you only influence, like what people think of you, do not count.',
    },
    {
      type: 'p',
      text: 'When the answer is “partly”, split the situation before you go any further. Milk prices rising is not mine. What I charge for tea is mine. Two problems, two methods.',
    },
    {
      type: 'p',
      text: 'Mixing them fails in two directions. You treat a decision you could simply take as something to be managed, and lose a quarter to meetings. Or you treat a market force as something to be fought, and spend money on a battle you were never going to win.',
    },
    {
      type: 'p',
      text: 'Answer the lever question honestly rather than hopefully. Plenty of things people call uncontrollable are only uncomfortable, and plenty of things people claim to control belong to somebody senior to them.',
    },

    { type: 'h2', text: 'Framework A. Push: change you start' },
    { type: 'p', text: 'Four moves, in order: define, trace, commit, measure. Then start again.' },

    { type: 'h3', text: '1. Define the change' },
    {
      type: 'p',
      text: 'A real change answers four questions. If you cannot answer all four, what you have is an intention.',
    },
    {
      type: 'table',
      head: ['The question', 'A weak answer', 'A strong answer'],
      rows: [
        ['What moves, and by how much?', '“Improve retention”', 'Staff leaving each month falls from 9% to 5%'],
        ['Who is better off?', '“The company”', 'The owner’s margin'],
        ['Who pays for it?', 'Left blank, which is where most plans stop', 'Students, about ₹5 a cup'],
        ['By when?', '“Soon”', 'The first of next month'],
      ],
    },
    {
      type: 'p',
      text: 'Write it as one sentence. Move X from A to B, for these people, paid for by these people, by this date.',
    },
    { type: 'p', text: 'The rule that does the most work in this document:' },
    {
      type: 'quote',
      text: 'Good and bad are not properties of a change. They are properties of three things together: the change, the person you are asking about, and how far ahead you look.',
    },
    {
      type: 'p',
      text: 'Cutting a staff bonus is good for this month’s margin, bad for next quarter’s staffing, and bad for the staff on every horizon. All three are true at once. A change becomes “good” only once you have said whose seat you are sitting in and what you are trading away.',
    },
    {
      type: 'p',
      text: 'Arguments about whether a change is good usually skip both of those, which is why they go nowhere.',
    },

    { type: 'h3', text: '2. Trace what it touches' },
    {
      type: 'p',
      text: 'First, how does the change travel? Your decision rarely touches the result directly, and the path is where changes die.',
    },
    {
      type: 'table',
      head: ['How the change travels', 'What has to happen before anything moves', 'How often it works'],
      rows: [
        ['You act directly', 'You change the price yourself and the number moves', 'Usually'],
        ['Through somebody else', 'A partner, a dealer, a worker or an app has to act first', 'Sometimes'],
        ['Through what people believe', 'Somebody has to change their mind, and only then act', 'Rarely, and slowly'],
      ],
    },
    {
      type: 'p',
      text: 'Paths that run through belief fail quietly. Nobody tells you it did not work. The number simply never moves.',
    },
    {
      type: 'p',
      text: 'Second, what gets knocked over? “Think about knock-on effects” gives you nothing to do. There are four channels a knock-on travels through, and you can check each one by name.',
    },
    {
      type: 'table',
      head: ['Channel', 'The question', 'Example'],
      rows: [
        ['Capacity', 'Can the system physically take the load?', 'Orders double, the kitchen cannot keep up, food goes out cold'],
        ['Incentive', 'What will people now optimise for?', 'Staff paid per order start rushing the slow tables'],
        ['Expectation', 'What becomes the new normal, permanently?', 'A festival discount becomes the price people expect all year'],
        ['Response', 'What do rivals, regulators and partners do back?', 'You cut your price, the shop next door cuts deeper, both of you earn less'],
      ],
    },
    {
      type: 'p',
      text: 'Expectation is the one people miss and the most expensive, because it is the hardest to take back.',
    },

    { type: 'h3', text: '3. Commit' },
    { type: 'p', text: 'Three checks decide how you push. They do not decide whether.' },
    { type: 'p', text: '**Can you undo it, and what does it cost?**' },
    {
      type: 'table',
      head: ['', 'Cheap', 'Expensive'],
      rows: [
        [
          'Easy to undo',
          'Just do it. Studying it costs more than being wrong.',
          'Try it small first. Cap what is at risk, then decide.',
        ],
        [
          'Hard to undo',
          'Think, then do. Cheap but permanent, which is where expectations live.',
          'Get evidence first. Wait for an early sign to move the right way.',
        ],
      ],
    },
    {
      type: 'p',
      text: '**Who can actually take this decision?** Name the person. A lever you have identified but cannot authorise is a request, and it belongs in a different plan with a different timeline.',
    },
    {
      type: 'p',
      text: '**What order do you move in?** Most change programmes fail because everything moved at once and afterwards nobody could tell what worked. Start with the change that gives you an answer soonest.',
    },

    { type: 'h3', text: '4. Measure, and say in advance when you will stop' },
    { type: 'p', text: 'You cannot measure trust, brand or morale. You measure a stand-in for it.' },
    {
      type: 'p',
      text: 'For each change write five things: what we changed, what we watch, which way it should move, how often we check, and the number that counts as working.',
    },
    {
      type: 'table',
      head: ['What you changed', 'The early sign you watch', 'Which way it should move', 'How often you check'],
      rows: [
        ['The staff bonus', 'How many staff leave each week', 'Down', 'Every week'],
        ['Word of mouth', 'Share of customers who arrived without seeing an ad', 'Up', 'Every month'],
        ['Kitchen speed', 'Minutes from taking an order to serving it', 'Down', 'Every day'],
      ],
    },
    { type: 'p', text: 'A stand-in measure is worth having only if it passes three tests.' },
    {
      type: 'ul',
      items: [
        '**It moves early.** Anything that moves after the thing you care about is a report card.',
        '**It survives being gamed.** If your team chased this number directly, would you still get what you wanted? If not, pair it with a second number that guards the obvious abuse.',
        '**It has a threshold attached.** A measure with no number next to it is decoration.',
      ],
    },
    {
      type: 'p',
      text: 'Then the step almost everyone skips. Before you start, write down the result that will make you stop. For example: if minutes to serve have not fallen below eight by week six, we reverse the change.',
    },
    {
      type: 'p',
      text: 'Changes rarely fail loudly. They get quietly defended past the point of evidence, because by then somebody’s name is on them.',
    },
    {
      type: 'p',
      text: 'Then close the loop. A change that works alters the situation, so the old options are spent and new ones exist. Go back to define.',
    },

    { type: 'h2', text: 'Framework B. Absorb: change that arrives' },
    { type: 'p', text: 'Four moves, in order: classify, trace back, choose, watch.' },

    { type: 'h3', text: '1. Classify the force' },
    {
      type: 'p',
      text: 'Two questions settle most of your response. Did it arrive fast or slowly, and will it pass or is it permanent?',
    },
    {
      type: 'table',
      head: ['', 'Will pass', 'Permanent'],
      rows: [
        [
          'Arrived fast',
          'Cushion it. Use cash, stock, spare capacity. Do not rebuild the firm around a spike.',
          'Steady it, then rebuild. Stabilise this week, redesign this quarter. The rare case where speed genuinely matters.',
        ],
        [
          'Arrived slowly',
          'Watch, do not act. Most noise lives here, and reacting costs more than waiting.',
          'The dangerous box. Slow and permanent, so no alarm ever rings. This is what actually kills firms.',
        ],
      ],
    },
    {
      type: 'p',
      text: 'The bottom right box is the reason to do this sorting at all. Fast trouble gets attention on its own. Slow permanent trouble does not, because on no single day is it urgent.',
    },
    {
      type: 'p',
      text: 'The one operating habit worth building from this is a standing review of what sits in that box.',
    },
    {
      type: 'p',
      text: 'Where to look for forces: politics, the economy, society, technology, the environment, and the law. Use it as a checklist to scan with. Mark each one as helping, neutral or hurting, then throw away the neutrals. Six paragraphs of commentary, one per heading, is theatre.',
    },

    { type: 'h3', text: '2. Trace back to something you can touch' },
    {
      type: 'p',
      text: 'Keep asking why, one layer at a time. What you see, then how people are behaving, then what they are being rewarded for, then how the system is built.',
    },
    {
      type: 'p',
      text: 'Stop at the first layer you can act on. Going further is satisfying and useless. “It is the macro environment” is a true statement and a dead end.',
    },
    { type: 'p', text: 'That layer is, by definition, a lever you hold, which is your way back into Push.' },

    { type: 'h3', text: '3. Choose your posture' },
    {
      type: 'p',
      text: 'Four options. Pick one deliberately. The failure mode is sliding into the first by default and calling it a decision.',
    },
    {
      type: 'table',
      head: ['Posture', 'When it is right', 'What it costs'],
      rows: [
        ['Take the hit', 'It will pass, and you have the reserves', 'Reserves. Fine once, fatal if repeated'],
        ['Adapt', 'It is permanent, and you can still compete after changing', 'The transition, when you are good at neither the old thing nor the new'],
        ['Exit', 'It is permanent and the position cannot be won', 'Money already spent, and the pride of whoever built it'],
        ['Turn it around', 'The force can be made to work for you', 'Speed. The window is short and shuts when rivals notice'],
      ],
    },
    {
      type: 'p',
      text: 'Turning it around is the one to look for. A rule that raises everyone’s costs favours whoever adapts first. A shortage hurts your competitor more than it hurts you if your costs are lower. When you turn a force around you have moved from Absorb into Push, which is what the whole system is for.',
    },
    {
      type: 'p',
      text: 'Then find the force that matters most. Of everything acting on you, one usually explains most of the movement. Find it before you allocate a rupee of attention.',
    },
    {
      type: 'p',
      text: 'And name the force pushing the other way. Every situation is a balance of two opposing pressures. You change the outcome by weakening the one working against you or by strengthening the one working for you.',
    },
    {
      type: 'p',
      text: 'Weakening is almost always cheaper. Most change programmes attempt only the second, which raises the pressure on both sides and moves nothing.',
    },

    { type: 'h3', text: '4. Watch for the next one' },
    {
      type: 'p',
      text: 'Same discipline as the measure step, turned around. There you asked whether it worked. Here you ask how early you can see the next one coming.',
    },
    {
      type: 'p',
      text: 'For each force that matters, write four things: the force, the early sign, the number that triggers action, and what you will do.',
    },
    {
      type: 'p',
      text: 'Decide that response in advance. Under real pressure nobody designs a good response. People execute what was already written down, or they improvise badly. Write it while you are calm.',
    },

    { type: 'h2', text: 'How the two halves connect' },
    { type: 'p', text: 'Without these three joins this is two lists. With them it is one system.' },
    {
      type: 'table',
      head: ['Bridge', 'Which way it runs', 'In one line'],
      rows: [
        ['Trace back to a lever', 'Absorb into Push', 'Asking why until you reach something you control turns a force into a decision'],
        ['Turn it around', 'Absorb into Push', 'The fourth posture makes the force work for you'],
        ['Rehearse from the other side', 'Push into Absorb', 'Run Absorb from the other party’s chair before you commit'],
      ],
    },
    { type: 'figure', figure: 'bridges', caption: 'Two bridges carry you from Absorb into Push; one sends a planned push back through Absorb as a test.' },
    {
      type: 'p',
      text: '**Tracing back finds you a lever.** In Absorb you keep asking why until you reach a layer you can act on, and that layer is a lever. Tracing back is how you discover you had agency all along.',
    },
    {
      type: 'p',
      text: '**Turning it around is a formal handover.** The fourth posture in Absorb is the moment you stop receiving the change and start driving it.',
    },
    {
      type: 'p',
      text: '**Rehearsing from the other side stops bad pushes.** Before you commit to any change, sit in the other party’s chair and run Absorb on what you are about to do to them. Ask how they will classify it, which of the four postures they will pick, and how long until they have neutralised it.',
    },
    {
      type: 'p',
      text: 'If the answer is that they adapt within a month and you are back where you started, the change was never going to work. You found that out before spending anything.',
    },
    {
      type: 'p',
      text: 'This is also the honest answer to “how do I know my change is good?” You do not. You check who pays for it, and you check what they will do about it.',
    },

    { type: 'h2', text: 'The whole thing on one page' },
    {
      type: 'p',
      text: '**Start here.** Do I hold the lever? Yes, run Push. No, run Absorb. Partly, split it and run both.',
    },
    {
      type: 'table',
      head: ['', 'PUSH (change you start)', 'ABSORB (change that arrives)'],
      rows: [
        [
          '1',
          '**Define.** What moves and by how much, who benefits, who pays, by when. Good and bad depend on the seat and the horizon.',
          '**Classify.** Fast or slow, passing or permanent. Watch the slow and permanent box.',
        ],
        [
          '2',
          '**Trace.** How the change travels (direct, through someone, through belief), and what gets knocked over (capacity, incentive, expectation, response).',
          '**Trace back.** What you see, how people behave, what they are rewarded for, how the system is built. Stop where you can act.',
        ],
        [
          '3',
          '**Commit.** Can you undo it and what does it cost, who can actually decide, what order to move in.',
          '**Choose.** Take the hit, adapt, exit, or turn it around. Find the force that matters most and weaken it rather than out-push it.',
        ],
        [
          '4',
          '**Measure.** One early sign per change, with a threshold, and a written rule for when you stop. Then loop back to 1.',
          '**Watch.** Early sign, trigger number, and the response decided in advance.',
        ],
      ],
    },
    {
      type: 'p',
      text: '**The three bridges:** tracing back hands you a lever, turning it around moves you from the right column to the left, and rehearsing from the other side tests your push before you spend on it.',
    },
    {
      type: 'callout',
      text: 'Context is just somebody else’s decision. The aim is to spend more of your life in the left column.',
    },

    { type: 'h3', text: 'The short version' },
    {
      type: 'ul',
      items: [
        'Every change is either one you are making or one being made to you, and the two need opposite methods.',
        'If you are making it, the hard work is naming who pays and what breaks.',
        'If it is happening to you, the hard work is telling a passing shock apart from a slow permanent shift, and catching the second one.',
        'Whatever is happening to you was somebody’s decision. The goal is to be the one deciding more often.',
      ],
    },

    { type: 'h2', text: 'The bare shape, with no details in it' },
    {
      type: 'p',
      text: 'Every case this framework handles has the same three pieces. A sells something to B. Something outside them both changes: a cost, a rule, a new competitor. Fill in those three blanks and the rest of the framework runs itself.',
    },
    {
      type: 'p',
      text: 'The chain runs in one direction. An outside change lands on A. A absorbs it and decides something. A’s decision lands on B. B absorbs it and decides something of their own, and so on down the line.',
    },
    { type: 'figure', figure: 'chain', caption: 'Every decision is the next party’s outside change.' },
    { type: 'p', text: 'Read it in four beats.' },
    {
      type: 'ol',
      items: [
        'The outside change lands on A, who did not choose it. A runs Absorb: is it fast or slow, will it pass or is it permanent, keep asking why until something A controls turns up, then pick a posture and set an early sign to watch.',
        'Whatever posture A picks becomes a change A now makes. Almost always, part of the cost travels to B.',
        'So A runs Push: name what moves and who pays for it, trace how it travels and what it knocks over, check whether it can be undone and who can authorise it, then attach a measure and a written stop rule.',
        'Before committing, A sits in B’s chair and runs Absorb from there. If B’s cheapest posture is to walk away, A’s change fails, and A learns that for nothing.',
      ],
    },
    {
      type: 'p',
      text: 'The same picture explains the claim this document rests on. The outside change that hit A was somebody’s decision further up the chain, and A’s decision is now the outside change that hits B. Nobody in the picture is only pushing or only absorbing. You are always somewhere in the middle, and the question is only which end you spend more of your time on.',
    },
    {
      type: 'p',
      text: 'The canteen below is this picture with the blanks filled in: A is the owner, B is the students, and the outside change is the price of milk.',
    },

    { type: 'h2', text: 'Worked example: the college canteen' },
    {
      type: 'p',
      text: 'The canteen sells tea at ₹10 a cup. Milk prices go up. The owner is thinking about charging ₹15.',
    },
    { type: 'p', text: 'That is two problems, and they get routed separately.' },

    { type: 'h3', text: 'The part he does not control: milk prices' },
    {
      type: 'p',
      text: '**Classify.** The rise came fast. Will it pass or is it permanent? A seasonal dip in supply will pass. A change in procurement rules will not. This one judgement decides everything after it, and it is a judgement rather than a calculation, so say which way you are assuming and why.',
    },
    { type: 'p', text: 'Assume fast and permanent. Steady it this month, redesign the menu this term.' },
    {
      type: 'p',
      text: '**Trace back.** Margin is down, because milk costs more, because tea is what he sells most of, because tea was priced cheap to pull students in. The last layer is a pricing decision he made himself, and that is his way out.',
    },
    {
      type: 'p',
      text: '**Choose.** Taking the hit does not survive a permanent force, because savings run out. Adapt fits: let black tea, samosas and cold drinks carry more of the revenue. There is also a turn-it-around available. If milk costs hurt every canteen and every stall outside equally, whoever changes the menu first has a cost advantage for as long as the others take to follow.',
    },
    {
      type: 'p',
      text: '**Watch.** Early sign: milk cost as a share of the day’s takings, checked weekly. Trigger: if it crosses a set level, the menu change moves up. Decided now, while nothing is urgent.',
    },

    { type: 'h3', text: 'The part he does control: the price of tea' },
    {
      type: 'p',
      text: '**Define.** Move tea from ₹10 to ₹15, for the owner, paid for by students, from the first of next month. Written that way, the trade is visible. Written as “revise pricing”, nobody has to look at it.',
    },
    {
      type: 'p',
      text: 'Then apply the rule about good and bad. Good for the owner’s margin this month. Bad for students on every horizon. Bad for the canteen next term if students drift to the stall outside and stay there.',
    },
    {
      type: 'p',
      text: '**Trace.** The path is direct, because he sets the price himself. That is the reliable kind. Now the four channels:',
    },
    {
      type: 'table',
      head: ['Channel', 'What happens here'],
      rows: [
        ['Capacity', 'Fewer buyers, shorter queues, and the extra hand he hired for the rush is now idle'],
        ['Incentive', 'Students bring flasks from the hostel, or four of them share one pot'],
        ['Expectation', 'Once tea is ₹15 it never goes back to ₹10, even if milk gets cheaper'],
        ['Response', 'The stall outside the gate holds at ₹10 and takes the crowd'],
      ],
    },
    {
      type: 'p',
      text: 'Expectation is the killer here. A price rise is close to irreversible, and it appears in nobody’s arithmetic.',
    },
    {
      type: 'p',
      text: '**Commit.** Cheap to do and hard to undo, which puts it in the think-then-do box. A better shaped version: raise the price only at the evening counter, where the outside stall is shut, so the exposure is bounded and he learns something.',
    },
    {
      type: 'p',
      text: '**Measure.** Watch cups sold per day. The month’s takings tell him afterwards, and cups tell him in time to reverse. Stop rule, written today: if evening cups fall more than 20% against the morning counter by week three, the price goes back.',
    },
    {
      type: 'p',
      text: '**Rehearse from the other side.** Sit in the student’s seat and run Absorb. To a student this is fast and permanent, and the obvious posture is exit, to the stall outside. If exit is that easy, the change fails, and he knows it before printing a new board.',
    },

    { type: 'h2', text: 'What is borrowed, and what is new' },
    { type: 'h3', text: 'Borrowed, and used as technique rather than structure' },
    {
      type: 'table',
      head: ['Idea here', 'Where it comes from'],
      rows: [
        ['Two opposing forces set the outcome, and weakening the one against you beats strengthening the one for you', 'Kurt Lewin’s force-field analysis'],
        ['One cause usually explains most of the movement', 'The Pareto principle'],
        ['Keep asking why until you reach something you can act on', 'The five whys, from Toyota’s production system'],
        ['Scanning politics, economy, society, technology, environment, law', 'The standard PESTEL scan'],
        ['Can you undo it, and at what cost', 'The one-way versus two-way door test, common in technology firms'],
        ['A measure stops being a good measure once people are judged on it', 'Goodhart’s law'],
        ['Early signs against after-the-fact signs', 'Leading and lagging indicators'],
      ],
    },
    { type: 'h3', text: 'What this framework adds' },
    {
      type: 'ol',
      items: [
        '**Routing before analysis.** The first question is “do I hold the lever”, because the answer sends you down two different methods. Most change models work the same way in either direction, which is why they read as checklists.',
        '**Good and bad as a three-part judgement:** the change, whose seat, what horizon. This turns a vague argument into a stated trade-off.',
        '**Four named channels in place of “knock-on effects”:** capacity, incentive, expectation, response. A butterfly’s wings are vivid and give you nothing to do. Four named channels give you something to check.',
        '**Expectation named as a channel of its own.** It is the most expensive knock-on and the least reversible, and it appears in no standard framework.',
        '**A written stop rule fixed before you start.** Evidence rarely kills a change, because by the time it arrives somebody owns the change.',
        '**The slow-and-permanent box as a standing agenda item.** Everything else on that grid gets attention naturally.',
        '**Rehearsing from the other side:** running the second framework on yourself, from the other party’s chair, before you commit.',
        '**The claim that ties it together.** Context is just somebody else’s decision, so the two halves are one system seen from opposite ends.',
      ],
    },
    {
      type: 'p',
      text: 'A framework earns its name by making a claim about how the world works. Point 8 is this one’s claim.',
    },

    { type: 'h2', text: 'Where this framework does not help' },
    {
      type: 'p',
      text: 'It assumes you can tell fast from slow, and passing from permanent. Often you cannot, and you find out afterwards. The grid forces you to commit to a view, which is useful, and the view can still be wrong. The honest use is to state the assumption out loud and set a trigger that tells you when it was wrong.',
    },
    {
      type: 'p',
      text: 'It says almost nothing about people: resistance, politics, who loses face, who has to be persuaded. The “who can actually decide” check touches this and goes no further. For a change that depends mainly on persuading a workforce, this tells you what to do and leaves out how to get anyone to agree.',
    },
    {
      type: 'p',
      text: 'It assumes measurement is possible. Some things matter and resist measurement for years, and culture and reputation are the obvious cases. Applied strictly, this would talk you out of changes worth making, because no early sign exists yet.',
    },
    {
      type: 'p',
      text: 'Nothing here helps you invent the option. It tests changes you have already thought of. Coming up with the good idea is a separate problem.',
    },
    {
      type: 'p',
      text: 'It is built for one organisation’s point of view. With several parties each pushing and absorbing at once, you have to run it once per party, and it says nothing about how those runs interact.',
    },
    {
      type: 'p',
      text: 'One last limit, and it is the biggest. If every situation you look at routes to Absorb, that is worth examining. Sometimes it is true. More often the levers sit a level above you, and the real change to make is about who gets to decide.',
    },
  ],
  faq: [
    {
      q: 'What is the Push and Absorb framework?',
      a: 'A decision framework by Archit Sagar Jain for handling change. It starts with one routing question, “do I hold the lever?”, then sends you down one of two mirrored methods: Push for change you start (define, trace, commit, measure) and Absorb for change that arrives (classify, trace back, choose, watch).',
    },
    {
      q: 'How is it different from other change management frameworks?',
      a: 'Most change models work the same way in either direction. Push and Absorb routes before it analyses, treats good and bad as a judgement about the change, whose seat and what horizon, names four knock-on channels (capacity, incentive, expectation, response), and requires a written stop rule before a change begins.',
    },
    {
      q: 'What is a stop rule?',
      a: 'The result, written down before you start, that will make you reverse a change. For example: if minutes to serve have not fallen below eight by week six, the change is reversed. It exists because changes rarely fail loudly; they get defended past the point of evidence.',
    },
    {
      q: 'Which kind of change is most dangerous?',
      a: 'Change that arrives slowly and is permanent. Fast trouble gets attention on its own, but a slow permanent shift is never urgent on any single day, so no alarm rings. The framework recommends a standing review of that box.',
    },
  ],
};
