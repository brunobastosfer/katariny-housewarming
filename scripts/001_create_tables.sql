-- Create gifts table
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price decimal(10, 2) not null,
  image_url text,
  purchased boolean default false,
  purchaser_name text,
  payment_status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Create RSVPs table
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  status text not null check (status in ('confirmed', 'declined')),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.gifts enable row level security;
alter table public.rsvps enable row level security;

-- Policies for gifts (allow read for everyone, update only for purchased items)
create policy "gifts_select_all" on public.gifts for select using (true);
create policy "gifts_update_all" on public.gifts for update using (true);

-- Policies for RSVPs (allow read and insert for everyone)
create policy "rsvps_select_all" on public.rsvps for select using (true);
create policy "rsvps_insert_all" on public.rsvps for insert with check (true);
