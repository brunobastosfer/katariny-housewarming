-- Disable RLS temporarily to allow inserts
ALTER TABLE public.gifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access on gifts" ON public.gifts;
DROP POLICY IF EXISTS "Allow public insert on gifts" ON public.gifts;
DROP POLICY IF EXISTS "Allow public update on gifts" ON public.gifts;
DROP POLICY IF EXISTS "Allow public read access on rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public insert on rsvps" ON public.rsvps;

-- Create new permissive policies
CREATE POLICY "gifts_insert_policy" ON public.gifts FOR INSERT WITH CHECK (true);
CREATE POLICY "gifts_select_policy" ON public.gifts FOR SELECT USING (true);
CREATE POLICY "gifts_update_policy" ON public.gifts FOR UPDATE USING (true);
CREATE POLICY "rsvps_insert_policy" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "rsvps_select_policy" ON public.rsvps FOR SELECT USING (true);
