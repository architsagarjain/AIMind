import { articles, headingId, plain } from '@/content/articles';
import { projects } from '@/content/projects';
import { timeline } from '@/content/timeline';
import { experience } from '@/content/resume';
import type { Article, ArticleBlock } from '@/types';

/**
 * The whole portfolio as searchable passages, so the clone can answer from
 * any page of the site, not only from the facts it always carries.
 *
 * Every article is split at its section headings (with its FAQ answers as
 * passages of their own), and every case study, timeline stop and resume
 * role is a passage too. It is built from the same content files the pages
 * render, so each deploy re-reads the site and the clone can never quote a
 * page that no longer says that.
 *
 * Search is BM25 over plain words: a few hundred passages, scored in well
 * under a millisecond, with no embeddings service to call or to go down.
 */

export interface Passage {
  /** Where it came from, as the visitor would name it. */
  source: string;
  /** A path on the site the clone can send the visitor to. */
  path: string;
  text: string;
}

const MAX_PASSAGE_CHARS = 1_400;

function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case 'ul':
    case 'ol':
      return block.items.map((i) => `- ${plain(i)}`).join('\n');
    case 'table':
      return [block.caption, block.head.join(' | '), ...block.rows.map((r) => r.join(' | '))]
        .filter(Boolean)
        .map((l) => plain(l!))
        .join('\n');
    case 'figure':
      return plain(block.caption);
    default:
      return plain(block.text);
  }
}

function clip(text: string): string {
  if (text.length <= MAX_PASSAGE_CHARS) return text;
  const cut = text.slice(0, MAX_PASSAGE_CHARS);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('\n'));
  return `${cut.slice(0, end > 600 ? end + 1 : MAX_PASSAGE_CHARS).trim()} …`;
}

function articlePassages(article: Article): Passage[] {
  const base = `/articles/${article.slug}`;
  const out: Passage[] = [];
  let heading: string | null = null;
  let body: string[] = [`${article.excerpt}`];

  const flush = () => {
    const text = body.join('\n').trim();
    // A list of citations answers nothing on its own.
    if (!text || (heading && /^(sources|references|further reading)$/i.test(heading))) return;
    out.push({
      source: heading ? `Article "${article.title}", section "${heading}"` : `Article "${article.title}"`,
      path: heading ? `${base}#${headingId(heading)}` : base,
      text: clip(text),
    });
  };

  for (const block of article.blocks) {
    if (block.type === 'h2') {
      flush();
      heading = plain(block.text);
      body = [];
    } else {
      body.push(blockText(block));
    }
  }
  flush();

  for (const f of article.faq ?? []) {
    out.push({ source: `Article "${article.title}", FAQ`, path: base, text: `${plain(f.q)}\n${plain(f.a)}` });
  }
  return out;
}

function buildPassages(): Passage[] {
  const out: Passage[] = articles.flatMap(articlePassages);

  for (const p of projects) {
    const cs = p.caseStudy;
    const head = `${p.name}, ${p.subtitle}. My role: ${p.role} (${p.period}). ${p.summary}`;
    out.push({
      source: `Case study "${p.name}" (challenge and strategy)`,
      path: '/ (Projects app on the desktop)',
      text: clip([head, `Challenge: ${cs.challenge}`, 'Strategy:', ...cs.strategy.map((s) => `- ${s}`)].join('\n')),
    });
    out.push({
      source: `Case study "${p.name}" (execution, results and lessons)`,
      path: '/ (Projects app on the desktop)',
      text: clip(
        [
          head,
          'Execution:',
          ...cs.execution.map((s) => `- ${s}`),
          'Results:',
          ...cs.results.map((s) => `- ${s}`),
          'Lessons:',
          ...cs.lessons.map((s) => `- ${s}`),
        ].join('\n'),
      ),
    });
  }

  for (const m of timeline) {
    out.push({
      source: `Timeline: ${m.title}, ${m.org} (${m.year})`,
      path: '/ (Timeline app on the desktop)',
      text: clip([`${m.title}, ${m.org}, ${m.location}, ${m.year}. ${m.summary}`, ...m.details.map((d) => `- ${d}`)].join('\n')),
    });
  }

  for (const e of experience) {
    out.push({
      source: `Resume: ${e.role}, ${e.org}`,
      path: '/resume',
      text: clip(
        [`${e.role}, ${e.org}, ${e.period}, ${e.location}.`, ...e.bullets.map((b) => `- ${b}`)].join('\n'),
      ),
    });
  }

  return out;
}

