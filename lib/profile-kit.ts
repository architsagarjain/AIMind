import { articles } from '@/content/articles';
import { positioning } from '@/content/positioning';
import { profile } from '@/content/profile';
import { offers, rolesSentence } from '@/content/services';
import { absolute } from '@/lib/seo';

/**
 * The profile kit on /syndicate: the text to paste into profiles on other
 * sites, and the Claude in Chrome prompts that set those profiles up or bring
 * them in line after the positioning changes. All of it is generated from
 * content/positioning.ts and content/services.ts, so it is never out of date.
 */

/** Profiles worth having for discoverability, with what to put where. */
export const PROFILE_SITES = [
  { name: 'Topmate', url: 'topmate.io', extra: 'one service, "Intro call: GTM, growth or hiring conversation" (ask me for the price and duration)' },
  { name: 'Peerlist', url: 'peerlist.io', extra: `work history exactly as written on ${absolute('/about')}` },
  { name: 'Contra', url: 'contra.com', extra: `service listings for ${offers.slice(0, 3).map((o) => `"${o.title}"`).join(', ')}, described with the text on ${absolute('/work-with-me')} (ask me for rates)` },
  { name: 'Wellfound', url: 'wellfound.com', extra: `candidate profile, open to: ${rolesSentence}` },
  { name: 'GitHub', url: 'github.com/settings/profile', extra: 'Website field and bio only' },
  { name: 'Medium', url: 'medium.com (profile settings)', extra: 'short bio and website link' },
  { name: 'Gravatar', url: 'gravatar.com', extra: 'short profile with links' },
  { name: 'about.me', url: 'about.me', extra: 'a simple page linking to the website and LinkedIn' },
] as const;

/** Articles to republish on Medium (broad interest) and on Dev.to / Hashnode (AI and tech only). */
const MEDIUM = ['quick-commerce-india-economics', 'upi-payments-india-economics', 'pricing-services-business-playbook', 'weekly-operating-review-kpi-cadence', 'leaving-big-4-for-a-startup'];
const DEV = ['building-an-ai-clone-of-myself', 'applied-ai-indian-businesses-thesis', 'ai-in-internal-audit'];
const existing = (slugs: string[]) => slugs.filter((s) => articles.some((a) => a.slug === s));

/** The fields people paste into profiles, in the order forms usually ask. */
export function profileFields() {
  return [
    { label: 'Name', value: profile.name },
    { label: 'Headline', value: positioning.headline },
    { label: 'Short bio (160 characters)', value: positioning.shortBio },
    { label: 'Long bio', value: positioning.bio },
    { label: 'Skills', value: positioning.skills.join(', ') },
    { label: 'Location', value: positioning.city },
    { label: 'Website (main link)', value: absolute('/work-with-me') },
    { label: 'Profile page', value: absolute('/about') },
    { label: 'LinkedIn', value: profile.links.linkedin },
  ];
}

function detailsBlock() {
  return [
    'MY DETAILS (use these exact words, so every site describes me the same way)',
    ...profileFields().map((f) => `- ${f.label}: ${f.value}`),
    `- Articles: ${absolute('/articles')}`,
    `- Email: ${profile.links.email}`,
    `- Everything about me and all articles, in one file: ${absolute('/llms.txt')}`,
  ].join('\n');
}

const RULES = `RULES (follow every one)
- Ask me before creating any new account, and before publishing, posting or saving anything public. Show me exactly what will go live and wait for my "yes".
- Use only the details below and my own published pages. Never invent facts, numbers, clients, prices or credentials.
- If a site asks for payment, a phone number, ID verification, a CAPTCHA or anything unexpected, stop and ask me.
- No spam: no comment link-dropping, no posting the same text in many places, no fake reviews or upvotes, no buying links.
- Skip my LinkedIn profile. Don't contact or list any company I've worked with.
- Keep a running log. At the end, give me a table: Platform | Link to my profile or post | Status (Done / Waiting on me) | Notes.`;

const SEARCH_ENGINES = `Search engines (nothing public)
1. Google Search Console (search.google.com/search-console), property architsagarjain.com: URL Inspection, then "Request indexing", for ${['/', '/about', '/work-with-me', '/articles'].map(absolute).join(', ')}. Under Sitemaps, confirm ${absolute('/sitemap.xml')} shows Success.
2. Bing Webmaster Tools (bing.com/webmasters): if I have no account, ask me, then sign in with Google and "Import from Google Search Console". Use URL Submission for the same 4 URLs.`;

/** First-time setup: search engines, profiles, republishing, answers. */
export function setupPrompt(): string {
  const med = existing(MEDIUM).map((s) => `   ${absolute(`/articles/${s}`)}`).join('\n');
  return `You're helping me, ${profile.name}, build backlinks so that people and AI assistants (ChatGPT, Claude, Perplexity, Gemini) find me when they look for someone like me (${positioning.headline}), and so I get inbound leads for full-time roles and consulting. Work in a new tab, using the accounts I'm already signed into.

${RULES}

${detailsBlock()}

PHASE 1. ${SEARCH_ENGINES}

PHASE 2. Expert and professional profiles (AI assistants find these when asked for experts)
On each, use the Headline, a bio, the skills, the location and the links above, with the main website link in the website field. Ask before creating each account.
${PROFILE_SITES.map((p, i) => `${i + 1}. ${p.name} (${p.url}): ${p.extra}.`).join('\n')}

PHASE 3. Republish my articles with a link back to the original (one at a time; show me each draft before publishing)
Medium: go to https://medium.com/p/import, paste the article URL and import. Check headings, lists and tables, add up to 5 tags, and confirm it shows "Originally published at architsagarjain.com".
${med}
Dev.to and Hashnode (developer sites, so only these AI pieces): open ${absolute('/articles/<slug>/markdown')} and copy everything. Dev.to: paste into dev.to/new; the front matter sets title, tags and canonical_url (keep it), then preview. Hashnode: paste the body without the front matter, and set "Original URL" in the post settings to ${absolute('/articles/<slug>')}.
Slugs: ${existing(DEV).join(', ')}

PHASE 4. Helpful answers (drafts only; I approve each one)
Find 3 active Quora questions that my articles genuinely answer. For each, draft a 150 to 250 word answer in first person, using only facts from that article; plain and numbers-first, no dashes, no hype. End with: "I wrote a fuller breakdown here: <article URL>". Show me the question link and the draft, and post only after I say yes.

FINISH
Give me the summary table, plus a short list of anything waiting on me.`;
}

/** After the positioning changes: bring every existing profile in line. */
export function updatePrompt(): string {
  return `My positioning has changed, and I want every profile I have on other sites to say the same new thing as my website. Work in a new tab, using the accounts I'm already signed into.

${RULES}

${detailsBlock()}

STEPS
1. For each site below where I already have a profile, open my profile's edit page and replace the headline, bio (short or long, whichever fits the field), skills, location and links with the details above. Keep anything else (photos, reviews, history) as it is. Show me a before/after for each and save only after I say yes. If I have no profile on a site, note it and move on; don't create one.
${PROFILE_SITES.map((p) => `   - ${p.name} (${p.url})`).join('\n')}
   - Any other profile I mention to you.
2. ${SEARCH_ENGINES.replace('Search engines (nothing public)\n', '')}
3. Don't edit articles I've already republished; the original on my site is what counts.

FINISH
Give me a table: Platform | Profile link | Updated / No profile / Waiting on me | Notes.`;
}
