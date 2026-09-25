'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
] as const;

export type NavTarget = (typeof LINKS)[number]['id'];

export function Nav({
  onNavigate,
  onTalk,
  active = 'home',
  fade = 1,
}: {
  onNavigate: (target: NavTarget) => void;
  onTalk: () => void;
  active?: NavTarget;
  /** Dissolves with the hero copy so the dive ends on the screen alone. */
  fade?: number;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-8"
      style={{ opacity: fade, pointerEvents: fade < 0.2 ? 'none' : 'auto' }}
    >
      {/* Wordmark */}
      <button
        onClick={() => onNavigate('home')}
        className="group text-left"
        aria-label={`${profile.product} — home`}
      >
        <span className="block font-display text-lg font-extrabold tracking-[0.22em] text-ink md:text-xl">
          ARCHIT.AI
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle shadow-[var(--shadow-glow-sm)]" />
        </span>
        <span className="mt-1 block text-[9px] font-medium tracking-[0.3em] text-faint transition-colors group-hover:text-muted md:text-[10px]">
          TALK. EXPLORE. KNOW ME.
        </span>
      </button>

      {/* Primary links — hidden on small screens where the dock takes over */}
      <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
        {LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            className={cn(
              'relative text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300',
              active === link.id ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {link.label}
            {active === link.id && (
              <motion.span
                layoutId="nav-underline"
                className="absolute -bottom-2 left-0 h-px w-full bg-accent shadow-[var(--shadow-glow-sm)]"
              />
            )}
          </button>
        ))}
        {/* A real link rather than a window: the articles are their own pages,
            and an <a href> in the home page HTML is how crawlers find them. */}
        <Link
          href="/articles"
          className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase transition-colors duration-300 hover:text-ink"
        >
          Articles
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {/* Below lg the link row is hidden, so the articles get their own link.
            Not on phones: at 360px it pushes the wordmark onto two lines, and
            the desktop's Writing app covers it there. */}
        <Link
          href="/articles"
          className="hidden text-[11px] font-semibold tracking-[0.16em] text-muted uppercase transition-colors hover:text-ink sm:inline lg:hidden"
        >
          Articles
        </Link>
        <button
          onClick={onTalk}
          className={cn(
            'group flex items-center gap-2.5 rounded-full border border-hairline-strong bg-white/5 px-5 py-3 backdrop-blur-xl',
            'text-[11px] font-semibold tracking-[0.16em] uppercase text-ink',
            'transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 hover:shadow-[var(--shadow-glow-sm)]',
            'md:px-7 md:py-3.5',
          )}
        >
          <MessageSquare className="h-4 w-4 text-accent" strokeWidth={2} />
          <span className="hidden sm:inline">Talk To Archit</span>
          <span className="sm:hidden">Talk</span>
        </button>
      </div>
    </motion.header>
  );
}
