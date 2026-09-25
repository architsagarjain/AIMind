import type { ArticleCategory } from '@/types';

/**
 * Kept apart from the articles so client code can import it without their
 * bodies. Order is the order the hub shows them in.
 */
export const CATEGORIES: { name: ArticleCategory; label: string; blurb: string }[] = [
  {
    name: 'Framework',
    label: 'Frameworks',
    blurb: 'Original frameworks for making decisions and handling change.',
  },
  {
    name: 'Sector Breakdown',
    label: 'Sector breakdowns',
    blurb: 'How an industry works, with public numbers, from inside a business operating in it.',
  },
  {
    name: 'Operating Playbook',
    label: 'Operating playbooks',
    blurb: 'Specific pieces of operating work, how they were done, and what they moved.',
  },
  {
    name: 'Investment Thesis',
    label: 'Investment theses',
    blurb: 'How I would evaluate and back businesses, argued from what I have run.',
  },
  {
    name: 'Thought Piece',
    label: 'Thought pieces',
    blurb: 'Opinions and lessons from the work, including where I changed my mind.',
  },
];
