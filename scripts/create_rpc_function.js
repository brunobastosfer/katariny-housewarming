import { createClient } from '@supabase/supabase-js'

const VPS_URL = 'http://187.77.58.54:8000'
const VPS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'

async function setupRPC() {
  console.log('[v0] Connecting to VPS Supabase at:', VPS_URL)
  
  const supabase = createClient(VPS_URL, VPS_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    // Create the RPC function directly using raw SQL
    const { data, error } = await supabase.rpc('query', {
      query: `
        CREATE OR REPLACE FUNCTION public.get_gifts()
        RETURNS TABLE (
          id UUID,
          name TEXT,
          price DECIMAL,
          image_url TEXT,
          purchased BOOLEAN,
          purchaser_name TEXT,
          created_at TIMESTAMPTZ
        ) 
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          SELECT id, name, price, image_url, purchased, purchaser_name, created_at
          FROM public.gifts
          ORDER BY name;
        $$;
        
        GRANT EXECUTE ON FUNCTION public.get_gifts() TO anon, authenticated;
      `
    })

    if (error) {
      console.error('[v0] Error creating RPC:', error)
    } else {
      console.log('[v0] RPC function created successfully!')
    }
  } catch (err) {
    console.error('[v0] Exception:', err.message)
    
    // Try alternative method - direct table query
    console.log('[v0] Attempting to fetch gifts directly...')
    const { data: gifts, error: fetchError } = await supabase
      .from('gifts')
      .select('*')
      .order('name')
    
    if (fetchError) {
      console.error('[v0] Error fetching gifts:', fetchError)
    } else {
      console.log('[v0] Successfully fetched gifts:', gifts?.length || 0, 'items')
    }
  }
}

setupRPC()
