import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import type { ArticleFigure } from '@/types';
import { cn } from '@/lib/utils';

/**
 * The Push and Absorb diagrams, redrawn from the original paper.
 *
 * Built from HTML rather than an image: the labels are real text (readable
 * by search engines and screen readers), they follow the site theme, and on a
 * phone they stack vertically instead of shrinking to an unreadable strip.
 */

function Box({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-xl border px-4 py-3 text-center font-display text-[15px] leading-snug font-semibold',
        strong ? 'border-accent/40 bg-accent-soft text-ink' : 'border-hairline-strong bg-surface-raised text-ink',
      )}
    >
      {children}
    </div>
  );
}

function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-md bg-white/[0.06] px-2 py-0.5 text-[12px] font-semibold tracking-wide text-accent',
        className,
      )}
    >
      {children}
    </span>
  );
}

function Lever() {
  const branches = [
    { label: 'Yes', to: 'Run PUSH' },
    { label: 'No', to: 'Run ABSORB' },
    { label: 'Partly', to: 'Split it, then run both' },
  ];
  return (
    <div>
      <div className="mx-auto max-w-xs">
        <Box strong>Do I hold the lever?</Box>
      </div>
      {/* Phones: one row per answer, so three options do not read as a sequence. */}
      <div className="mt-4 grid gap-3 sm:mt-2 sm:grid-cols-3 sm:gap-4">
        {branches.map((b) => (
          <div key={b.label} className="flex items-center gap-2.5 sm:flex-col sm:gap-1.5">
            <span className="hidden h-4 w-px bg-hairline-strong sm:block" />
            <Chip className="w-16 shrink-0 text-center sm:w-auto">{b.label}</Chip>
            <ArrowRight className="h-4 w-4 shrink-0 text-faint sm:hidden" aria-hidden />
            <ArrowDown className="hidden h-4 w-4 text-faint sm:block" aria-hidden />
            <div className="flex-1 sm:w-full">
              <Box>{b.to}</Box>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bridges() {
  const arrows = [
    { label: '1. Trace back to a lever', dir: 'right' as const },
    { label: '2. Turn it around', dir: 'right' as const },
    { label: '3. Rehearse from the other side', dir: 'left' as const },
  ];
  return (
    <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
      <Box>
        ABSORB
        <span className="block text-[13px] font-normal text-muted">change happens to you</span>
      </Box>
      <ul className="flex flex-col gap-2.5">
        {arrows.map((a) => (
          <li key={a.label} className="flex items-center justify-center gap-2 text-[13px] text-muted">
            {a.dir === 'left' && (
              <ArrowLeft className="h-4 w-4 shrink-0 rotate-90 text-accent md:rotate-0" aria-hidden />
            )}
            <Chip>{a.label}</Chip>
            {a.dir === 'right' && (
              <ArrowRight className="h-4 w-4 shrink-0 rotate-90 text-accent md:rotate-0" aria-hidden />
            )}
          </li>
        ))}
      </ul>
      <Box strong>
        PUSH
        <span className="block text-[13px] font-normal text-muted">change you start</span>
      </Box>
    </div>
  );
}

function Chain() {
  const steps = ['Outside change', 'A', 'B', 'and on it goes'];
  const links = ['A runs ABSORB', 'A runs PUSH', 'B runs ABSORB'];
  return (
    <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
      {steps.map((step, i) => (
        <div key={step} className="contents">
          <div className={step.length > 1 ? 'md:w-28 md:shrink-0' : 'md:w-12 md:shrink-0'}>
            <Box strong={step === 'A' || step === 'B'}>{step}</Box>
          </div>
          {links[i] && (
            <div className="flex items-center justify-center gap-1.5 md:min-w-0 md:flex-1 md:flex-col">
              <Chip className="text-center">{links[i]}</Chip>
              <ArrowRight className="h-4 w-4 rotate-90 text-accent md:rotate-0" aria-hidden />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const FIGURES: Record<ArticleFigure, () => React.JSX.Element> = { lever: Lever, bridges: Bridges, chain: Chain };

export function Figure({ figure, caption }: { figure: ArticleFigure; caption: string }) {
  const Body = FIGURES[figure];
  return (
    <figure className="my-10 rounded-2xl border border-hairline bg-surface/60 p-5 md:p-7">
      <Body />
      <figcaption className="mt-5 text-center text-[13px] text-faint">{caption}</figcaption>
    </figure>
  );
}
