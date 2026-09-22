import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { profile } from '@/content/profile';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.product} — ${profile.tagline}`,
    template: `%s — ${profile.product}`,
  },
  description: profile.description,
  applicationName: profile.product,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    profile.name,
    'founder portfolio',
    'growth operator',
    'strategy',
    "Masters' Union",
    'ZenCabs',
    'PwC India',
    'Cairros Consulting',
  ],
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: `${profile.name} — ${profile.product}`,
    description: profile.altTagline,
    siteName: profile.product,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.product}`,
    description: profile.altTagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050816',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // The desktop metaphor breaks under pinch-zoom, but capping it would fail
  // WCAG 1.4.4 — so zoom stays enabled.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`} suppressHydrationWarning>
      <body className="bg-void text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-1000 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-void focus:font-semibold"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
