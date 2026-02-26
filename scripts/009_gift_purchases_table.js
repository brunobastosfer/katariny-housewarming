import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://187.77.58.54:8000'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function run() {
  console.log('Creating gift_purchases table via RPC...')

  // Create the table using raw SQL via RPC
  const sql = `
    CREATE TABLE IF NOT EXISTS public.gift_purchases (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
      purchaser_name TEXT NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'pix',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    ALTER TABLE public.gift_purchases ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow public read on gift_purchases" ON public.gift_purchases;
    DROP POLICY IF EXISTS "Allow public insert on gift_purchases" ON public.gift_purchases;

    CREATE POLICY "Allow public read on gift_purchases" ON public.gift_purchases FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on gift_purchases" ON public.gift_purchases FOR INSERT WITH CHECK (true);
  `

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

  if (error) {
    console.log('RPC failed, trying direct REST approach...')
    // Try inserting a test record to see if the table exists
    const { error: insertError } = await supabase
      .from('gift_purchases')
      .select('id')
      .limit(1)

    if (insertError?.code === '42P01') {
      console.error('Table does not exist and could not be created via anon key.')
      console.log('Please run this SQL manually on your VPS Supabase:')
      console.log(`
CREATE TABLE IF NOT EXISTS public.gift_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
  purchaser_name TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'pix',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.gift_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on gift_purchases" ON public.gift_purchases FOR SELECT USING (true);
CREATE POLICY "Allow public insert on gift_purchases" ON public.gift_purchases FOR INSERT WITH CHECK (true);
      `)
    } else {
      console.log('Table gift_purchases already exists or was created successfully!')
    }
  } else {
    console.log('Table created successfully!')
  }

  // Verify table exists
  const { data, error: checkError } = await supabase
    .from('gift_purchases')
    .select('id')
    .limit(1)

  if (checkError) {
    console.error('Table check failed:', checkError.message)
  } else {
    console.log('gift_purchases table is accessible!')
  }
}

run()
