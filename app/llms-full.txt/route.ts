import { articlesByDate } from '@/content/articles';
import { llmsArticleList, llmsProfileDetail, llmsSummary } from '@/lib/llms';
import { articleMarkdown } from '@/lib/syndicate';

/**
 * The whole site as one Markdown file: the profile, every case study and
 * role, and every article in full. For AI tools that take a single file.
 */
export const dynamic = 'force-static';

export function GET() {
  const body = [
    ...llmsSummary(),
    '',
    ...llmsProfileDetail(),
    ...llmsArticleList(),
    '',
    '# Articles in full',
    '',
    ...articlesByDate().map((a) => articleMarkdown(a)),
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
