'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';

/**
 * Smooth wheel scrolling with Lenis (github.com/darkroomengineering/lenis).
 *
 * Only for a mouse or trackpad: touch screens already scroll smoothly, and
 * Lenis leaves them native. Off under prefers-reduced-motion. Lenis loads
 * after the page is interactive, so it costs nothing on the first paint.
 * Scroll areas inside the page (windows, menus) keep their own scrolling.
 */

let current: Lenis | null = null;

/** The running instance, if any, so callers can scroll through it. */
export const getLenis = () => current;

/** Scroll the page to a position, smoothly when Lenis is running. */
export function scrollPageTo(top: number, opts: { smooth?: boolean } = {}) {
  const smooth = opts.smooth ?? true;
  if (current) current.scrollTo(top, { immediate: !smooth, duration: smooth ? 1.6 : 0 });
  else window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
}

export function SmoothScroll({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let lenis: Lenis | null = null;
    let cancelled = false;
    void import('lenis').then(({ default: LenisClass }) => {
      if (cancelled) return;
      lenis = new LenisClass({
        autoRaf: true,
        lerp: 0.1,
        allowNestedScroll: true,
        // In-page links (the table of contents) glide too, and respect each
        // heading's scroll-margin under the sticky header.
        anchors: true,
      });
      current = lenis;
    });

    return () => {
      cancelled = true;
      lenis?.destroy();
      if (current === lenis) current = null;
    };
  }, [enabled]);

  return null;
}