// ------------------------------------------------------------------ search

const STOP = new Set(
  `a an and are as at be been but by can could did do does for from had has have how i if in into is it its me my
  of on or our so than that the their them then there these they this to was we were what when where which who
  why will with would you your about tell more much many any some also just like get got know want please ok
  okay archit jain sagar yes no not hi hello hey`.split(/\s+/),
);

/** Lowercase words with light suffix stripping, so "cancellations" meets "cancellation". */
export function terms(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9₹%]+/g, ' ')
    .split(' ')
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => (w.length > 4 ? w.replace(/ies$/, 'y').replace(/(ing|ed|es|s)$/, '').replace(/e$/, '') : w));
}

interface Indexed {
  passage: Passage;
  tf: Map<string, number>;
  length: number;
}

function index(passages: Passage[]) {
  const docs: Indexed[] = passages.map((passage) => {
    // The source line counts twice: a heading match is a strong signal.
    const words = [...terms(passage.source), ...terms(passage.source), ...terms(passage.text)];
    const tf = new Map<string, number>();
    for (const w of words) tf.set(w, (tf.get(w) ?? 0) + 1);
    return { passage, tf, length: words.length };
  });
  const df = new Map<string, number>();
  for (const d of docs) for (const w of d.tf.keys()) df.set(w, (df.get(w) ?? 0) + 1);
  const avg = docs.reduce((n, d) => n + d.length, 0) / Math.max(1, docs.length);
  return { docs, df, avg };
}

export const PASSAGES = buildPassages();
const INDEX = index(PASSAGES);

const K1 = 1.2;
const B = 0.75;

/**
 * The passages that best answer a question, best first, within a character
 * budget. A passage must share at least two distinct words with the question
 * (or its one word, for a one-word question), so a stray common word does not
 * drag in an unrelated page.
 */
export function searchPortfolio(query: string, { limit = 5, budget = 5_500 } = {}): Passage[] {
  const q = [...new Set(terms(query))];
  if (!q.length) return [];
  const n = INDEX.docs.length;
  const scored = INDEX.docs
    .map((d) => {
      let score = 0;
      let hits = 0;
      for (const w of q) {
        const f = d.tf.get(w);
        if (!f) continue;
        hits++;
        const idf = Math.log(1 + (n - (INDEX.df.get(w) ?? 0) + 0.5) / ((INDEX.df.get(w) ?? 0) + 0.5));
        score += (idf * f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.length) / INDEX.avg));
      }
      return { d, score, hits };
    })
    .filter((s) => s.hits >= Math.min(2, q.length))
    .sort((a, b) => b.score - a.score);

  const out: Passage[] = [];
  let used = 0;
  for (const s of scored) {
    if (out.length >= limit) break;
    // Weak tail matches cost prompt length and add noise.
    if (out.length && s.score < scored[0]!.score * 0.35) break;
    if (used + s.d.passage.text.length > budget) continue;
    out.push(s.d.passage);
    used += s.d.passage.text.length;
  }
  return out;
}

/** The passages as a prompt section, or an empty string when nothing matched. */
export function portfolioContext(query: string): string {
  const found = searchPortfolio(query);
  if (!found.length) return '';
  return [
    '## FROM MY PORTFOLIO PAGES (passages that match this question; quote them faithfully)',
    'These are from pages on my site. Use them when they answer the question, and give the visitor the path so they can read more. My own results must still match the verified context file above; if a passage seems to disagree with it, the context file wins. Figures about markets and sectors in my articles are research, not my results: never present them as things I achieved.',
    ...found.map((p) => `### ${p.source} (${p.path})\n${p.text}`),
  ].join('\n\n');
}
