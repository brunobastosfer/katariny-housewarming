'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const giftId = searchParams.get('gift_id')
  const buyerName = searchParams.get('buyer_name')
  const [updating, setUpdating] = useState(false)
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    const updateGift = async () => {
      if (!giftId || !buyerName || updating || updated) return

      setUpdating(true)
      console.log('[v0] Updating gift after successful payment:', { giftId, buyerName })

      const supabase = createClient()
      const { error } = await supabase
        .from('gifts')
        .update({
          purchased: true,
          purchaser_name: decodeURIComponent(buyerName),
        })
        .eq('id', giftId)

      if (error) {
        console.error('[v0] Error updating gift:', error)
      } else {
        console.log('[v0] Gift updated successfully')
        setUpdated(true)
      }
      setUpdating(false)
    }

    updateGift()
  }, [giftId, buyerName, updating, updated])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center border-2 border-primary/20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
          Pagamento Confirmado!
        </h1>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Obrigado por presentear Ryanne e Katariny! Seu pagamento foi processado com sucesso.
        </p>

        <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10">
          <p className="text-sm text-muted-foreground mb-1">Presenteado por</p>
          <p className="font-semibold text-foreground">{buyerName ? decodeURIComponent(buyerName) : 'Convidado'}</p>
        </div>

        <Link href="/">
          <Button className="w-full py-6 text-lg font-semibold">
            Voltar para o Site
          </Button>
        </Link>
      </div>
    </div>
  )
}
