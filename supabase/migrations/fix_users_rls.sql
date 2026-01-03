-- Ensure the users table exists and has necessary columns
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text,
  username text,
  full_name text,
  streak int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safely add columns if they are missing (idempotent)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'users' and column_name = 'streak') then
    alter table public.users add column streak int default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'users' and column_name = 'username') then
    alter table public.users add column username text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'users' and column_name = 'full_name') then
    alter table public.users add column full_name text;
  end if;
end $$;

-- Enable RLS
alter table public.users enable row level security;

-- DROP existing policies to clean up (in case they are broken)
drop policy if exists "Users can insert their own profile" on public.users;
drop policy if exists "Users can view everyone" on public.users;
drop policy if exists "Users can update their own profile" on public.users;

-- CREATE proper policies

-- 1. INSERT: Allow a user to insert a row ONLY if the id matches their auth.uid()
create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- 2. SELECT: Allow everyone (even anon/unauthenticated if you want public profiles) to read profiles
-- If you want strict privacy, change `true` to `auth.role() = 'authenticated'`
create policy "Users can view everyone"
  on public.users for select
  using (true);

-- 3. UPDATE: Allow users to update ONLY their own rows
create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);
