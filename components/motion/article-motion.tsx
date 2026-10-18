'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll motion for the reading pages, with GSAP (gsap.com): SplitText and
 * ScrollTrigger, both free since GSAP 3.13.
 *
 * - Section headings rise into place word by word as they reach the reader,
 *   each word out of its own mask (the "rise" effect from React Bits'
 *   SplitText, github.com/DavidHDev/react-bits, MIT + Commons Clause).
 * - The hero photo drifts against the page while it is in view.
 * - Quotes, callouts and figures settle in as they arrive.
 *
 * GSAP loads only on these pages and only after they are interactive, and
 * nothing above the fold is hidden, so the first paint is untouched. The CSS
 * scroll-driven version in articles.css stays as the fallback when this does
 * not run, and under prefers-reduced-motion nothing moves at all.
 */

const HEADINGS = '.article-body > h2, main section > h2, main section > div > h2';
const BLOCKS = '.article-body > blockquote, .article-body > .article-callout, .article-body > figure';

export function ArticleMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let revert: (() => void) | null = null;
    const root = document.documentElement;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
        document.fonts?.ready,
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      // Hand the motion over from the CSS fallback before anything animates.
      root.classList.add('gsap-motion');
      const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;

      const ctx = gsap.context(() => {
        // Headings: only the ones still below the fold, so nothing the reader
        // can already see disappears.
        gsap.utils.toArray<HTMLElement>(HEADINGS).filter(below).forEach((heading) => {
          const split = SplitText.create(heading, { type: 'words', mask: 'words', wordsClass: 'split-word' });
          gsap.from(split.words, {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.045,
            scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
            onComplete: () => split.revert(),
          });
        });

        gsap.utils.toArray<HTMLElement>(BLOCKS).filter(below).forEach((block) => {
          gsap.from(block, {
            y: 32,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: block, start: 'top 90%', once: true },
          });
        });

        const photo = document.querySelector<HTMLElement>('.article-hero-img');
        if (photo) {
          gsap.fromTo(
            photo,
            { scale: 1.12, yPercent: -3.5 },
            {
              scale: 1.12,
              yPercent: 3.5,
              ease: 'none',
              scrollTrigger: { trigger: photo.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            },
          );
        }
      });

      // Images above load late and push content down; re-measure once they land.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh, { once: true });

      revert = () => {
        window.removeEventListener('load', refresh);
        ctx.revert();
        root.classList.remove('gsap-motion');
      };
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [pathname]);

  return null;
}
