'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Copy, FileText, PenLine, Search } from 'lucide-react';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import { useArticleIndex } from '@/components/windows/article-index';
import { cn } from '@/lib/utils';
import { WINDOW_META } from './icons';
import { AppIcon } from './app-icons';

/**
 * Spotlight: one box that finds anything on the site, as ⌘Space does on a Mac
 * (⌘K here, since the browser keeps ⌘Space). Apps, case studies, articles
 * and a few actions, matched on every word typed, with the arrow keys and
 * Enter to pick.
 */

interface Result {
  id: string;
  group: 'Applications' | 'Case studies' | 'Articles' | 'Actions';
  title: string;
  detail?: string;
  icon: React.ReactNode;
  /** A full app icon, drawn without the tinted well behind small glyphs. */
  bare?: boolean;
  keywords: string;
  run: () => void;
}

const GROUP_ORDER: Result['group'][] = ['Applications', 'Actions', 'Case studies', 'Articles'];

export function Spotlight({ onClose, onExit }: { onClose: () => void; onExit: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const open = useWindows((s) => s.open);
  const articles = useArticleIndex();

  const all: Result[] = useMemo(() => {
    const go = (fn: () => void) => () => {
      onClose();
      fn();
    };
    return [
      ...WINDOW_IDS.map((id) => {
        const meta = WINDOW_META[id];
        return {
          id: `app-${id}`,
          group: 'Applications' as const,
          title: meta.label,
          detail: meta.subtitle,
          icon: <AppIcon app={id} className="h-7 w-7" />,
          bare: true,
          keywords: `${meta.label} ${meta.subtitle} ${id}`,
          run: go(() => open(id)),
        };
      }),
      {
        id: 'act-email',
        group: 'Actions',
        title: 'Email Archit',
        detail: profile.links.email,
        icon: <AppIcon app="mail" className="h-7 w-7" />,
        bare: true,
        keywords: 'email contact mail hire reach',
        run: go(() => (window.location.href = `mailto:${profile.links.email}`)),
      },
      {
        id: 'act-copy',
        group: 'Actions',
        title: 'Copy email address',
        detail: profile.links.email,
        icon: <Copy className="h-4 w-4 text-faint" />,
        keywords: 'copy email address contact',
        run: go(() => void navigator.clipboard?.writeText(profile.links.email).catch(() => {})),
      },
      {
        id: 'act-linkedin',
        group: 'Actions',
        title: 'Open LinkedIn',
        detail: 'linkedin.com/in/archit-sagar-jain',
        icon: <AppIcon app="linkedin" className="h-7 w-7" />,
        bare: true,
        keywords: 'linkedin connect profile social',
        run: go(() => window.open(profile.links.linkedin, '_blank', 'noopener')),
      },
      {
        id: 'act-resume',
        group: 'Actions',
        title: 'Resume page (print or save as PDF)',
        icon: <FileText className="h-4 w-4 text-[#0e9f9f]" />,
        keywords: 'resume cv pdf download print',
        run: go(() => window.open('/resume', '_blank', 'noopener')),
      },
      {
        id: 'act-intro',
        group: 'Actions',
        title: 'Back to the intro',
        icon: <ArrowRight className="h-4 w-4 rotate-180 text-faint" />,
        keywords: 'intro home hero restart back quit',
        run: go(onExit),
      },
      ...projects.map((p) => ({
        id: `project-${p.slug}`,
        group: 'Case studies' as const,
        title: p.name,
        detail: p.subtitle,
        icon: <span className="h-3 w-3 rounded-[4px]" style={{ background: p.accent }} />,
        keywords: `${p.name} ${p.subtitle} ${p.role} ${p.tags.join(' ')} ${p.summary}`,
        run: go(() => open('projects')),
      })),
      ...articles.map((a) => ({
        id: `article-${a.slug}`,
        group: 'Articles' as const,
        title: a.title,
        detail: `${a.category} · ${a.minutes} min`,
        icon: <PenLine className="h-4 w-4 text-[#ff375f]" />,
        keywords: `${a.title} ${a.category} ${a.excerpt}`,
        run: go(() => (window.location.href = `/articles/${a.slug}`)),
      })),
    ];
  }, [articles, onClose, onExit, open]);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const matched = words.length
      ? all.filter((r) => {
          const hay = `${r.title} ${r.keywords}`.toLowerCase();
          return words.every((w) => hay.includes(w));
        })
      : all.filter((r) => r.group === 'Applications' || r.group === 'Actions');
    // Title matches first, then by group.
    const q = query.toLowerCase().trim();
    return matched
      .map((r) => ({ r, title: q && r.title.toLowerCase().includes(q) ? 0 : 1 }))
      .sort((a, b) => a.title - b.title || GROUP_ORDER.indexOf(a.r.group) - GROUP_ORDER.indexOf(b.r.group))
      .map((x) => x.r)
      .slice(0, 12);
  }, [all, query]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => input.current?.focus(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        setActive((i) => (results.length ? (i + step + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        results[active]?.run();
      }
    };
    // Capture: Escape here must not also close the window underneath.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active, onClose, results]);

  let lastGroup: string | null = null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="fixed inset-0 z-[960] flex items-start justify-center bg-black/10 px-3 pt-[12vh] backdrop-blur-[2px]"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-label="Spotlight Search"
        className="glass-strong w-full max-w-[640px] overflow-hidden rounded-2xl text-ink shadow-[var(--shadow-window)]"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-faint" />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Spotlight Search"
            aria-label="Search the site"
            aria-controls="spotlight-results"
            className="w-full bg-transparent text-[19px] text-ink outline-none placeholder:text-faint"
          />
          <kbd className="hidden rounded border border-black/10 px-1.5 text-[11px] text-faint sm:block">esc</kbd>
        </div>
        <div id="spotlight-results" role="listbox" className="max-h-[56vh] overflow-y-auto border-t border-black/10 p-1.5">
          {results.length === 0 && <p className="px-3 py-6 text-center text-[13px] text-faint">No results for “{query}”.</p>}
          {results.map((r, i) => {
            const heading = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            return (
              <div key={r.id}>
                {heading && (
                  <p className="px-2.5 pt-2 pb-1 text-[10.5px] font-semibold tracking-wide text-faint uppercase">{heading}</p>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onPointerEnter={() => setActive(i)}
                  onClick={r.run}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-[8px] px-2.5 py-2 text-left',
                    i === active ? 'bg-[#0a64d6] text-white' : 'text-ink',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px]',
                      !r.bare && (i === active ? 'bg-white/90' : 'bg-black/[0.05]'),
                    )}
                  >
                    {r.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium">{r.title}</span>
                    {r.detail && (
                      <span className={cn('block truncate text-[11.5px]', i === active ? 'text-white/75' : 'text-faint')}>
                        {r.detail}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
