import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';
import { articlesByDate, plain } from '@/content/articles';
import { CopyButton } from '@/components/articles/copy-button';
import { articleUrl, linkedInPost } from '@/lib/syndicate';
import { profileFields, setupPrompt, updatePrompt } from '@/lib/profile-kit';

/**
 * A private tool page for cross-posting the articles. Each republished copy
 * names the original as canonical and links back to it, which is how the
 * writing earns backlinks and readers on other platforms. Not linked from the
 * site and kept out of search.
 */
export const metadata: Metadata = {
  title: 'Profile and cross-posting kit',
  robots: { index: false, follow: false },
};

const STEPS = [
  ['Medium', 'Open medium.com/p/import, paste the article link and import. Medium copies the piece and marks the original as canonical by itself.'],
  ['Dev.to and Hashnode', 'New post, then paste "Copy Markdown". The front matter carries the title, tags and canonical_url (on Hashnode, also set "Original URL" in the post settings).'],
  ['LinkedIn', 'Paste "Copy LinkedIn post" as a regular post. Posts with one link and a real point travel further than shares of a bare URL.'],
] as const;

export default function SyndicatePage() {
  const list = articlesByDate();
  return (
    <div className="min-h-dvh bg-[var(--color-void)] px-4 py-10 text-ink sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Profile kit</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          What to paste into profiles on other sites, generated from <code className="text-ink">content/positioning.ts</code>.
          When your positioning changes, edit that file, deploy, then copy the update prompt below into Claude in Chrome.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <CopyButton label="Copy setup prompt (first time)" text={setupPrompt()} />
          <CopyButton label="Copy update prompt (after a change)" text={updatePrompt()} />
        </div>
        <dl className="mt-6 divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
          {profileFields().map((f) => (
            <div key={f.label} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <dt className="text-[11px] font-bold tracking-[0.14em] text-accent uppercase">{f.label}</dt>
                <dd className="mt-1 text-[14px] leading-relaxed break-words text-ink/90">{f.value}</dd>
              </div>
              <div className="shrink-0">
                <CopyButton label="Copy" text={f.value} />
              </div>
            </div>
          ))}
        </dl>

        <h2 className="mt-14 font-display text-3xl font-extrabold tracking-tight">Cross-posting kit</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Every copy below points back to the original on this site, so each platform you post on adds a backlink and none
          of them competes with the original in search.
        </p>
        <ol className="mt-6 space-y-3 rounded-2xl border border-hairline bg-surface p-5 text-[14px] leading-relaxed">
          {STEPS.map(([where, how]) => (
            <li key={where}>
              <span className="font-semibold">{where}:</span> <span className="text-muted">{how}</span>
            </li>
          ))}
        </ol>

        <ul className="mt-8 space-y-4">
          {list.map((a) => {
            const url = articleUrl(a);
            return (
              <li key={a.slug} className="rounded-2xl border border-hairline bg-surface p-5">
                <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">{a.category}</p>
                <h2 className="mt-1 text-[17px] leading-snug font-bold">{plain(a.title)}</h2>
                <a href={url} className="mt-1 block truncate text-[12.5px] text-faint hover:text-accent">
                  {url}
                </a>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton label="Copy link" text={url} />
                  <CopyButton label="Copy Markdown" href={`/articles/${a.slug}/markdown`} />
                  <CopyButton label="Copy LinkedIn post" text={linkedInPost(a)} />
                  <a
                    href="https://medium.com/p/import"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline-strong px-3 py-1.5 text-[12px] font-semibold transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    Import to Medium <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
