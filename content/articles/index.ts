import type { Article, ArticleBlock } from '@/types';
import { pushAndAbsorb } from './push-and-absorb';
import {
  first90DaysFoundersOffice,
  foundersOfficeVsChiefOfStaff,
  howToGetFoundersOfficeJob,
  weeklyOperatingCadence,
  whatIsFoundersOffice,
} from './founders-office';
import {
  breakIntoVentureCapital,
  foundersOfficeOrVentureCapital,
  marketplaceDueDiligence,
} from './venture-capital';

/** Every article, in the order the hub lists them within a category. */
export const articles: Article[] = [
  pushAndAbsorb,
  whatIsFoundersOffice,
  foundersOfficeVsChiefOfStaff,
  howToGetFoundersOfficeJob,
  weeklyOperatingCadence,
  first90DaysFoundersOffice,
  breakIntoVentureCapital,
  foundersOfficeOrVentureCapital,
  marketplaceDueDiligence,
];

export { CATEGORIES } from './categories';

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** Strips the two inline marks, for meta text, word counts and the AI clone. */
export const plain = (text: string) =>
  text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case 'ul':
    case 'ol':
      return block.items.join(' ');
    case 'table':
      return [...block.head, ...block.rows.flat()].join(' ');
    case 'figure':
      return block.caption;
    default:
      return block.text;
  }
}

export function wordCount(article: Article): number {
  const text = [...article.blocks.map(blockText), ...(article.faq ?? []).flatMap((f) => [f.q, f.a])]
    .map(plain)
    .join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

/** At about 220 words a minute, rounded up. */
export const readingMinutes = (article: Article) => Math.max(1, Math.ceil(wordCount(article) / 220));

/** Same category first, then the framework, then the rest; never the article itself. */
export function relatedArticles(article: Article, count = 3): Article[] {
  const others = articles.filter((a) => a.slug !== article.slug);
  const score = (a: Article) =>
    (a.category === article.category ? 2 : 0) + (a.category === 'Framework' ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, count);
}

/** Section headings, for the table of contents and anchor links. */
export const headingId = (text: string) =>
  plain(text)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Newest first, featured pinned on top. */
export const articlesByDate = () =>
  [...articles].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.published.localeCompare(a.published),
  );

/** What the desktop needs to list an article: no body, so it stays out of the client bundle. */
export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: Article['category'];
  minutes: number;
}

export const articleSummaries = (): ArticleSummary[] =>
  articlesByDate().map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    minutes: readingMinutes(a),
  }));
