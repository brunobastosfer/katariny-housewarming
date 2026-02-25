-- Drop existing tables if they exist
drop table if exists public.gifts cascade;
drop table if exists public.rsvps cascade;

-- Create gifts table
create table public.gifts (
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
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  status text not null check (status in ('confirmed', 'declined')),
  companion_name text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.gifts enable row level security;
alter table public.rsvps enable row level security;

-- Drop existing policies if they exist
drop policy if exists "gifts_select_all" on public.gifts;
drop policy if exists "gifts_update_all" on public.gifts;
drop policy if exists "rsvps_select_all" on public.rsvps;
drop policy if exists "rsvps_insert_all" on public.rsvps;

-- Policies for gifts (allow read for everyone, update only for purchased items)
create policy "gifts_select_all" on public.gifts for select using (true);
create policy "gifts_update_all" on public.gifts for update using (true);

-- Policies for RSVPs (allow read and insert for everyone)
create policy "rsvps_select_all" on public.rsvps for select using (true);
create policy "rsvps_insert_all" on public.rsvps for insert with check (true);

-- Insert sample gifts
insert into public.gifts (name, price, image_url) values
('Jogo de panelas 5 peças', 250.00, 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=400&h=400&fit=crop'),
('Conjunto de facas profissional', 180.00, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop'),
('Liquidificador potente', 200.00, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop'),
('Jogo de panelas ceramica 8 peças branca', 399.90, '/images/panelas-branca.png'),
('Jogo de panelas ceramica 10 peças', 399.90, '/images/panelas-10pecas.png'),
('Jogo de panelas ceramica 9 peças', 399.90, '/images/panelas-9pecas.png');
