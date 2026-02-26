import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, status, companion_name } = body

    if (!name || !status) {
      return NextResponse.json({ error: 'Nome e status são obrigatórios' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('rsvps').insert({
      name: name.trim(),
      status,
      companion_name: companion_name || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
