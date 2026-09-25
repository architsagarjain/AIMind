import Link from 'next/link';

const LINKS = [
  { href: '/articles', label: 'Articles' },
  { href: '/ask', label: 'Ask Archit' },
  { href: '/resume', label: 'Resume' },
];

/** Header for the reading pages: plain links, so every page is reachable without JavaScript. */
export function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-hairline">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-base font-extrabold tracking-[0.2em] text-ink">
          ARCHIT.AI
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-7">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
