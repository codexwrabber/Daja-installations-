-- Daja Installation Services — initial schema
-- Run via: supabase db push  (or paste into the Supabase SQL editor)

create extension if not exists "pgcrypto";

-- 1. Profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Worker profiles ---------------------------------------------------------
create table if not exists public.worker_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  skills text[],
  experience text,
  location text,
  date_of_birth date,
  gender text,
  registration_status text not null default 'pending'
    check (registration_status in ('pending', 'submitted', 'approved', 'rejected')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'pending_review', 'paid')),
  submitted_at timestamptz
);

alter table public.worker_profiles enable row level security;

create policy "Users can view their own worker profile"
  on public.worker_profiles for select
  using (auth.uid() = id);

create policy "Users can upsert their own worker profile"
  on public.worker_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own worker profile"
  on public.worker_profiles for update
  using (auth.uid() = id);

-- 3. Groups -------------------------------------------------------------------
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  avatar_url text,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.groups enable row level security;

create policy "Groups are viewable by authenticated users"
  on public.groups for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can create groups"
  on public.groups for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their groups"
  on public.groups for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their groups"
  on public.groups for delete
  using (auth.uid() = owner_id);

-- 4. Group members --------------------------------------------------------------
create table if not exists public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

alter table public.group_members enable row level security;

create policy "Members are viewable by authenticated users"
  on public.group_members for select
  using (auth.role() = 'authenticated');

create policy "Users can join groups themselves"
  on public.group_members for insert
  with check (auth.uid() = user_id);

create policy "Users can leave groups themselves"
  on public.group_members for delete
  using (auth.uid() = user_id);

-- 5. Messages ---------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(content) > 0),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Group members can read messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = messages.group_id and gm.user_id = auth.uid()
    )
  );

create policy "Group members can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.group_members gm
      where gm.group_id = messages.group_id and gm.user_id = auth.uid()
    )
  );

-- 6. Storage bucket for worker documents -------------------------------------------
insert into storage.buckets (id, name, public)
values ('worker-documents', 'worker-documents', false)
on conflict (id) do nothing;

create policy "Users can upload their own worker documents"
  on storage.objects for insert
  with check (
    bucket_id = 'worker-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can read their own worker documents"
  on storage.objects for select
  using (
    bucket_id = 'worker-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 7. Realtime -----------------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
