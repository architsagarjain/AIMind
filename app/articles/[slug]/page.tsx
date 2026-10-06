import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Clock, MessagesSquare, Plus } from 'lucide-react';
import {
  articles,
  getArticle,
  headingId,
  plain,
  readingMinutes,
  relatedArticles,
  wordCount,
} from '@/content/articles';
import { profile } from '@/content/profile';
import { ArticleBody, Inline } from '@/components/articles/article-body';
import { ArticlePhoto, PhotoCredit } from '@/components/articles/article-photo';
import { JsonLd } from '@/components/seo/json-ld';
import { articleSchema, articleUrl, breadcrumbSchema, faqSchema, graph } from '@/lib/seo';
import { INITIALS } from '@/lib/boot-content';
import { ReadingProgress } from '@/components/articles/reading-progress';
import { ShareBar } from '@/components/articles/share-bar';
import { TocRail } from '@/components/articles/toc-rail';

/** Every article is prerendered; an unknown slug is a 404, not a render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  const path = `/articles/${article.slug}`;
  return {
    // Absolute: the site-wide " — ARCHIT.AI" suffix would push these past
    // the length a search result shows.
    title: { absolute: article.seoTitle ?? article.title },
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: profile.name, url: '/' }],
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      title: article.title,
      description: article.description,
      publishedTime: article.published,
      modifiedTime: article.updated ?? article.published,
      authors: [profile.name],
      section: article.category,
      tags: article.keywords,
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.description },
  };
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const words = wordCount(article);
  const sections = article.blocks.filter((b) => b.type === 'h2');
  const related = relatedArticles(article);

  return (
    <article className="pb-8">
      <ReadingProgress targetId="article-body" />
      <JsonLd
        data={graph(
          articleSchema(article, words),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Articles', path: '/articles' },
            { name: article.title, path: `/articles/${article.slug}` },
          ]),
          faqSchema(article),
        )}
      />

      {/* ------------------------------------------------------------ header */}
      <header className="mx-auto max-w-[860px] px-4 pt-10 text-center sm:px-6 md:pt-16">
        <nav aria-label="Breadcrumb" className="text-[12px] text-faint">
          <ol className="flex flex-wrap items-center justify-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/articles" className="hover:text-ink">
                Articles
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-muted">{article.category}</li>
          </ol>
        </nav>

        <p className="article-rise mt-8 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-3.5 py-1.5 text-[10.5px] font-bold tracking-[0.22em] text-accent uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {article.category}
        </p>
        <h1 className="article-rise article-rise-2 mt-6 font-display text-[2.15rem] leading-[1.08] font-extrabold tracking-[-0.025em] text-balance text-ink sm:text-[2.8rem] md:text-[3.6rem]">
          {article.title}
        </h1>
        <p className="article-rise article-rise-3 mx-auto mt-6 max-w-[640px] font-[family-name:var(--font-serif)] text-[19px] leading-relaxed text-pretty text-muted md:text-[21px]">
          {article.excerpt}
        </p>

        <div className="article-rise article-rise-4 mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] text-faint">
          <Link href="/" rel="author" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-2))] font-display text-[11px] font-bold text-white">
              {INITIALS}
            </span>
            <span className="text-left leading-tight">
              <span className="block font-semibold text-ink group-hover:text-accent">{profile.name}</span>
              <span className="block text-[12px]">
                <time dateTime={article.published}>{formatDate(article.published)}</time>
                {article.updated && (
                  <>
                    {' · Updated '}
                    <time dateTime={article.updated}>{formatDate(article.updated)}</time>
                  </>
                )}
              </span>
            </span>
          </Link>
          <span aria-hidden className="hidden h-6 w-px bg-hairline-strong sm:block" />
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingMinutes(article)} min read
          </span>
        </div>
      </header>

      {/* -------------------------------------------------------------- hero */}
      <figure className="mx-auto mt-10 max-w-[1120px] px-4 sm:px-6 md:mt-14">
        <div className="article-hero overflow-hidden rounded-[22px] bg-[var(--tint-2)] shadow-[0_40px_80px_-40px_#1b171073]">
          <ArticlePhoto
            slug={article.slug}
            priority
            sizes="(min-width: 1120px) 1072px, 100vw"
            className="article-hero-img"
          />
        </div>
        <figcaption className="mt-3 px-1 text-center">
          <PhotoCredit slug={article.slug} />
        </figcaption>
      </figure>

      {/* -------------------------------------------------------------- body */}
      <div className="mx-auto mt-12 max-w-[1120px] px-4 sm:px-6 md:mt-16 lg:grid lg:grid-cols-[200px_minmax(0,700px)_200px] lg:justify-between lg:gap-10">
        <aside className="hidden lg:block">
          {sections.length >= 3 && (
            <div className="sticky top-24">
              <TocRail sections={sections.map((s) => ({ id: headingId(s.text), text: plain(s.text) }))} />
            </div>
          )}
        </aside>

        <div className="mx-auto w-full max-w-[700px] min-w-0">
          {/* Phones and tablets: the contents as a list above the text. */}
          {sections.length >= 5 && (
            <nav
              aria-label="On this page"
              className="mb-10 rounded-2xl border border-hairline bg-surface p-5 lg:hidden"
            >
              <p className="text-[10.5px] font-bold tracking-[0.2em] text-faint uppercase">On this page</p>
              <ol className="mt-3 grid gap-2 text-[14px] sm:grid-cols-2">
                {sections.map((s, i) => (
                  <li key={s.text}>
                    <a href={`#${headingId(s.text)}`} className="text-muted transition-colors hover:text-accent">
                      <span className="mr-1.5 font-mono text-[11px] text-accent/80">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {plain(s.text)}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div id="article-body">
            <ArticleBody blocks={article.blocks} />
          </div>

          <ShareBar url={articleUrl(article.slug)} title={article.title} className="mt-12 lg:hidden" />

          {/* ------------------------------------------------------------- FAQ */}
          {article.faq && article.faq.length > 0 && (
            <section className="mt-16" aria-labelledby="faq">
              <h2 id="faq" className="font-display text-[1.7rem] font-extrabold tracking-tight text-ink">
                Frequently asked questions
              </h2>
              <div className="mt-6 space-y-3">
                {article.faq.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-2xl border border-hairline bg-surface px-5 py-4 transition-colors open:border-accent/25 open:shadow-[var(--shadow-glow-sm)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[16.5px] font-bold text-ink [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <Plus className="h-4 w-4 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <p className="mt-3 text-[16px] leading-relaxed text-muted">
                      <Inline text={f.a} />
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* ---------------------------------------------------------- author */}
          <aside
            className="mt-16 overflow-hidden rounded-3xl border border-hairline bg-surface p-6 md:p-8"
            aria-label="About the author"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-2))] font-display text-sm font-bold text-white">
                {INITIALS}
              </span>
              <div>
                <p className="text-[10.5px] font-bold tracking-[0.2em] text-faint uppercase">Written by</p>
                <p className="mt-1 font-display text-xl font-extrabold text-ink">{profile.name}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{profile.description}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ask"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-void uppercase transition-colors hover:bg-accent"
              >
                <MessagesSquare className="h-3.5 w-3.5" />
                Ask my AI clone about this
              </Link>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-hairline-strong px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-ink uppercase transition-colors hover:border-accent/50"
              >
                LinkedIn
              </a>
            </div>
          </aside>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 flex justify-end">
            <ShareBar url={articleUrl(article.slug)} title={article.title} vertical />
          </div>
        </aside>
      </div>

      {/* ------------------------------------------------------------ related */}
      <section className="mx-auto mt-20 max-w-[1120px] px-4 sm:px-6" aria-labelledby="related">
        <div className="flex items-end justify-between gap-4 border-t border-hairline pt-10">
          <h2 id="related" className="font-display text-[1.7rem] font-extrabold tracking-tight text-ink">
            Keep reading
          </h2>
          <Link
            href="/articles"
            className="group inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.12em] text-accent uppercase"
          >
            All articles
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/articles/${r.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="overflow-hidden">
                  <ArticlePhoto
                    slug={r.slug}
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10.5px] font-bold tracking-[0.18em] text-accent uppercase">{r.category}</span>
                  <span className="mt-2 font-display text-[17px] leading-snug font-bold text-ink group-hover:text-accent">
                    {r.title}
                  </span>
                  <span className="mt-auto pt-4 text-[12px] text-faint">{readingMinutes(r)} min read</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
