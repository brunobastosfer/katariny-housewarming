import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[v0] MP webhook received:', body)

    // Mercado Pago sends notifications with type and data.id
    if (body.type === 'payment') {
      const paymentId = body.data.id

      // Initialize Mercado Pago client
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
      })

      const payment = new Payment(client)
      const paymentInfo = await payment.get({ id: paymentId })

      console.log('[v0] Payment info:', paymentInfo)

      // Check if payment is approved
      if (paymentInfo.status === 'approved') {
        const giftId = paymentInfo.metadata?.gift_id
        const buyerName = paymentInfo.metadata?.buyer_name

        if (giftId && buyerName) {
          // Update gift in database
          const supabase = await createClient()
          const { error } = await supabase
            .from('gifts')
            .update({
              purchased: true,
              purchaser_name: buyerName,
            })
            .eq('id', giftId)

          if (error) {
            console.error('[v0] Error updating gift:', error)
          } else {
            console.log('[v0] Gift updated successfully:', giftId)
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
