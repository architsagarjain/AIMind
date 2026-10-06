import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Newspaper, Sparkles } from 'lucide-react';
import { articles, articlesByDate, articleSummaries, readingMinutes } from '@/content/articles';
import { pressByPriority } from '@/content/press';
import { apps } from '@/content/apps';
import { profile } from '@/content/profile';
import { JsonLd } from '@/components/seo/json-ld';
import { ArticlePhoto } from '@/components/articles/article-photo';
import { ArticleExplorer } from '@/components/articles/article-explorer';
import { articleUrl, breadcrumbSchema, graph, PERSON_ID, absolute } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'Sector Breakdowns, Playbooks and Theses | Archit Sagar Jain' },
  description:
    'Writing by Archit Sagar Jain: sector breakdowns of Indian mobility, weddings, construction and audit, operating playbooks, investment theses and the Push and Absorb framework.',
  alternates: {
    canonical: '/articles',
    types: { 'application/rss+xml': [{ url: '/articles/rss.xml', title: `${profile.name}: Articles` }] },
  },
  openGraph: {
    type: 'website',
    url: '/articles',
    title: `Writing by ${profile.name}`,
    description: 'Sector breakdowns, operating playbooks and investment theses from an operator.',
  },
};

/** The photos fanned out beside the hub's headline. */
const COLLAGE = ['indian-wedding-industry-breakdown', 'quick-commerce-india-economics', 'construction-equipment-rental-india'];

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function ArticlesPage() {
  const press = pressByPriority();
  const sorted = articlesByDate();
  const featured = sorted.find((a) => a.featured);
  // The two newest pieces sit beside the framework at the top.
  const latest = sorted.filter((a) => !a.featured).slice(0, 2);
  const summaries = articleSummaries().filter((a) => a.slug !== featured?.slug);
  const totalMinutes = articles.reduce((sum, a) => sum + readingMinutes(a), 0);
  const stats = [
    { value: String(articles.length), label: 'Essays and breakdowns' },
    { value: String(new Set(articles.map((a) => a.category)).size), label: 'Kinds of writing' },
    { value: `${Math.round(totalMinutes / 60)} hrs`, label: 'Of reading' },
  ];

  return (
    <div className="mx-auto max-w-[1120px] px-4 pt-12 sm:px-6 md:pt-20">
      <JsonLd
        data={graph(
          {
            '@type': 'CollectionPage',
            '@id': `${absolute('/articles')}#page`,
            name: `Writing by ${profile.name}`,
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

      <header className="relative lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-12">
        <div>
          <p className="article-rise inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-3.5 py-1.5 text-[10.5px] font-bold tracking-[0.22em] text-accent uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Writing
          </p>
          <h1 className="article-rise article-rise-2 mt-6 max-w-4xl font-display text-[2.5rem] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance text-ink sm:text-[3.4rem] md:text-[4.4rem]">
            How Indian businesses{' '}
            <span className="hub-mark">actually work</span>, from someone running them
          </h1>
          <p className="article-rise article-rise-3 mt-7 max-w-2xl font-[family-name:var(--font-serif)] text-[19px] leading-relaxed text-muted md:text-[21px]">
            Sector breakdowns built from public data and my own operating numbers, playbooks for the work that moved
            them, and the theses I would invest against. Drawn from ZenCabs, Shaadi Mangalam, PwC India, Equip9, MCCS
            Infra and Cairros.
          </p>
          <dl className="article-rise article-rise-4 mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-hairline pt-6">
            {stats.map((st) => (
              <div key={st.label}>
                <dt className="sr-only">{st.label}</dt>
                <dd className="font-display text-[1.9rem] leading-none font-extrabold tracking-tight text-ink md:text-[2.4rem]">
                  {st.value}
                </dd>
                <p className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">{st.label}</p>
              </div>
            ))}
          </dl>
        </div>

        {/* A fanned stack of the writing's photos: a hint of the range below. */}
        <div className="hub-collage relative hidden h-[440px] lg:block" aria-hidden>
          {COLLAGE.map((slug, i) => (
            <div key={slug} className={`hub-collage-card hub-collage-${i}`}>
              <ArticlePhoto slug={slug} sizes="600px" priority={i === 0} className="h-full" />
            </div>
          ))}
        </div>
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
                    {p.outlet}
                    {p.date && (
                      <>
                        {' · '}
                        <time dateTime={p.date}>{formatDate(p.date)}</time>
                      </>
                    )}
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

      {/* ------------------------------------------------------------- lead */}
      {featured && (
        <section aria-label="Featured" className="mt-14 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          {/* The framework: a full-bleed photo card with the headline set on it. */}
          <Link
            href={`/articles/${featured.slug}`}
            className="group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[26px] bg-ink p-7 md:min-h-[520px] md:p-10"
          >
            <ArticlePhoto
              slug={featured.slug}
              priority
              sizes="(min-width: 1024px) 640px, 100vw"
              className="absolute inset-0 -z-10 h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
            />
            <span
              className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#0b0d1200_20%,#0b0d12b3_62%,#0b0d12f2_100%)]"
              aria-hidden
            />
            <p className="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.22em] text-[#9eeaff] uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              An original framework
            </p>
            <h2 className="mt-4 max-w-xl font-display text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-white md:text-[2.9rem]">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-white/80">{featured.excerpt}</p>
            <p className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-[#16181d] uppercase transition-colors group-hover:bg-[#9eeaff]">
              Read the framework · {readingMinutes(featured)} min
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>

          <div className="grid gap-5">
            <p className="text-[10.5px] font-bold tracking-[0.2em] text-faint uppercase lg:hidden">Latest</p>
            {latest.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="group grid grid-cols-[38%_1fr] overflow-hidden rounded-[22px] border border-hairline bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[var(--shadow-glow)] lg:grid-cols-1"
              >
                <div className="overflow-hidden bg-[var(--tint-2)]">
                  <ArticlePhoto
                    slug={a.slug}
                    sizes="(min-width: 1024px) 400px, 40vw"
                    className="h-full transition-transform duration-700 group-hover:scale-[1.05] lg:h-auto"
                  />
                </div>
                <div className="flex flex-col p-4 md:p-5">
                  <span className="text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
                    Latest · {a.category}
                  </span>
                  <span className="mt-1.5 font-display text-[16px] leading-snug font-bold tracking-tight text-ink group-hover:text-accent md:text-[17.5px]">
                    {a.title}
                  </span>
                  <span className="mt-auto pt-2 text-[12px] text-faint">{readingMinutes(a)} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- explorer */}
      <section aria-labelledby="all-writing" className="mt-20 scroll-mt-24">
        <h2 id="all-writing" className="font-display text-[2rem] font-extrabold tracking-[-0.02em] text-ink">
          All writing
        </h2>
        <div className="mt-5">
          <ArticleExplorer articles={summaries} />
        </div>
      </section>

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
