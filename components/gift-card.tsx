'use client'

import { Button } from '@/components/ui/button'

type Gift = {
  id: string
  name: string
  price: number
  image_url: string | null
  purchased: boolean
  purchaser_name: string | null
  created_at: string | null
}

type Props = {
  gift: Gift
  onSelect: () => void
}

export function GiftCard({ gift, onSelect }: Props) {
  const isPurchased = gift.purchased === true && !!gift.purchaser_name
  const price = Number(gift.price) || 0

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
        {isPurchased && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-lg">
              Ja Presenteado
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
        
        {isPurchased ? (
          <div className="text-center py-2 mt-auto">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Presenteado por <span className="font-semibold text-foreground">{gift.purchaser_name}</span>
            </p>
          </div>
        ) : (
          <Button
            onClick={onSelect}
            className="w-full py-4 sm:py-5 md:py-6 font-semibold text-sm sm:text-base group-hover:scale-105 transition-transform mt-auto"
          >
            Presentear
          </Button>
        )}
      </div>
    </div>
  )
}
