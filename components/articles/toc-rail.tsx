'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * The contents list that rides alongside a long article on wide screens and
 * marks the section being read. The links are plain anchors, so it works
 * before (and without) JavaScript; the highlight is the enhancement.
 */
export function TocRail({ sections }: { sections: { id: string; text: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // The last heading whose top has passed a line a third of the way down.
      const line = window.innerHeight * 0.33;
      let current = headings[0]!.id;
      for (const h of headings) if (h.getBoundingClientRect().top <= line) current = h.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [sections]);

  const index = Math.max(0, sections.findIndex((s) => s.id === active));

  return (
    <nav aria-label="On this page" className="text-[13px]">
      <p className="text-[10.5px] font-bold tracking-[0.2em] text-faint uppercase">On this page</p>
      <div className="relative mt-4">
        {/* The track, and how far down it the reader is. */}
        <span className="absolute top-0 bottom-0 left-0 w-px bg-hairline-strong" aria-hidden />
        <span
          className="absolute top-0 left-0 w-px bg-accent transition-[height] duration-300"
          style={{ height: `${((index + 1) / sections.length) * 100}%` }}
          aria-hidden
        />
        <ol className="space-y-2.5">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={s.id === active ? 'location' : undefined}
                className={cn(
                  'block border-l-2 border-transparent pl-4 leading-snug transition-colors',
                  s.id === active ? '-ml-px border-accent font-semibold text-ink' : 'text-faint hover:text-ink',
                )}
              >
                <span className="mr-1.5 font-mono text-[10.5px] text-accent/80 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
