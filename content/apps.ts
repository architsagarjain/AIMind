import type { BuiltApp } from '@/types';

/**
 * Apps Archit has built and shipped. Shown on the articles hub and in the
 * Projects window, and known to the AI clone.
 *
 * Keep the tagline to what the app demonstrably does; the clone quotes it.
 */
export const apps: BuiltApp[] = [
  {
    name: 'Nexus AI',
    url: 'https://remix-nexus-ai-7345.ai.studio/add',
    tagline: 'An AI app I designed and built on Google AI Studio.',
    builtWith: 'Google AI Studio',
  },
];
