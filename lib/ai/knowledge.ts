import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { timeline } from '@/content/timeline';
import { education, experience, skills } from '@/content/resume';
import { articles, plain } from '@/content/articles';
import { pushAndAbsorb } from '@/content/articles/push-and-absorb';
import { apps } from '@/content/apps';
import { pressByPriority } from '@/content/press';

/**
 * Compiles the content files into a compact, token-efficient context block.
 *
 * This is deliberately a full-context dump rather than a vector search: the
 * whole corpus is a few thousand tokens, so retrieval would add latency and a
 * failure mode (missed chunks → the model fills the gap by inventing) without
 * buying accuracy. Swap to embeddings only if the corpus outgrows the window.
 *
 * DE-DUPLICATED
 * The timeline and the resume retell the case studies, and every repeated
 * token is prompt the model has to read before it can say a word. So a
 * timeline detail or resume bullet about an org with a case study is kept only
 * when it adds something: a figure the case study does not mention, or
 * wording mostly absent from it. Nothing is paraphrased, only omitted.
 */

/** Matches "MCCS Infra Pvt. Ltd." to the "MCCS Infra" case study. */
const orgKey = (org: string) =>
  org
    .toLowerCase()
    .replace(/\b(pvt|private|ltd|limited|inc|llp)\b\.?/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const figures = (text: string) => text.match(/\d[\d,.]*\s*(?:%|x|k|m|cr|l|lakh|crore)?/gi)?.map((f) => f.replace(/[\s,]/g, '').toLowerCase()) ?? [];
const words = (text: string) => text.toLowerCase().match(/[a-z]{5,}/g) ?? [];

function caseStudyTexts(): Map<string, { text: string; figures: Set<string>; words: Set<string> }> {
  const map = new Map<string, { text: string; figures: Set<string>; words: Set<string> }>();
  for (const p of projects) {
    const text = [
      p.subtitle,
      ...p.metrics.map((m) => `${m.label} ${m.value}`),
      p.caseStudy.challenge,
      ...p.caseStudy.strategy,
      ...p.caseStudy.execution,
      ...p.caseStudy.results,
      ...p.caseStudy.lessons,
    ].join(' ');
    map.set(orgKey(p.name), { text, figures: new Set(figures(text)), words: new Set(words(text)) });
  }
  return map;
}

/** True when `line` says something the org's case study does not. */
function addsToCaseStudy(line: string, study: { figures: Set<string>; words: Set<string> } | undefined) {
  if (!study) return true;
  if (figures(line).some((f) => !study.figures.has(f))) return true;
  const w = words(line);
  if (!w.length) return false;
  const known = w.filter((x) => study.words.has(x)).length;
  return known / w.length < 0.5;
}

export function buildKnowledgeBase(): string {
  const sections: string[] = [];
  const studies = caseStudyTexts();

  sections.push(
    [
      '## IDENTITY',
      `Name: ${profile.name}`,
      `From: ${profile.hometown}, fourth-generation business family`,
      `Currently: ${profile.currently}`,
      `Self-description: ${profile.roles.join(' · ')}`,
      `Interests: ${profile.interests.join(', ')}`,
    ].join('\n'),
  );

  sections.push(['## BACKGROUND', ...profile.about.map((p) => `- ${p}`)].join('\n'));

  sections.push(
    [
      '## CAREER TIMELINE',
      ...timeline.map((m) =>
        [
          `### ${m.title}, ${m.org} (${m.year}, ${m.location})`,
          m.summary,
          ...m.details.filter((d) => addsToCaseStudy(d, studies.get(orgKey(m.org)))).map((d) => `- ${d}`),
        ].join('\n'),
      ),
    ].join('\n\n'),
  );

  sections.push(
    [
      '## PROJECTS & CASE STUDIES',
      ...projects.map((p) =>
        [
          `### ${p.name}: ${p.subtitle}`,
          `Role: ${p.role} | Period: ${p.period}`,
          `Verified metrics: ${p.metrics.map((m) => `${m.label}: ${m.value}`).join(' | ')}`,
          `Challenge: ${p.caseStudy.challenge}`,
          `Strategy: ${p.caseStudy.strategy.join(' ')}`,
          `Execution: ${p.caseStudy.execution.join(' ')}`,
          `Results: ${p.caseStudy.results.join(' ')}`,
          `Lessons: ${p.caseStudy.lessons.join(' ')}`,
        ].join('\n'),
      ),
    ].join('\n\n'),
  );

  sections.push(
    [
      '## RESUME: EXPERIENCE',
      ...experience.map((e) =>
        [
          `### ${e.role}, ${e.org} (${e.period}, ${e.location})`,
          ...e.bullets.filter((b) => addsToCaseStudy(b, studies.get(orgKey(e.org)))).map((b) => `- ${b}`),
        ].join('\n'),
      ),
    ].join('\n\n'),
  );

  sections.push(
    [
      '## RESUME: EDUCATION',
      ...education.map((e) => `- ${e.degree}, ${e.school} (${e.period}, ${e.location})`),
    ].join('\n'),
  );

  sections.push(
    ['## SKILLS', ...skills.map((s) => `- ${s.group}: ${s.items.join(', ')}`)].join('\n'),
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
      ...articles.map((a) => `- ${a.title} (${a.category}) at /articles/${a.slug}: ${plain(a.excerpt)}`),
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
