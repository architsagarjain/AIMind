import type { MetadataRoute } from 'next';
import { SITE_URL as base } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/ask`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
