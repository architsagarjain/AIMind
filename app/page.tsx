import { ExperienceShell } from '@/components/experience-shell';

/**
 * The whole experience is one route.
 *
 * Hero, cinematic and desktop share a single canvas and a single scroll
 * context, so splitting them across routes would mean tearing down the WebGL
 * context on every navigation. The desktop's windows are the "pages".
 */
export default function HomePage() {
  return <ExperienceShell />;
}
