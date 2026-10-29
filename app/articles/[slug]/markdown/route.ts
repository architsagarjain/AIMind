import { notFound } from 'next/navigation';
import { articles, getArticle } from '@/content/articles';
import { articleMarkdown, articleUrl } from '@/lib/syndicate';

/**
 * The article as Markdown, for republishing on Dev.to, Hashnode and the like
 * (see /syndicate) and for AI tools that read Markdown more cleanly than
 * HTML. Search engines are told the HTML page is the original, so this copy
 * never competes with it.
 */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return new Response(articleMarkdown(article), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      Link: `<${articleUrl(article)}>; rel="canonical"`,
    },
  });
}
