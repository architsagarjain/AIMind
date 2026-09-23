import { AnimatedGrid } from '@/components/ui/animated-grid';

/**
 * Reference usage for `AnimatedGrid`.
 *
 * `app/_demos` is a Next.js private folder (leading underscore), so this is not
 * a route and is never bundled — it exists to show the intended composition:
 * a `relative` parent, the grid as the base layer, content lifted above it.
 *
 * The upstream demo used shadcn's `bg-background` / `text-foreground` names;
 * this design system calls the same things `void`, `ink` and `muted`.
 */
export default function AnimatedGridDemo() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-void">
      <AnimatedGrid />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Build faster.</h1>
        <p className="max-w-md text-muted">
          A CSS-only animated grid backdrop for heroes and section backgrounds.
        </p>
      </div>
    </div>
  );
}
