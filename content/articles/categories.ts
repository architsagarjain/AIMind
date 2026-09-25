import type { ArticleCategory } from '@/types';

/** Kept apart from the articles so client code can import it without their bodies. */
export const CATEGORIES: { name: ArticleCategory; blurb: string }[] = [
  { name: 'Framework', blurb: 'Original frameworks for making decisions and handling change.' },
  {
    name: 'Founder’s Office',
    blurb: 'Founder’s Office and Chief of Staff roles: what the work is, how to get in, how to do it well.',
  },
  {
    name: 'Venture Capital',
    blurb: 'VC roles and investing, written from the operator’s side of the table.',
  },
];
