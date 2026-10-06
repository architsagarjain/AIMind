'use client';

import { useEffect, useRef } from 'react';

/**
 * A hairline across the top of the page that fills as the article is read.
 * Measured against the article body, so the header and footer do not count,
 * and written straight to the element's style: no React render per frame.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !bar.current) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const read = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - rect.top) / Math.max(total, 1)));
      bar.current!.style.transform = `scaleX(${read})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden>
      <div
        ref={bar}
        className="h-full origin-left bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2))]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
