'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '@/content/articles/categories';
import { useArticleIndex } from './article-index';
import { pressByPriority } from '@/content/press';
import { SectionLabel } from '@/components/ui/section-label';
import { useTelemetry } from '@/lib/hooks/use-telemetry';

/**
 * The articles, as a desktop window. Each one opens its own page in a new tab,
 * so reading does not throw away the desktop session; the pages themselves are
 * the static, indexable versions.
 */
export function WritingWindow() {
  const track = useTelemetry();
  const sorted = useArticleIndex();
  const press = pressByPriority();

  return (
    <div className="relative px-7 py-8">
      <div className="bloom top-[-6rem] right-[-6rem] h-64 w-64" />

      <div className="relative">
        <SectionLabel>Writing</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">Articles & frameworks</h2>
        <p className="mt-2 max-w-lg text-sm text-muted">
          Sector breakdowns, operating playbooks and investment theses from the businesses I have run, plus the
          Push and Absorb framework I use to make decisions.
        </p>

        {press.length > 0 && (
          <div className="mt-7">
            <SectionLabel>Featured in</SectionLabel>
            <ul className="mt-3 space-y-2">
              {press.map((p) => (
                <li key={p.url}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener"
                    onClick={() => track('press_opened', { outlet: p.outlet })}
                    className="group flex items-start justify-between gap-3 rounded-xl border border-accent/25 bg-accent/[0.05] p-4 transition-colors hover:border-accent/50"
                  >
                    <span>
                      <span className="block text-[10px] font-bold tracking-[0.18em] text-accent uppercase">{p.outlet}</span>
                      <span className="mt-1 block text-[14px] font-semibold text-ink">{p.title}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-faint group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {CATEGORIES.map((category) => {
          const list = sorted.filter((a) => a.category === category.name);
          if (!list.length) return null;
          return (
            <div key={category.name} className="mt-8">
              <SectionLabel>{category.label}</SectionLabel>
              <ul className="mt-3 space-y-2">
                {list.map((a, i) => (
                  <motion.li
                    key={a.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={`/articles/${a.slug}`}
                      target="_blank"
                      rel="noopener"
                      onClick={() => track('article_opened', { article: a.slug, source: 'desktop' })}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-hairline-strong surface-1 p-4 transition-colors hover:border-accent/40 hover:surface-2"
                    >
                      <span>
                        <span className="block font-display text-[15px] font-bold text-ink">{a.title}</span>
                        <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">{a.excerpt}</span>
                        <span className="mt-2 block text-[11px] text-faint">{a.minutes} min read</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          );
        })}

        <a
          href="/articles"
          target="_blank"
          rel="noopener"
          className="mt-8 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-accent uppercase"
        >
          All articles
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
