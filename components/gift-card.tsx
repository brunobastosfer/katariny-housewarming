'use client'

import { Button } from '@/components/ui/button'

type Purchase = {
  id: string
  purchaser_name: string
  payment_method: string
  created_at: string
}

type Gift = {
  id: string
  name: string
  price: number
  image_url: string | null
  created_at: string | null
  gift_purchases?: Purchase[]
}

type Props = {
  gift: Gift
  onSelect: () => void
}

export function GiftCard({ gift, onSelect }: Props) {
  const price = Number(gift.price) || 0
  const purchases = gift.gift_purchases || []
  const hasPurchases = purchases.length > 0

  return (
    <div className="group bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-md border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl flex flex-col">
      <div className="relative aspect-square bg-muted overflow-hidden">
        {gift.image_url ? (
          <img
            src={gift.image_url}
            alt={gift.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.parentElement?.classList.add('flex', 'items-center', 'justify-center')
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        )}
        {hasPurchases && (
          <div className="absolute top-2 right-2">
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold shadow">
              {purchases.length}x presenteado
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
        <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {gift.name}
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">
          R$ {price.toFixed(2)}
        </p>

        {hasPurchases && (
          <div className="mb-3 space-y-1">
            {purchases.map((p) => (
              <p key={p.id} className="text-xs text-muted-foreground flex items-center gap-1">
                <svg className="w-3 h-3 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {p.purchaser_name}
              </p>
            ))}
          </div>
        )}

        <Button
          onClick={onSelect}
          className="w-full py-4 sm:py-5 md:py-6 font-semibold text-sm sm:text-base group-hover:scale-105 transition-transform mt-auto"
        >
          Presentear
        </Button>
      </div>
    </div>
  )
}
