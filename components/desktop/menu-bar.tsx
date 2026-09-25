'use client';

import { useEffect, useState } from 'react';
import { BatteryFull, Search, Wifi } from 'lucide-react';
import { profile } from '@/content/profile';

/**
 * The macOS menu bar.
 *
 * Proportions are copied from the real thing rather than invented: 26px tall,
 * the app name in semibold with the menus in regular weight beside it, status
 * glyphs and a clock pinned right. Those details are most of what makes a
 * simulated desktop read as a Mac.
 *
 * The leading mark is the ARCHIT dot, not an Apple logo — this is an homage,
 * not an impersonation, and the logo is a trademark.
 */

const MENUS = ['File', 'Edit', 'View', 'Window', 'Help'];

export function MenuBar({ onExit }: { onExit: () => void }) {
  const [time, setTime] = useState('');

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
    <div className="glass absolute inset-x-0 top-0 z-900 flex h-[26px] items-center justify-between border-b border-hairline px-3 text-[13px] text-ink select-none">
      <div className="flex items-center gap-4">
        <button
          onClick={onExit}
          aria-label="Return to the intro"
          className="flex h-4 w-4 items-center justify-center rounded-full transition-transform hover:scale-110"
          title="Back to the intro"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-accent-2 to-accent" />
        </button>

        <span className="font-semibold tracking-tight">ARCHIT.OS</span>

        {MENUS.map((menu) => (
          <span key={menu} className="hidden text-muted sm:inline">
            {menu}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3.5 text-muted">
        <span className="hidden text-[12px] sm:inline">{profile.name}</span>
        <BatteryFull className="hidden h-4 w-4 sm:block" strokeWidth={1.6} />
        <Wifi className="h-3.5 w-3.5" strokeWidth={2} />
        <Search className="hidden h-3.5 w-3.5 sm:block" strokeWidth={2} />
        <span className="tabular-nums text-ink">{time || '\u00a0'}</span>
      </div>
    </div>
  );
}
