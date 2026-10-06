'use client';

import { useState } from 'react';
import { Check, Link2, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Share links, plus copy-to-clipboard. Every target is a plain link except the copy button. */
export function ShareBar({
  url,
  title,
  vertical = false,
  className,
}: {
  url: string;
  title: string;
  vertical?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const targets = [
    { label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, Icon: Linkedin },
    { label: 'Share on X', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`, Icon: Twitter },
    { label: 'Share on WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, Icon: MessageCircle },
  ];
  const button =
    'flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong bg-surface text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent';

  return (
    <div className={cn('flex items-center gap-2', vertical && 'flex-col', className)}>
      <span className={cn('text-[10.5px] font-bold tracking-[0.2em] text-faint uppercase', vertical ? 'mb-1' : 'mr-1')}>
        Share
      </span>
      {targets.map(({ label, href, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={button}>
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        aria-label={copied ? 'Link copied' : 'Copy link'}
        className={button}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          } catch {
            /* clipboard blocked: the address bar still has it */
          }
        }}
      >
        {copied ? <Check className="h-4 w-4 text-accent" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
