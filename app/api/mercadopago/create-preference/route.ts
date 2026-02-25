import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function POST(request: NextRequest) {
  try {
    const { giftId, giftName, giftPrice, buyerName } = await request.json()

    console.log('[v0] Creating MP preference for:', { giftId, giftName, giftPrice, buyerName })

    // Initialize Mercado Pago client
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    })

    const preference = new Preference(client)

    // Create preference
    const result = await preference.create({
      body: {
        items: [
          {
            id: giftId,
            title: `Chá de Casa Nova - ${giftName}`,
            quantity: 1,
            unit_price: Number(giftPrice),
            currency_id: 'BRL',
          },
        ],
        payer: {
          name: buyerName,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success?gift_id=${giftId}&buyer_name=${encodeURIComponent(buyerName)}`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/pending?gift_id=${giftId}&buyer_name=${encodeURIComponent(buyerName)}`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/mercadopago/webhook`,
        metadata: {
          gift_id: giftId,
          buyer_name: buyerName,
        },
        statement_descriptor: 'Cha Casa Nova',
      },
    })

    console.log('[v0] MP preference created:', result.id)

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    })
  } catch (error) {
    console.error('[v0] Error creating MP preference:', error)
    return NextResponse.json(
      { error: 'Failed to create payment preference' },
      { status: 500 }
    )
  }
}
