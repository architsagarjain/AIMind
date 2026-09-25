import type { MetadataRoute } from 'next';
import { articles } from '@/content/articles';
import { SITE_URL as base } from '@/lib/site';

/** Newest article date, so the hub's lastModified moves when something is published. */
const latest = articles.map((a) => a.updated ?? a.published).sort().at(-1);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${base}/articles`,
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...articles.map((a) => ({
      url: `${base}/articles/${a.slug}`,
      lastModified: a.updated ?? a.published,
      changeFrequency: 'monthly' as const,
      priority: a.featured ? 0.9 : 0.8,
    })),
    { url: `${base}/ask`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resume`, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
