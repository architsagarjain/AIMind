import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Newspaper, Sparkles } from 'lucide-react';
import { articles, articlesByDate, CATEGORIES, readingMinutes } from '@/content/articles';
import { pressByPriority } from '@/content/press';
import { apps } from '@/content/apps';
import { profile } from '@/content/profile';
import { JsonLd } from '@/components/seo/json-ld';
import { articleUrl, breadcrumbSchema, graph, PERSON_ID, absolute } from '@/lib/seo';
import type { Article } from '@/types';

export const metadata: Metadata = {
  title: { absolute: 'Articles on Founder’s Office, Chief of Staff and VC Roles | Archit Sagar Jain' },
  description:
    'Articles by Archit Sagar Jain on Founder’s Office and Chief of Staff roles, breaking into venture capital, and the Push and Absorb framework for handling change.',
  alternates: {
    canonical: '/articles',
    types: { 'application/rss+xml': [{ url: '/articles/rss.xml', title: `${profile.name}: Articles` }] },
  },
  openGraph: {
    type: 'website',
    url: '/articles',
    title: `Articles by ${profile.name}`,
    description: 'Founder’s Office, Chief of Staff and venture capital roles, from an operator.',
  },
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

function Card({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-hairline bg-surface/60 p-5 transition-colors hover:border-accent/40 hover:bg-surface-raised"
    >
      <h3 className="font-display text-[17px] leading-snug font-bold text-ink group-hover:text-accent">
        {article.title}
      </h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{article.excerpt}</p>
      <p className="mt-4 text-[12px] text-faint">
        <time dateTime={article.published}>{formatDate(article.published)}</time> · {readingMinutes(article)} min
        read
      </p>
    </Link>
  );
}

export default function ArticlesPage() {
  const press = pressByPriority();
  const sorted = articlesByDate();
  const featured = sorted.find((a) => a.featured);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 md:pt-16">
      <JsonLd
        data={graph(
          {
            '@type': 'CollectionPage',
            '@id': `${absolute('/articles')}#page`,
            name: `Articles by ${profile.name}`,
            url: absolute('/articles'),
            author: { '@id': PERSON_ID },
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: articles.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: articleUrl(a.slug),
                name: a.title,
              })),
            },
          },
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Articles', path: '/articles' },
          ]),
        )}
      />

      <header className="max-w-3xl">
        <p className="text-[11px] font-bold tracking-[0.22em] text-accent uppercase">Writing</p>
        <h1 className="mt-3 font-display text-[2.2rem] leading-[1.1] font-extrabold tracking-tight text-balance text-ink md:text-5xl">
          Founder’s Office, Chief of Staff and venture capital, from an operator
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          What these roles really involve, how to get into them, and the frameworks I use to make decisions. Written
          from the operating side: PwC India, Cairros, and running strategy and growth at ZenCabs.
        </p>
      </header>

      {/* ------------------------------------------------------------- press */}
      {press.length > 0 && (
        <section aria-labelledby="press" className="mt-12">
          <h2 id="press" className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
            <Newspaper className="h-3.5 w-3.5 text-accent" />
            Featured in
          </h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {press.map((p, i) => (
              <li key={p.url} className={i === 0 && p.featured ? 'md:col-span-2' : undefined}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="group flex h-full flex-col rounded-2xl border border-accent/25 bg-accent-soft/40 p-5 transition-colors hover:border-accent/60"
                >
                  <span className="text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                    {p.outlet} · <time dateTime={p.date}>{formatDate(p.date)}</time>
                  </span>
                  <span className="mt-2 flex items-start justify-between gap-3 font-display text-lg leading-snug font-bold text-ink">
                    {p.title}
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-faint group-hover:text-accent" />
                  </span>
                  {p.summary && <span className="mt-2 text-[14px] leading-relaxed text-muted">{p.summary}</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------------------------------------------------------- featured */}
      {featured && (
        <section aria-label="Featured article" className="mt-12">
          <Link
            href={`/articles/${featured.slug}`}
            className="group block rounded-3xl border border-hairline-strong bg-gradient-to-br from-surface-raised to-surface p-7 transition-colors hover:border-accent/50 md:p-10"
          >
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-accent uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              An original framework
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-2xl leading-tight font-extrabold text-ink md:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">{featured.excerpt}</p>
            <p className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] text-ink uppercase">
              Read the framework · {readingMinutes(featured)} min
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        </section>
      )}

      {/* -------------------------------------------------------- categories */}
      {CATEGORIES.filter((c) => c.name !== 'Framework').map((category) => {
        const list = sorted.filter((a) => a.category === category.name && !a.featured);
        if (!list.length) return null;
        return (
          <section key={category.name} aria-labelledby={category.name} className="mt-16">
            <h2 id={category.name} className="font-display text-2xl font-extrabold text-ink">
              {category.name === 'Founder’s Office' ? 'Founder’s Office and Chief of Staff' : category.name}
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] text-muted">{category.blurb}</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => (
                <li key={a.slug}>
                  <Card article={a} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {/* -------------------------------------------------------------- apps */}
      {apps.length > 0 && (
        <section aria-labelledby="built" className="mt-16">
          <h2 id="built" className="font-display text-2xl font-extrabold text-ink">
            Things I have built
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {apps.map((app) => (
              <li key={app.url}>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener"
                  className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-hairline bg-surface/60 p-5 transition-colors hover:border-accent/40"
                >
                  <span>
                    <span className="block font-display text-lg font-bold text-ink group-hover:text-accent">
                      {app.name}
                    </span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-muted">{app.tagline}</span>
                    <span className="mt-3 block text-[12px] text-faint">Built with {app.builtWith}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-faint group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
