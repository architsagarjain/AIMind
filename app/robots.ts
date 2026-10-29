import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Generated rather than a static file: the sitemap line must be an absolute
 * URL (search engines ignore a relative one, which is what the old static
 * robots.txt had), and the origin differs per deployment.
 *
 * AI crawlers are named and welcomed explicitly. The point of the site is to
 * be found when someone asks an assistant about GTM and strategy people in
 * India, and some hosts and templates block these bots by default.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'meta-externalagent',
  'MistralAI-User',
  'DuckAssistBot',
];

const PRIVATE = ['/api/', '/syndicate'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
