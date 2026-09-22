/**
 * Resolves the canonical site origin for metadata, Open Graph tags and the
 * sitemap.
 *
 * Every step here exists because of a real failure mode:
 *
 * - `process.env.X ?? fallback` does NOT catch an empty string, and a platform
 *   env var declared with no value arrives as ''. `new URL('')` throws
 *   ERR_INVALID_URL during `Collecting page data`, which fails the whole build
 *   on a route as innocuous as /_not-found. Empty and whitespace-only values
 *   must be treated as unset.
 * - People type `archit.ai` rather than `https://archit.ai`. `new URL()` needs
 *   a scheme, so one is added when it is missing.
 * - Vercel always exposes the deployment host, so a deploy with no site URL
 *   configured at all can still emit correct absolute URLs.
 * - Anything still unparseable falls back rather than throwing. A wrong OG
 *   URL is a cosmetic problem; a failed production build is not.
 */

const DEFAULT_ORIGIN = 'http://localhost:3000';

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalize(value: string): string | null {
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    // Re-serialising through URL strips paths, trailing slashes and typos.
    return new URL(withScheme).origin;
  } catch {
    return null;
  }
}

function resolveSiteUrl(): string {
  // Referenced literally so Next can inline it at build time.
  const explicit = clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) {
    const normalized = normalize(explicit);
    if (normalized) return normalized;
    console.warn(
      `[site] NEXT_PUBLIC_SITE_URL is not a valid URL (${explicit}); falling back.`,
    );
  }

  // Vercel sets these on every deployment; the production one is preferred so
  // preview builds still advertise the real canonical origin.
  const vercelHost =
    clean(process.env.VERCEL_PROJECT_PRODUCTION_URL) ?? clean(process.env.VERCEL_URL);
  if (vercelHost) {
    const normalized = normalize(vercelHost);
    if (normalized) return normalized;
  }

  return DEFAULT_ORIGIN;
}

/** Canonical origin, e.g. `https://archit.ai` — no trailing slash. */
export const SITE_URL = resolveSiteUrl();

/** Same value as a `URL`, for `metadataBase`. */
export const SITE_URL_OBJECT = new URL(SITE_URL);
