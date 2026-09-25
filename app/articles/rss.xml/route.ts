import { articlesByDate } from '@/content/articles';
import { profile } from '@/content/profile';
import { SITE_URL } from '@/lib/site';
import { articleUrl } from '@/lib/seo';

export const dynamic = 'force-static';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS 2.0 feed of the articles. Feed readers and some search tools discover new posts through it. */
export function GET() {
  const items = articlesByDate()
    .map(
      (a) => `    <item>
      <title>${escape(a.title)}</title>
      <link>${articleUrl(a.slug)}</link>
      <guid isPermaLink="true">${articleUrl(a.slug)}</guid>
      <pubDate>${new Date(`${a.published}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${escape(a.category)}</category>
      <description>${escape(a.description)}</description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${profile.name}: Articles`)}</title>
    <link>${SITE_URL}/articles</link>
    <atom:link href="${SITE_URL}/articles/rss.xml" rel="self" type="application/rss+xml" />
    <description>Sector breakdowns, operating playbooks and investment theses from an operator.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
