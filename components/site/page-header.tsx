import Link from 'next/link';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/work-with-me', label: 'Work with me' },
  { href: '/articles', label: 'Articles' },
  { href: '/resume', label: 'Resume' },
] as const;

/** The header for the plain profile pages: a way home and the four pages that matter. */
export function PageHeader({ current }: { current?: (typeof LINKS)[number]['href'] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="shrink-0 font-display text-[14px] font-extrabold tracking-[0.14em] whitespace-nowrap text-ink sm:text-[15px] sm:tracking-[0.2em]">
          ARCHIT.AI
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
        </Link>
        <nav aria-label="Pages" className="-mr-2 flex min-w-0 items-center">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current === l.href ? 'page' : undefined}
              className={cn(
                'shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase transition-colors sm:px-3 sm:text-[12px]',
                current === l.href ? 'text-ink' : 'text-muted hover:text-ink',
                // Phones: the two pages that matter most; the others are linked on both.
                (l.href === '/resume' || l.href === '/articles') && 'hidden sm:block',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

/** Small uppercase section label, matching the rest of the site. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold tracking-[0.22em] text-accent uppercase">{children}</p>;
}
