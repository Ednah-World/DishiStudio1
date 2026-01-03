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

-- DROP existing policies to clean up
drop policy if exists "Users can insert their own profile" on public.users;
drop policy if exists "Users can view everyone" on public.users;
drop policy if exists "Users can update their own profile" on public.users;

-- CREATE proper policies

-- 1. VIEW: Allow everyone to read profiles (needed for friend search)
create policy "Users can view everyone"
  on public.users for select
  using (true);

-- 2. UPDATE: Allow users to update ONLY their own rows
create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- 3. INSERT: (Optional/Legacy) Allow insert if ID matches, but Trigger handles this main case
create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- --- TRIGGER FOR NEW USERS ---
-- This bypasses RLS issues by running as security definer on the server side

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username, full_name, streak)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'full_name',
    0
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
