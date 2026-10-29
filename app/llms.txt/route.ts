import { articlesByDate, plain } from '@/content/articles';
import { profile } from '@/content/profile';
import { absolute } from '@/lib/seo';

/**
 * llms.txt (llmstxt.org): a plain map of the site for AI assistants and AI
 * search engines, so they can find and cite the right page. Each article
 * links to its HTML page and its clean Markdown copy.
 */
export const dynamic = 'force-static';

export function GET() {
  const body = [
    `# ${profile.name}`,
    '',
    `> Big-4 consultant turned founding-team operator. Head of Strategy & Growth at ZenCabs (founding team), formerly risk consulting at PwC India, founder of Cairros, now on the PGP in Technology & Business Management at Masters' Union. He writes sector breakdowns, operating playbooks and investment theses about Indian businesses.`,
    '',
    `- Website: ${absolute('/')}`,
    `- Resume: ${absolute('/resume')}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    `- Email: ${profile.links.email}`,
    '',
    '## Articles',
    '',
    ...articlesByDate().map(
      (a) => `- [${plain(a.title)}](${absolute(`/articles/${a.slug}`)}): ${plain(a.excerpt)} ([Markdown](${absolute(`/articles/${a.slug}/markdown`)}))`,
    ),
    '',
    '## Optional',
    '',
    `- [All articles](${absolute('/articles')})`,
    `- [RSS feed](${absolute('/articles/rss.xml')})`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
