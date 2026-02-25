'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentPendingPage() {
  const searchParams = useSearchParams()
  const buyerName = searchParams.get('buyer_name')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center border-2 border-primary/20">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
          Pagamento Pendente
        </h1>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Seu pagamento está sendo processado. Assim que for confirmado, o presente será registrado automaticamente.
        </p>

        {buyerName && (
          <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10">
            <p className="text-sm text-muted-foreground mb-1">Presenteado por</p>
            <p className="font-semibold text-foreground">{decodeURIComponent(buyerName)}</p>
          </div>
        )}

        <Link href="/">
          <Button className="w-full py-6 text-lg font-semibold">
            Voltar para o Site
          </Button>
        </Link>
      </div>
    </div>
  )
}
