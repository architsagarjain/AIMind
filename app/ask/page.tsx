import type { Metadata } from 'next';
import Link from 'next/link';
import { MessagesSquare } from 'lucide-react';
import { Chat } from '@/components/chat/chat';
import { Wallpaper } from '@/components/desktop/wallpaper';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  alternates: { canonical: '/ask' },
  title: 'Ask Archit',
  description: `${profile.altTagline} Talk to a digital version of ${profile.name}, trained on his real work.`,
};

/**
 * Standalone chat route.
 *
 * Exists so the chat is linkable and reachable without the 3D intro: a
 * shareable URL, and the accessible path for anyone who cannot use the
 * desktop metaphor. It renders the same Ask Archit app as the desktop, in
 * the same window chrome and on the same wallpaper, so a visitor who
 * arrives here meets the product they would meet inside ARCHIT.OS. On a
 * phone the window fills the screen, as apps do there.
 */
export default function AskPage() {
  return (
    <main className="os-light relative flex h-dvh flex-col overflow-hidden bg-void font-sans">
      <Wallpaper />

      {/* Menu bar: the OS's, reduced to what this page can do. */}
      <header className="relative z-10 flex h-7 shrink-0 items-center justify-between bg-white/55 px-4 text-[13px] backdrop-blur-xl">
        <Link href="/" className="font-semibold text-ink">
          ARCHIT.OS
        </Link>
        <nav className="flex items-center gap-4 text-muted" aria-label="Primary">
          <Link href="/articles" className="hover:text-ink">
            Writing
          </Link>
          <Link href="/resume" className="hover:text-ink">
            Resume
          </Link>
          <Link href="/" className="hidden hover:text-ink sm:inline">
            Open the full experience
          </Link>
        </nav>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 justify-center sm:px-6 sm:py-8">
        <section
          aria-label="Ask Archit"
          className="flex min-h-0 w-full max-w-[760px] flex-col overflow-hidden bg-white sm:rounded-[14px] sm:shadow-[var(--shadow-window)]"
        >
          {/* Title bar, as on the desktop. The close light leaves the app. */}
          <div className="flex h-[38px] shrink-0 items-center gap-3 border-b border-hairline bg-gradient-to-b from-white/70 to-[#f3f3f5]/60 px-3.5">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                aria-label="Close Ask Archit and go to ARCHIT.OS"
                className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_#00000026]"
              />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_#00000026]" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_#00000026]" aria-hidden />
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-center gap-2 pr-[52px]">
              <MessagesSquare className="h-3.5 w-3.5 shrink-0 text-[#BF5AF2]" aria-hidden />
              <h1 className="truncate text-[13px] font-semibold text-ink">Ask Archit</h1>
              <p className="hidden truncate text-[12px] text-faint sm:block">· Talk to the clone</p>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <Chat />
          </div>
        </section>
      </div>
    </main>
  );
}
