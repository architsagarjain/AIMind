import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client using the service-role key.
 *
 * `server-only` guarantees a build error if this module is ever pulled into a
 * client bundle, which is the failure mode that would leak the key.
 *
 * WHICH ENV VARS
 * Set by hand, these are NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Vercel's Supabase integration names them its own way (SUPABASE_URL, the newer
 * SUPABASE_SECRET_KEY, sometimes behind a prefix of your choosing), and when
 * the names did not match, the site silently ran without a database: nothing
 * was saved, and the idle project kept pausing. So any of those spellings is
 * accepted, exact names first.
 */

const pick = (exact: string[], suffixes: RegExp) => {
  for (const name of exact) if (process.env[name]?.trim()) return name;
  return Object.keys(process.env).find((name) => suffixes.test(name) && process.env[name]?.trim()) ?? null;
};

/** The env var names in use, for diagnostics. Names only, never values. */
export function supabaseEnv() {
  return {
    url: pick(['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'], /(^|_)SUPABASE_URL$/),
    key: pick(
      ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY'],
      /(^|_)SUPABASE_(SERVICE_ROLE|SECRET)_KEY$/,
    ),
  };
}

let serviceClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const env = supabaseEnv();
  if (!env.url || !env.key) return null;

  if (!serviceClient) {
    serviceClient = createClient(process.env[env.url]!.trim(), process.env[env.key]!.trim(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return serviceClient;
}

export const isSupabaseConfigured = () => {
  const env = supabaseEnv();
  return Boolean(env.url && env.key);
};
