/**
 * Tells Bing, Yandex, Seznam, Naver and the other IndexNow engines about every
 * URL in the sitemap, so new and updated articles are crawled within hours
 * rather than whenever a crawler next drops by. (Google does not take
 * IndexNow; it reads the sitemap submitted in Search Console.)
 *
 * Runs after `next build`, on production builds only, reading the sitemap the
 * build just wrote. The key file it names lives at public/<key>.txt, which is
 * how the engines confirm the ping comes from the site's owner. It never
 * fails the build: a missed ping only means slower discovery.
 */
import { readFileSync } from 'node:fs';

const KEY = 'd9779348ff8d97088d155f400c967031';

async function main() {
  if (process.env.VERCEL_ENV !== 'production') {
    console.log('[indexnow] skipped: not a production build');
    return;
  }
  let xml;
  try {
    xml = readFileSync('.next/server/app/sitemap.xml.body', 'utf8');
  } catch {
    console.log('[indexnow] skipped: no sitemap in the build output');
    return;
  }
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (!urls.length) return console.log('[indexnow] skipped: sitemap is empty');
  const { host, origin } = new URL(urls[0]);
  if (host.startsWith('localhost')) return console.log('[indexnow] skipped: sitemap points at localhost');

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${origin}/${KEY}.txt`, urlList: urls.filter((u) => new URL(u).host === host) }),
    signal: AbortSignal.timeout(10_000),
  });
  console.log(`[indexnow] ${res.status} for ${urls.length} URLs`);
}

main().catch((e) => console.log('[indexnow] skipped:', e.message));
