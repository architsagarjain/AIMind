import Link from 'next/link';

const LINKS = [
  { href: '/articles', label: 'Articles' },
  { href: '/ask', label: 'Ask Archit' },
  { href: '/resume', label: 'Resume' },
];

/** Header for the reading pages: plain links, so every page is reachable without JavaScript. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-[color-mix(in_srgb,var(--color-void)_82%,transparent)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0 font-display text-[15px] font-extrabold tracking-[0.14em] whitespace-nowrap text-ink sm:text-base sm:tracking-[0.2em]">
          ARCHIT.AI
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-3.5 sm:gap-7">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[10.5px] font-semibold tracking-[0.1em] whitespace-nowrap text-muted uppercase transition-colors hover:text-ink sm:text-[11px] sm:tracking-[0.14em]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
