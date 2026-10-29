-- ===========================================================================
-- leads: enquiries from /work-with-me (hiring, consulting, other)
-- Written only by the server route with the service-role key; RLS on and no
-- policies, so the public anon key can neither read nor write them.
-- Read them in the Supabase dashboard: Table Editor → leads.
-- ===========================================================================
create table if not exists public.leads (
  id           bigint generated always as identity primary key,
  name         text not null,
  email        text not null,
  organisation text,
  intent       text not null check (intent in ('hiring', 'consulting', 'other')),
  message      text not null,
  source       text,
  referrer     text,
  user_agent   text,
  emailed      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

alter table public.leads enable row level security;
