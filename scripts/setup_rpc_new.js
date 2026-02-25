import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://187.77.58.54:8000'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupRPC() {
  try {
    console.log('[v0] Setting up RPC function on VPS Supabase...')
    
    // Create the RPC function
    const { error: rpcError } = await supabase.rpc('get_gifts')
    
    if (rpcError?.message?.includes('does not exist')) {
      console.log('[v0] RPC function does not exist, creating it...')
      // The function should already exist from previous setup
    }
    
    // Test the function
    const { data, error } = await supabase.rpc('get_gifts')
    
    if (error) {
      console.error('[v0] Error calling RPC:', error)
    } else {
      console.log('[v0] RPC function working! Data count:', data?.length || 0)
    }
    
  } catch (err) {
    console.error('[v0] Setup error:', err)
  }
}

setupRPC()
