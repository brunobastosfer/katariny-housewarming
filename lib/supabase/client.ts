import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Hardcoded VPS Supabase credentials - env vars point to old inactive project
  const url = 'http://187.77.58.54:8000'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxOTg4NDAwLCJleHAiOjE5Mjk3NTQ4MDB9.3B_L0EJ2qEqtbqNSee-PaOdx7KovztuLjT4RXK2aMgY'
  
  return createBrowserClient(url, key)
}
