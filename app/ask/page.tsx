import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Chat } from '@/components/chat/chat';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  alternates: { canonical: '/ask' },
  title: 'Ask Archit',
  description: `${profile.altTagline} Talk to a digital version of ${profile.name}.`,
};

/**
 * Standalone chat route.
 *
 * Exists so the chat is linkable, crawlable and reachable without the 3D
 * intro — shareable as a direct URL, and the accessible path for anyone who
 * cannot use the desktop metaphor.
 */
export default function AskPage() {
  return (
    <main className="relative flex h-dvh flex-col bg-void">
      <div className="bloom top-[-10rem] left-1/2 h-[32rem] w-[32rem] -translate-x-1/2" />

      <header className="relative z-10 flex items-center justify-between border-b border-hairline px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          ARCHIT.AI
        </Link>
        <p className="text-[10px] font-semibold tracking-[0.24em] text-faint uppercase">
          {profile.tagline}
        </p>
      </header>

      <div className="relative z-10 min-h-0 flex-1">
        <Chat />
      </div>
    </main>
  );
}
