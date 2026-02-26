import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://187.77.58.54:8000'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'
// Service role JWT - same secret, role=service_role
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzE5ODg0MDAsImV4cCI6MTkyOTc1NDgwMH0.mFLSi2pNfJlJezh2n0Fxs_0k0bwxHJTwT3yJXqXUGI0'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

async function run() {
  console.log('Testing anon key first — listing gifts...')
  const anonClient = createClient(SUPABASE_URL, ANON_KEY)
  const { data: gifts, error: giftsError } = await anonClient.from('gifts').select('id, name').limit(3)
  if (giftsError) {
    console.log('Anon gifts error:', giftsError.message)
  } else {
    console.log('Anon gifts OK:', gifts?.length, 'items:', gifts?.map(g => g.name).join(', '))
  }

  console.log('\nChecking if gift_purchases table exists...')
  const { data: existing, error: checkError } = await supabase
    .from('gift_purchases')
    .select('id')
    .limit(1)

  if (!checkError) {
    console.log('gift_purchases table already exists!')
    const { count } = await supabase.from('gift_purchases').select('*', { count: 'exact', head: true })
    console.log('Row count:', count)
    return
  }

  console.log('Table does not exist:', checkError.message)
  console.log('\nAttempting to create via RPC...')

  // Try using the Supabase pg_meta API to run raw SQL
  const response = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({
      query: `
        CREATE TABLE IF NOT EXISTS public.gift_purchases (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
          purchaser_name TEXT NOT NULL,
          payment_method TEXT NOT NULL DEFAULT 'pix',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE public.gift_purchases ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "gift_purchases_select" ON public.gift_purchases;
        DROP POLICY IF EXISTS "gift_purchases_insert" ON public.gift_purchases;
        CREATE POLICY "gift_purchases_select" ON public.gift_purchases FOR SELECT USING (true);
        CREATE POLICY "gift_purchases_insert" ON public.gift_purchases FOR INSERT WITH CHECK (true);
      `
    })
  })

  const result = await response.text()
  console.log('pg/query status:', response.status)
  console.log('pg/query result:', result.substring(0, 500))

  // Also try via rest/v1/rpc
  console.log('\nTrying via PostgREST RPC...')
  const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({ sql: 'SELECT 1' })
  })
  console.log('RPC status:', rpcRes.status, await rpcRes.text().then(t => t.substring(0, 200)))
}

run().catch(console.error)
