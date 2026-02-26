import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    // Fetch gifts without detailed purchases info for homepage display
    const { data: gifts, error } = await supabase
      .from('gifts')
      .select('id, name, price, image_url, created_at, gift_purchases(id)')
      .order('name')
      .abortSignal(controller.signal)

    clearTimeout(timeout)

    if (error) {
      console.log('[v0] gifts+join error:', error.message, '— retrying without join')
      // Fallback: fetch gifts without join if gift_purchases table doesn't exist yet
      const { data: giftsOnly, error: error2 } = await supabase
        .from('gifts')
        .select('id, name, price, image_url, created_at')
        .order('name')

      if (error2) {
        console.log('[v0] gifts fallback error:', error2.message)
        return NextResponse.json([], { status: 200 })
      }

      // Attach empty purchases array so the UI works the same
      const giftsWithEmpty = (giftsOnly || []).map((g) => ({ ...g, gift_purchases: [] }))
      return NextResponse.json(giftsWithEmpty)
    }

    return NextResponse.json(Array.isArray(gifts) ? gifts : [])
  } catch (err) {
    console.log('[v0] gifts API exception:', err)
    return NextResponse.json([], { status: 200 })
  }
}
