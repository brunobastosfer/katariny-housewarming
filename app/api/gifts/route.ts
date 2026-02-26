import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()

    // Use AbortController to timeout the request after 8 seconds
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const { data: gifts, error } = await supabase
      .from('gifts')
      .select('id, name, price, image_url, purchased, purchaser_name, created_at')
      .order('name')
      .abortSignal(controller.signal)

    clearTimeout(timeout)

    if (error) {
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(Array.isArray(gifts) ? gifts : [], {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (err: unknown) {
    return NextResponse.json([], { status: 200 })
  }
}
