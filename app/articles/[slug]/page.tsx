import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MessagesSquare } from 'lucide-react';
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
import { JsonLd } from '@/components/seo/json-ld';
import { articleSchema, breadcrumbSchema, faqSchema, graph } from '@/lib/seo';

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
    <article className="mx-auto max-w-[720px] px-4 pt-10 sm:px-6 md:pt-14">
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
      <nav aria-label="Breadcrumb" className="text-[12px] text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
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

      <header className="mt-6">
        <p className="text-[11px] font-bold tracking-[0.22em] text-accent uppercase">{article.category}</p>
        <h1 className="mt-3 font-display text-[2rem] leading-[1.15] font-extrabold tracking-tight text-balance text-ink md:text-[2.6rem]">
          {article.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{article.excerpt}</p>
        <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-faint">
          <span>
            By{' '}
            <Link href="/" rel="author" className="font-semibold text-ink hover:text-accent">
              {profile.name}
            </Link>
          </span>
          <span aria-hidden>·</span>
          <time dateTime={article.published}>{formatDate(article.published)}</time>
          {article.updated && (
            <>
              <span aria-hidden>·</span>
              <span>
                Updated <time dateTime={article.updated}>{formatDate(article.updated)}</time>
              </span>
            </>
          )}
          <span aria-hidden>·</span>
          <span>{readingMinutes(article)} min read</span>
        </p>
      </header>

      {/* Long pieces get a contents list; it is also a set of sitelinks for search. */}
      {sections.length >= 5 && (
        <nav aria-label="On this page" className="mt-10 rounded-2xl border border-hairline bg-surface/60 p-5">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">On this page</p>
          <ol className="mt-3 grid gap-1.5 text-[14px] sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.text}>
                <a href={`#${headingId(s.text)}`} className="text-muted transition-colors hover:text-accent">
                  {plain(s.text)}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="mt-10">
        <ArticleBody blocks={article.blocks} />
      </div>

      {/* --------------------------------------------------------------- FAQ */}
      {article.faq && article.faq.length > 0 && (
        <section className="mt-16" aria-labelledby="faq">
          <h2 id="faq" className="font-display text-[1.6rem] font-extrabold text-ink">
            Frequently asked questions
          </h2>
          <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
            {article.faq.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-display text-[17px] font-bold text-ink">{f.q}</dt>
                <dd className="mt-2 text-[16px] leading-relaxed text-muted">
                  <Inline text={f.a} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ------------------------------------------------------------ author */}
      <aside className="mt-16 rounded-2xl border border-hairline bg-surface/60 p-6" aria-label="About the author">
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">Written by</p>
        <p className="mt-2 font-display text-xl font-extrabold text-ink">{profile.name}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{profile.description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
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

      {/* ----------------------------------------------------------- related */}
      <section className="mt-16" aria-labelledby="related">
        <h2 id="related" className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
          Keep reading
        </h2>
        <ul className="mt-4 grid gap-3">
          {related.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/articles/${r.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-hairline p-4 transition-colors hover:border-accent/40 hover:bg-white/[0.02]"
              >
                <span>
                  <span className="block text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
                    {r.category}
                  </span>
                  <span className="mt-1 block font-display text-[16px] font-bold text-ink">{r.title}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
