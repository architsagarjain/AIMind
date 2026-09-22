'use client';

import { useEffect, useState } from 'react';
import { Cpu, Home, Wifi } from 'lucide-react';
import { profile } from '@/content/profile';

/** Top system bar. Live clock, connection glyphs, and an exit back to the hero. */
export function MenuBar({ onExit }: { onExit: () => void }) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date()),
      );
    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass absolute inset-x-0 top-0 z-900 flex h-[34px] items-center justify-between border-b border-hairline px-3 text-[11px] md:px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onExit}
          className="flex items-center gap-2 font-display text-[11px] font-extrabold tracking-[0.18em] text-ink transition-colors hover:text-accent"
          aria-label="Return to the intro"
        >
          <Home className="h-3.5 w-3.5" />
          ARCHIT.OS
        </button>
        <span className="hidden text-muted sm:inline">File</span>
        <span className="hidden text-muted sm:inline">View</span>
        <span className="hidden text-muted md:inline">Window</span>
      </div>

      <div className="flex items-center gap-3 text-muted">
        <span className="hidden items-center gap-1.5 sm:flex">
          <Cpu className="h-3.5 w-3.5 text-accent" />
          <span className="text-[10px] tracking-wide">{profile.name}</span>
        </span>
        <Wifi className="h-3.5 w-3.5" />
        <span className="tabular-nums text-ink">{time || '—'}</span>
      </div>
    </div>
  );
}
