create extension if not exists "uuid-ossp";

create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Resume',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, title)
);

create table if not exists public.job_scans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  job_description text not null,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.resumes enable row level security;
alter table public.job_scans enable row level security;

create policy "Users manage their resumes" on public.resumes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their job scans" on public.job_scans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
