import { cn } from '@/lib/utils';

/** Small uppercase eyebrow used above headings throughout the OS windows. */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-[10px] font-semibold uppercase tracking-[0.28em] text-accent/70',
        className,
      )}
    >
      {children}
    </p>
  );
}
