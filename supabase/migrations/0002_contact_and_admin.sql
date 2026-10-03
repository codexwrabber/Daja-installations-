-- Daja Installation Services — contact / service-request messages
-- Run after 0001_init.sql, via: supabase db push (or the Supabase SQL editor)

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone (including anonymous visitors on the public Contact page) can submit
-- a service request...
create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);

-- ...but nobody can read them back through the public anon/auth key. The
-- admin panel reads this table using the service-role key on the server
-- (see lib/supabase/admin.ts), which bypasses RLS entirely, so no select
-- policy is defined here on purpose.
