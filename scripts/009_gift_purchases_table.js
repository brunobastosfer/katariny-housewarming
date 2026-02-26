import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://187.77.58.54:8000'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzE5ODg0MDAsImV4cCI6MTkyOTc1NDgwMH0.VFVNzFkTLnzAjcGAZIYjl1cGdS0mPbvQiXM6yOxPsqA'

async function run() {
  // Try with service role first, fallback to anon
  const keys = [SERVICE_KEY, ANON_KEY]

  for (const key of keys) {
    const role = key === SERVICE_KEY ? 'service_role' : 'anon'
    console.log(`\nTrying with ${role} key...`)
    const supabase = createClient(SUPABASE_URL, key)

    // Check if table already exists
    const { data: existing, error: checkErr } = await supabase
      .from('gift_purchases')
      .select('id')
      .limit(1)

    if (!checkErr) {
      console.log('Table gift_purchases already exists and is accessible!')
      return
    }

    if (checkErr.code !== '42P01') {
      console.log('Unexpected error:', checkErr.message)
      continue
    }

    console.log('Table does not exist, attempting to create via RPC...')

    // Try exec_sql RPC
    const { error: rpcErr } = await supabase.rpc('exec_sql', {
      query: `
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
    })

    if (!rpcErr) {
      console.log('Table created via exec_sql RPC!')
      return
    }

    console.log('exec_sql RPC failed:', rpcErr.message)

    // Try query RPC
    const { error: rpcErr2 } = await supabase.rpc('query', {
      query: `CREATE TABLE IF NOT EXISTS public.gift_purchases (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE, purchaser_name TEXT NOT NULL, payment_method TEXT NOT NULL DEFAULT 'pix', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());`
    })

    if (!rpcErr2) {
      console.log('Table created via query RPC!')
      return
    }

    console.log('query RPC failed:', rpcErr2.message)
  }

  console.log('\n--- MANUAL STEPS REQUIRED ---')
  console.log('Acesse o painel do Supabase na VPS e execute este SQL:')
  console.log(`
CREATE TABLE IF NOT EXISTS public.gift_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
  purchaser_name TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'pix',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.gift_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on gift_purchases"
  ON public.gift_purchases FOR SELECT USING (true);

CREATE POLICY "Allow public insert on gift_purchases"
  ON public.gift_purchases FOR INSERT WITH CHECK (true);
  `)
}

run()
