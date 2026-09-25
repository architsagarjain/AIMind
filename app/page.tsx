import type { Metadata } from 'next';
import { ExperienceShell } from '@/components/experience-shell';
import { ArticleIndexProvider } from '@/components/windows/article-index';
import { articleSummaries } from '@/content/articles';

export const metadata: Metadata = { alternates: { canonical: '/' } };

/**
 * The whole experience is one route.
 *
 * Hero, cinematic and desktop share a single canvas and a single scroll
 * context, so splitting them across routes would mean tearing down the WebGL
 * context on every navigation. The desktop's windows are the "pages".
 */
export default function HomePage() {
  return (
    <ArticleIndexProvider value={articleSummaries()}>
      <ExperienceShell />
    </ArticleIndexProvider>
  );
}
