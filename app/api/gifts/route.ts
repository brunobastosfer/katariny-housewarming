import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: gifts, error } = await supabase
      .from('gifts')
      .select('id, name, price, image_url, purchased, purchaser_name, created_at')
      .order('name')

    if (error) {
      console.error('[v0] API gifts error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(gifts || [])
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] API gifts exception:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
