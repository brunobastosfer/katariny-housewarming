import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { gift_id, purchaser_name, payment_method } = await request.json()

    if (!gift_id || !purchaser_name || !payment_method) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('gift_purchases')
      .insert({
        gift_id,
        purchaser_name: purchaser_name.trim(),
        payment_method,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, purchase: data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
