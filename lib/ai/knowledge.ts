import { articles, plain } from '@/content/articles';
import { pushAndAbsorb } from '@/content/articles/push-and-absorb';
import { apps } from '@/content/apps';
import { pressByPriority } from '@/content/press';
import { CONTEXT_LAST_VERIFIED, CONTEXT_SECTIONS } from '@/content/archit-context.generated';

/**
 * Compiles what the clone knows into one context block.
 *
 * The facts about Archit come straight from content/archit-context.md, the
 * file he keeps up to date and the single source of truth for the whole site.
 * It is read in full rather than retrieved in pieces: the facts are a few
 * thousand tokens, and a missed chunk is a gap the model fills by inventing.
 * The rest of the site (every article, case study, timeline stop and resume
 * role, about 175K characters) is too long for that, so the chat route adds
 * the passages that match each question; see lib/ai/site-index.ts.
 *
 * From that file the clone gets the identity and pitch (2), the narrative (3),
 * every role with its stories and numbers (4), education (5), leadership and
 * certifications (6), skills and what is not claimed (7), the case studies
 * (8), the ready answers (11) and the do-not-use list (12). Section 10, the
 * persona, lives in the system prompt; sections 1, 9 and 13 are notes for
 * whoever maintains the site.
 */

const FROM_CONTEXT = ['2', '3', '4', '5', '6', '7', '8', '11', '12'];

export function buildKnowledgeBase(): string {
  const sections: string[] = [];

  sections.push(
    [
      `## SOURCE: Archit's verified context file${CONTEXT_LAST_VERIFIED ? `, last verified ${CONTEXT_LAST_VERIFIED}` : ''}`,
      ...FROM_CONTEXT.map((n) => CONTEXT_SECTIONS[n]).filter(Boolean),
    ].join('\n\n'),
  );

  // The framework is Archit's own, so the clone should be able to explain it.
  // Its FAQ answers are the compact form of the whole paper.
  sections.push(
    [
      '## MY FRAMEWORK: PUSH AND ABSORB',
      `Published ${pushAndAbsorb.published} at /articles/${pushAndAbsorb.slug}`,
      ...(pushAndAbsorb.faq ?? []).map((f) => `- ${f.q} ${plain(f.a)}`),
      '- The three bridges: tracing back hands you a lever, turning it around moves you from Absorb into Push, and rehearsing from the other side (running Absorb from the other party’s chair) tests a push before you spend on it.',
      '- The four knock-on channels: capacity, incentive, expectation, response. Expectation is the most expensive and least reversible.',
      '- Its core claim: context is just somebody else’s decision. The aim is to spend more of your working life making changes than absorbing them.',
    ].join('\n'),
  );

  sections.push(
    [
      '## MY ARTICLES (link a visitor to the relevant one by its path)',
      // Titles and paths only: the excerpts cost prompt length, which is
      // latency on every answer, and the title is enough to pick a link.
      ...articles.map((a) => `- ${a.title} (${a.category}) at /articles/${a.slug}`),
    ].join('\n'),
  );

  sections.push(
    [
      '## MY SITE (where things are, for pointing visitors around)',
      '- The home page opens on a 3D intro; "Talk to Archit" or scrolling leads into ARCHIT.OS, a Mac-style desktop.',
      '- Its dock holds the apps: About, Projects (case studies), Timeline, Resume, Writing (articles), Ask Archit (this chat), then LinkedIn and Mail, which open my LinkedIn profile and an email to me.',
      '- /articles is the writing hub; each article lives at /articles/<slug>. /resume is a printable resume.',
    ].join('\n'),
  );

  if (apps.length) {
    sections.push(
      ['## APPS I HAVE BUILT', ...apps.map((a) => `- ${a.name}: ${a.tagline} Built with ${a.builtWith}. ${a.url}`)].join(
        '\n',
      ),
    );
  }

  const press = pressByPriority();
  if (press.length) {
    sections.push(
      ['## PRESS COVERAGE', ...press.map((p) => `- ${p.outlet}${p.date ? `, ${p.date}` : ''}: ${p.title}. ${p.summary ?? ''} ${p.url}`)].join('\n'),
    );
  }

  return sections.join('\n\n---\n\n');
}

/** Cached at module scope — the corpus is static per deployment. */
export const KNOWLEDGE_BASE = buildKnowledgeBase();
