import type { Viewport } from 'next';
import Link from 'next/link';
import { Source_Serif_4 } from 'next/font/google';
import { SiteHeader } from '@/components/articles/site-header';
import { profile } from '@/content/profile';
import './articles.css';

/** A reading serif for article text, loaded only on these pages. */
const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
});

/** The reading pages are light, so the browser chrome should be too. */
export const viewport: Viewport = {
  themeColor: '#f7f4ee',
  colorScheme: 'light',
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`theme-paper ${serif.variable} relative min-h-dvh overflow-x-clip`}>
      <SiteHeader />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <footer className="relative z-10 mt-24 border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <Link href="/articles" className="hover:text-ink">
              Articles
            </Link>
            <a href="/articles/rss.xml" className="hover:text-ink">
              RSS
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
