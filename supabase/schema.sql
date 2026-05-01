-- The Ordinary Catholic Supabase schema
-- V1 focus: cited Ask loop, saved answers, prayer content, and prayer intentions.

create extension if not exists "uuid-ossp";
create extension if not exists vector;

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  parish_name text,
  role text not null default 'user' check (role in ('user', 'moderator', 'advisor', 'clergy_verified', 'admin')),
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  source_url text,
  publisher text,
  authority_tier integer not null check (authority_tier between 1 and 4),
  source_type text not null,
  status text not null default 'draft' check (status in ('draft', 'reviewed', 'active', 'archived')),
  imported_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.source_chunks (
  id uuid primary key default uuid_generate_v4(),
  source_id uuid not null references public.sources(id) on delete cascade,
  chunk_text text not null,
  citation_label text not null,
  section_label text,
  paragraph_number text,
  authority_tier integer not null check (authority_tier between 1 and 4),
  embedding vector(1536),
  token_count integer,
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  category text not null,
  summary text not null,
  status text not null default 'draft' check (status in ('draft', 'reviewed', 'active', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.topic_sources (
  topic_id uuid not null references public.topics(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  primary key (topic_id, source_id)
);

create table if not exists public.saved_answers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_text text not null,
  answer_text text not null,
  citations jsonb not null default '[]'::jsonb,
  topic_id uuid references public.topics(id),
  created_at timestamptz not null default now()
);

create table if not exists public.prayers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  text_english text,
  text_latin text,
  source_note text,
  audio_url text,
  status text not null default 'active' check (status in ('draft', 'reviewed', 'active', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.novenas (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null default 'Novena',
  days jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('draft', 'reviewed', 'active', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.prayer_intentions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  body text not null,
  visibility text not null default 'public' check (visibility in ('public', 'group', 'private')),
  group_name text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'hidden')),
  created_at timestamptz not null default now()
);

create table if not exists public.intention_prayers (
  id uuid primary key default uuid_generate_v4(),
  intention_id uuid not null references public.prayer_intentions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (intention_id, user_id)
);

create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text not null check (target_type in ('intention', 'profile', 'comment')),
  target_id uuid not null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.saved_answers enable row level security;
alter table public.prayer_intentions enable row level security;
alter table public.intention_prayers enable row level security;
alter table public.reports enable row level security;

alter table public.sources enable row level security;
alter table public.source_chunks enable row level security;
alter table public.topics enable row level security;
alter table public.topic_sources enable row level security;
alter table public.prayers enable row level security;
alter table public.novenas enable row level security;

create policy "Public active sources are readable"
  on public.sources for select
  using (status = 'active');

create policy "Public active source chunks are readable"
  on public.source_chunks for select
  using (
    exists (
      select 1 from public.sources
      where sources.id = source_chunks.source_id
      and sources.status = 'active'
    )
  );

create policy "Public active topics are readable"
  on public.topics for select
  using (status = 'active');

create policy "Public topic sources are readable"
  on public.topic_sources for select
  using (true);

create policy "Public active prayers are readable"
  on public.prayers for select
  using (status = 'active');

create policy "Public active novenas are readable"
  on public.novenas for select
  using (status = 'active');

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can read own saved answers"
  on public.saved_answers for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved answers"
  on public.saved_answers for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saved answers"
  on public.saved_answers for delete
  using (auth.uid() = user_id);

create policy "Approved public intentions are readable"
  on public.prayer_intentions for select
  using (status = 'approved' and visibility = 'public');

create policy "Users can insert own intentions"
  on public.prayer_intentions for insert
  with check (auth.uid() = user_id);

create policy "Users can read own intentions"
  on public.prayer_intentions for select
  using (auth.uid() = user_id);

create policy "Users can mark prayed"
  on public.intention_prayers for insert
  with check (auth.uid() = user_id);

create policy "Users can report content"
  on public.reports for insert
  with check (auth.uid() = reporter_id);
