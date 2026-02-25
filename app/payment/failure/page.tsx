'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center border-2 border-destructive/20">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
          Pagamento Não Realizado
        </h1>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Não foi possível processar seu pagamento. Você pode tentar novamente ou escolher outro método de pagamento.
        </p>

        <Link href="/">
          <Button className="w-full py-6 text-lg font-semibold">
            Voltar para o Site
          </Button>
        </Link>
      </div>
    </div>
  )
}
