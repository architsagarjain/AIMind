// Applies supabase/migrations/*.sql to the project's database before each build.
//
// Vercel's Supabase integration provides a Postgres connection string (under
// whatever prefix the integration was given, e.g. STORAGE_POSTGRES_URL). When
// one is present, every migration not yet recorded in public._migrations runs
// in its own transaction, then PostgREST is told to reload its schema so the
// API sees new tables at once. The connection is verified against Supabase's
// root CA (supabase/prod-ca-2021.crt).
//
// This must never fail a deploy: with no database URL it says so and stops,
// and any error is logged and the build carries on.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const log = (...a) => console.log('[migrate]', ...a);

function databaseUrl() {
  const names = Object.keys(process.env);
  const find = (re) => names.find((n) => re.test(n) && process.env[n]?.trim());
  // Session-mode (non-pooling) first: DDL and transactions behave as written.
  const name =
    find(/(^|_)POSTGRES_URL_NON_POOLING$/) ?? find(/(^|_)POSTGRES_URL$/) ?? find(/^(SUPABASE_DB_URL|DATABASE_URL)$/);
  return name ? { name, url: process.env[name].trim() } : null;
}

async function main() {
  const db = databaseUrl();
  if (!db) {
    log('no Postgres URL in the environment; skipping.');
    return;
  }
  const { default: pg } = await import('pg');

  // sslmode in the URL would override the ssl options below, so it is removed
  // and verification is configured explicitly.
  const url = new URL(db.url);
  for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'supa', 'pgbouncer']) url.searchParams.delete(key);
  // MIGRATE_CA_FILE exists only so the script can be tested against a local
  // database with its own certificate; production always uses Supabase's CA.
  const caFile = process.env.MIGRATE_CA_FILE?.trim() || path.join(root, 'supabase/prod-ca-2021.crt');
  const ca = fs.readFileSync(caFile, 'utf8');

  const client = new pg.Client({
    connectionString: url.toString(),
    ssl: { ca, rejectUnauthorized: true },
    connectionTimeoutMillis: 10_000,
    statement_timeout: 20_000,
  });

  await client.connect();
  log(`connected via ${db.name} to ${url.hostname}`);
  try {
    await client.query(
      'create table if not exists public._migrations (name text primary key, applied_at timestamptz not null default now())',
    );
    await client.query('alter table public._migrations enable row level security');
    const done = new Set((await client.query('select name from public._migrations')).rows.map((r) => r.name));

    const dir = path.join(root, 'supabase/migrations');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
    let applied = 0;
    for (const file of files) {
      if (done.has(file)) continue;
      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await client.query('begin');
      try {
        await client.query(sql);
        await client.query('insert into public._migrations (name) values ($1)', [file]);
        await client.query('commit');
        applied++;
        log(`applied ${file}`);
      } catch (err) {
        await client.query('rollback');
        throw new Error(`${file}: ${err.message}`);
      }
    }
    // Let the REST API see new tables now rather than on its next refresh.
    await client.query("notify pgrst, 'reload schema'");
    log(applied ? `${applied} migration(s) applied.` : 'already up to date.');
  } finally {
    await client.end();
  }
}

const timer = setTimeout(() => {
  log('timed out; carrying on with the build.');
  process.exit(0);
}, 45_000);

main()
  .catch((err) => log('failed, build continues:', err.message))
  .finally(() => {
    clearTimeout(timer);
  });
