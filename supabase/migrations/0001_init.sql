-- ===========================================================================
-- ARCHIT.AI — initial schema
-- Run with: supabase db push   (or paste into the Supabase SQL editor)
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- conversations: one row per visitor chat session
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id              uuid primary key default gen_random_uuid(),
  visitor_id      text,
  user_agent      text,
  referrer        text,
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create index if not exists conversations_created_at_idx
  on public.conversations (created_at desc);
create index if not exists conversations_visitor_idx
  on public.conversations (visitor_id);

-- ---------------------------------------------------------------------------
-- messages: append-only transcript
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id              bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  model           text,
  latency_ms      integer,
  tokens          integer,
  created_at      timestamptz not null default now()
);

create index if not exists messages_conversation_idx
  on public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- events: lightweight product analytics (windows opened, projects viewed)
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id         bigint generated always as identity primary key,
  name       text not null,
  payload    jsonb not null default '{}'::jsonb,
  visitor_id text,
  created_at timestamptz not null default now()
);

create index if not exists events_name_created_idx
  on public.events (name, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Posture: the anon key can do NOTHING. All writes go through the server route
-- using the service-role key, which bypasses RLS. Enabling RLS with no
-- permissive policy is what makes the public anon key safe to ship.
-- ---------------------------------------------------------------------------
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;
alter table public.events        enable row level security;

-- Deny-all by default: no policies are created for the `anon` or
-- `authenticated` roles. Add one deliberately if you later build a dashboard.

-- ---------------------------------------------------------------------------
-- Convenience view for reviewing conversations
-- ---------------------------------------------------------------------------
create or replace view public.conversation_summary as
select
  c.id,
  c.visitor_id,
  c.created_at,
  c.last_message_at,
  count(m.id)                                   as message_count,
  count(m.id) filter (where m.role = 'user')    as user_messages,
  round(avg(m.latency_ms) filter (where m.latency_ms is not null)) as avg_latency_ms
from public.conversations c
left join public.messages m on m.conversation_id = c.id
group by c.id;
