import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Generated rather than a static file: the sitemap line must be an absolute
 * URL (search engines ignore a relative one, which is what the old static
 * robots.txt had), and the origin differs per deployment.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
