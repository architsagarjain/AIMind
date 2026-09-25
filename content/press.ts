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
  {
    // Syndicated from The Business Stories. TODO(archit): replace the title
    // with the exact published headline, and add the date, once confirmed.
    outlet: 'Dailyhunt',
    title: 'Archit Sagar Jain, featured in The Business Stories',
    url: 'https://m.dailyhunt.in/news/india/english/thebusinessstories-epaper-dh81e4e6e2104e4dbbb7f32ee26194cfb7/-newsid-dh81e4e6e2104e4dbbb7f32ee26194cfb7_55734036c40741568aeda0b0bd28cac2',
    summary: 'A feature on Archit and his work, published by The Business Stories and carried on Dailyhunt.',
    featured: true,
  },
];

/** Featured first, then newest. */
export const pressByPriority = () =>
  [...press].sort(
    (a, b) =>
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.date ?? '').localeCompare(a.date ?? ''),
  );
