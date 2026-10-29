'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Copies text, or the body of a URL fetched on click (so big texts stay out of the page). */
export function CopyButton({ label, text, href }: { label: string; text?: string; href?: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          const value = text ?? (await (await fetch(href!)).text());
          await navigator.clipboard.writeText(value);
          setState('done');
        } catch {
          setState('failed');
        }
        setTimeout(() => setState('idle'), 1800);
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-hairline-strong px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-accent/40 hover:text-accent"
    >
      {state === 'done' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {state === 'done' ? 'Copied' : state === 'failed' ? 'Copy failed' : label}
    </button>
  );
}
