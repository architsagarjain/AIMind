import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { timeline } from '@/content/timeline';
import { education, experience, skills } from '@/content/resume';

/**
 * Compiles the content files into a compact, token-efficient context block.
 *
 * This is deliberately a full-context dump rather than a vector search: the
 * whole corpus is a few thousand tokens, so retrieval would add latency and a
 * failure mode (missed chunks → the model fills the gap by inventing) without
 * buying accuracy. Swap to embeddings only if the corpus outgrows the window.
 */
export function buildKnowledgeBase(): string {
  const sections: string[] = [];

  sections.push(
    [
      '## IDENTITY',
      `Name: ${profile.name}`,
      `From: ${profile.hometown} — fourth-generation business family`,
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
          `### ${m.title} — ${m.org} (${m.year}, ${m.location})`,
          m.summary,
          ...m.details.map((d) => `- ${d}`),
        ].join('\n'),
      ),
    ].join('\n\n'),
  );

  sections.push(
    [
      '## PROJECTS & CASE STUDIES',
      ...projects.map((p) =>
        [
          `### ${p.name} — ${p.subtitle}`,
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
      '## RESUME — EXPERIENCE',
      ...experience.map((e) =>
        [`### ${e.role}, ${e.org} (${e.period}, ${e.location})`, ...e.bullets.map((b) => `- ${b}`)].join(
          '\n',
        ),
      ),
    ].join('\n\n'),
  );

  sections.push(
    [
      '## RESUME — EDUCATION',
      ...education.map((e) => `- ${e.degree}, ${e.school} (${e.period}, ${e.location})`),
    ].join('\n'),
  );

  sections.push(
    ['## SKILLS', ...skills.map((s) => `- ${s.group}: ${s.items.join(', ')}`)].join('\n'),
  );

  return sections.join('\n\n---\n\n');
}

/** Cached at module scope — the corpus is static per deployment. */
export const KNOWLEDGE_BASE = buildKnowledgeBase();
