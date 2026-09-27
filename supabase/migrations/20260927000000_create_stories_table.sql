create table public.mm_stories (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    excerpt text,
    content text,
    city text,
    collection_number text,
    image_url text,
    additional_images jsonb default '[]'::jsonb,
    status text default 'draft',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.mm_stories enable row level security;

-- Create policies
create policy "Public stories are viewable by everyone." on public.mm_stories for select using (status = 'published');
create policy "Admins can view all stories." on public.mm_stories for select using (
  auth.uid() in (select id from public.users where role = 'admin')
);
create policy "Admins can insert stories." on public.mm_stories for insert with check (
  auth.uid() in (select id from public.users where role = 'admin')
);
create policy "Admins can update stories." on public.mm_stories for update using (
  auth.uid() in (select id from public.users where role = 'admin')
);
create policy "Admins can delete stories." on public.mm_stories for delete using (
  auth.uid() in (select id from public.users where role = 'admin')
);
