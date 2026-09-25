import { profile } from '@/content/profile';
import { pressByPriority } from '@/content/press';
import { plain } from '@/content/articles';
import { SITE_URL } from '@/lib/site';
import type { Article } from '@/types';

/**
 * Structured data (schema.org JSON-LD).
 *
 * Search engines use this to understand that the site is a person's, that the
 * articles are written by that person, and which coverage is about them. The
 * `@id`s let every page point at one Person node instead of redefining it.
 */

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const absolute = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
export const articleUrl = (slug: string) => absolute(`/articles/${slug}`);

export function personSchema() {
  const press = pressByPriority();
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    alternateName: `${profile.firstName} ${profile.lastName}`,
    url: SITE_URL,
    description: profile.description,
    jobTitle: 'Head of Strategy & Growth',
    worksFor: { '@type': 'Organization', name: 'ZenCabs' },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Symbiosis Centre for Management Studies' },
      { '@type': 'CollegeOrUniversity', name: 'Masters’ Union' },
    ],
    homeLocation: { '@type': 'Place', name: profile.hometown },
    knowsAbout: [...profile.interests, 'Chief of Staff', 'Venture Capital'],
    sameAs: [profile.links.linkedin],
    ...(press.length
      ? {
          subjectOf: press.map((p) => ({
            '@type': 'NewsArticle',
            headline: p.title,
            url: p.url,
            ...(p.date ? { datePublished: p.date } : {}),
            publisher: { '@type': 'Organization', name: p.outlet },
          })),
        }
      : {}),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: profile.product,
    url: SITE_URL,
    inLanguage: 'en',
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  };
}

export function articleSchema(article: Article, wordCount: number) {
  const url = articleUrl(article.slug);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    datePublished: article.published,
    dateModified: article.updated ?? article.published,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
    articleSection: article.category,
    keywords: article.keywords.join(', '),
    wordCount,
    inLanguage: 'en',
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function faqSchema(article: Article) {
  if (!article.faq?.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: article.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
    })),
  };
}

/** One `@graph` per page, so the nodes can reference each other. */
export const graph = (...nodes: (object | null)[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean),
});
