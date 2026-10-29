import { headingId, plain } from '@/content/articles';
import { profile } from '@/content/profile';
import { absolute } from '@/lib/seo';
import type { Article, ArticleBlock } from '@/types';

/**
 * Article copies for other sites (Dev.to, Hashnode, Medium, LinkedIn), each
 * pointing back to the original here. Republished copies that name the
 * original as canonical send search credit home instead of competing with
 * it, and every one carries a link back: that is a backlink per platform.
 */

export const articleUrl = (a: Article) => absolute(`/articles/${a.slug}`);

/** Site-relative links in article text become absolute, so they work elsewhere. */
const absoluteLinks = (text: string) => text.replace(/\]\((\/[^)]*)\)/g, (_, path: string) => `](${absolute(path)})`);

const cell = (text: string) => absoluteLinks(text).replace(/\|/g, '\\|');

function block(b: ArticleBlock, url: string): string {
  switch (b.type) {
    case 'p':
      return absoluteLinks(b.text);
    case 'h2':
      return `## ${plain(b.text)}`;
    case 'h3':
      return `### ${plain(b.text)}`;
    case 'ul':
      return b.items.map((i) => `- ${absoluteLinks(i)}`).join('\n');
    case 'ol':
      return b.items.map((i, n) => `${n + 1}. ${absoluteLinks(i)}`).join('\n');
    case 'quote':
      return `> ${absoluteLinks(b.text)}`;
    case 'callout':
      return `> **Note:** ${absoluteLinks(b.text)}`;
    case 'table':
      return [
        `| ${b.head.map(cell).join(' | ')} |`,
        `| ${b.head.map(() => '---').join(' | ')} |`,
        ...b.rows.map((r) => `| ${r.map(cell).join(' | ')} |`),
        ...(b.caption ? ['', `*${absoluteLinks(b.caption)}*`] : []),
      ].join('\n');
    case 'figure':
      return `*Figure: ${absoluteLinks(b.caption)} (the diagram is in the [original](${url}#${headingId(b.caption)}).)*`;
  }
}

/** Dev.to and Hashnode allow four tags of plain lowercase letters and digits. */
const tags = (a: Article) =>
  [...new Set(a.keywords.map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, '')).filter((k) => k.length > 2 && k.length < 25))].slice(0, 4);

/** Markdown with front matter Dev.to and Hashnode read, including canonical_url. */
export function articleMarkdown(a: Article): string {
  const url = articleUrl(a);
  return [
    '---',
    `title: ${JSON.stringify(plain(a.title))}`,
    `description: ${JSON.stringify(a.description)}`,
    `canonical_url: ${url}`,
    `tags: ${tags(a).join(', ')}`,
    '---',
    '',
    `*Originally published at [architsagarjain.com](${url}).*`,
    '',
    ...a.blocks.map((b) => block(b, url)).flatMap((t) => [t, '']),
    ...(a.faq?.length
      ? ['## Frequently asked questions', '', ...a.faq.flatMap((f) => [`**${plain(f.q)}**`, '', absoluteLinks(f.a), ''])]
      : []),
    '---',
    '',
    `*I'm ${profile.name}. I write about how Indian businesses actually work, from the operator's seat. More at [architsagarjain.com/articles](${absolute('/articles')}), or find me on [LinkedIn](${profile.links.linkedin}).*`,
    '',
  ].join('\n');
}

/** A LinkedIn post: the hook, the point, the link, and three hashtags. */
export function linkedInPost(a: Article): string {
  const hashtags = a.keywords
    .slice(0, 3)
    .map((k) => `#${k.replace(/[^A-Za-z0-9]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : '')).replace(/^./, (c) => c.toUpperCase())}`);
  return [plain(a.title), '', plain(a.excerpt), '', `I wrote the full piece here: ${articleUrl(a)}`, '', hashtags.join(' ')].join('\n');
}
