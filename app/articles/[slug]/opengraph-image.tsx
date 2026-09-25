import { articles, getArticle } from '@/content/articles';
import { profile } from '@/content/profile';
import { OG_SIZE, ogCard } from '@/lib/og-card';

export const alt = 'Article share card';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  return ogCard({
    kicker: article?.category ?? 'Articles',
    title: article?.title ?? profile.name,
    footer: `By ${profile.name}`,
  });
}
