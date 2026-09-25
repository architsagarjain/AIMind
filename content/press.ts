import type { PressMention } from '@/types';

/**
 * Coverage of Archit elsewhere. Rendered as "Featured in" on the articles hub
 * and the resume, and emitted as structured data so search engines can link
 * the coverage to him.
 *
 * Only real, published pieces go here, with their exact headline and URL.
 * `featured: true` puts an entry first; the Dailyhunt coverage is the lead.
 * The section hides itself while this list is empty.
 */
export const press: PressMention[] = [
  // {
  //   outlet: 'Dailyhunt',
  //   title: 'Exact headline as published',
  //   url: 'https://m.dailyhunt.in/news/...',
  //   date: '2026-09-01',
  //   summary: 'One line on what the piece covers.',
  //   featured: true,
  // },
];

/** Featured first, then newest. */
export const pressByPriority = () =>
  [...press].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.date.localeCompare(a.date),
  );
