import { cn } from '@/lib/utils';

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-hairline-strong bg-white/5 px-3 py-1',
        'text-[11px] font-medium tracking-wide text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
