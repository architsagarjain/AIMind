'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { ArticleSummary } from '@/content/articles';
import { CATEGORIES } from '@/content/articles/categories';
import { useReducedMotion } from '@/lib/hooks/use-preferences';
import { cn } from '@/lib/utils';
import { ArticlePhoto } from './article-photo';

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

/**
 * Every article as one grid, filtered by topic. The server renders the full
 * list (the "All" view), so every link is in the HTML for crawlers; the
 * chips only narrow what is shown.
 */
export function ArticleExplorer({ articles }: { articles: ArticleSummary[] }) {
  const reduced = useReducedMotion();
  const [topic, setTopic] = useState<string>('All');
  const topics = useMemo(
    () =>
      CATEGORIES.map((c) => ({ ...c, count: articles.filter((a) => a.category === c.name).length })).filter(
        (c) => c.count > 0,
      ),
    [articles],
  );
  const shown = topic === 'All' ? articles : articles.filter((a) => a.category === topic);
  const blurb = topics.find((t) => t.name === topic)?.blurb;

  return (
    <div>
      <div
        role="toolbar"
        aria-label="Filter by topic"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {[{ name: 'All', label: 'All', count: articles.length }, ...topics].map((t) => {
          const on = topic === t.name;
          return (
            <button
              key={t.name}
              type="button"
              aria-pressed={on}
              onClick={() => setTopic(t.name)}
              className={cn(
                'relative shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors',
                on ? 'border-ink text-void' : 'border-hairline-strong bg-surface text-muted hover:border-ink/40 hover:text-ink',
              )}
            >
              {on && (
                <motion.span
                  layoutId="topic-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">
                {t.label}
                <span className={cn('ml-1.5 text-[11px] tabular-nums', on ? 'text-void/70' : 'text-faint')}>{t.count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 min-h-[1.5em] text-[15px] text-muted" aria-live="polite">
        {blurb ?? 'Sector breakdowns, operating playbooks, investment theses and thought pieces, newest first.'}
      </p>

      <motion.ul layout={!reduced} className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((a) => (
            <motion.li
              key={a.slug}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/articles/${a.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="relative overflow-hidden bg-[var(--tint-2)]">
                  <ArticlePhoto
                    slug={a.slug}
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#fffdf9e6] px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-accent uppercase backdrop-blur">
                    {a.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[17.5px] leading-snug font-bold tracking-tight text-ink group-hover:text-accent">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-[14px] leading-relaxed text-muted">{a.excerpt}</p>
                  <p className="mt-4 flex items-center justify-between text-[12px] text-faint">
                    <time dateTime={a.published}>{formatDate(a.published)}</time>
                    <span>{a.minutes} min read</span>
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
