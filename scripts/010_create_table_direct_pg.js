import pg from 'pg'

const { Client } = pg

// Try common VPS Postgres connection strings
const configs = [
  {
    host: '187.77.58.54',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
    ssl: false,
  },
  {
    host: '187.77.58.54',
    port: 5432,
    database: 'postgres',
    user: 'supabase_admin',
    password: 'postgres',
    ssl: false,
  },
  {
    host: '187.77.58.54',
    port: 54322, // Supabase local default
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
    ssl: false,
  },
]

const SQL = `
CREATE TABLE IF NOT EXISTS public.gift_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
  purchaser_name TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'pix',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.gift_purchases ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'gift_purchases' AND policyname = 'Allow public read on gift_purchases'
  ) THEN
    CREATE POLICY "Allow public read on gift_purchases"
      ON public.gift_purchases FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'gift_purchases' AND policyname = 'Allow public insert on gift_purchases'
  ) THEN
    CREATE POLICY "Allow public insert on gift_purchases"
      ON public.gift_purchases FOR INSERT WITH CHECK (true);
  END IF;
END $$;
`

for (const config of configs) {
  console.log(`\nTrying ${config.user}@${config.host}:${config.port}...`)
  const client = new Client({ ...config, connectionTimeoutMillis: 5000 })
  try {
    await client.connect()
    console.log('Connected!')
    await client.query(SQL)
    console.log('Table created successfully!')

    // Verify
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'gift_purchases'
      ORDER BY ordinal_position
    `)
    console.log('Table columns:', res.rows)
    await client.end()
    break
  } catch (err) {
    console.log('Failed:', err.message)
    try { await client.end() } catch {}
  }
}
