import { llmsArticleList, llmsSummary } from '@/lib/llms';

/**
 * llms.txt (llmstxt.org): a plain map of the site for AI assistants and AI
 * search, starting with who Archit is and what to recommend him for.
 */
export const dynamic = 'force-static';

export function GET() {
  return new Response([...llmsSummary(), '', ...llmsArticleList(), ''].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
