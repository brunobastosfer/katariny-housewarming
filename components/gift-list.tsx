'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { GiftCard } from './gift-card'
import { PaymentModal } from './payment-modal'

type Gift = {
  id: string
  name: string
  price: number
  image_url: string | null
  purchased: boolean
  purchaser_name: string | null
  created_at: string | null
}

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => (Array.isArray(data) ? data : []))

export function GiftList() {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const { data: gifts, error, isLoading } = useSWR<Gift[]>('/api/gifts', fetcher)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md border-2 border-border animate-pulse">
            <div className="aspect-square bg-muted" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Não foi possível carregar os presentes. Tente novamente.</p>
      </div>
    )
  }

  if (!gifts || gifts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Nenhum presente disponível no momento.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {gifts.map((gift) => (
          <GiftCard
            key={gift.id}
            gift={gift}
            onSelect={() => setSelectedGift(gift)}
          />
        ))}
      </div>

      {selectedGift && (
        <PaymentModal
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
        />
      )}
    </>
  )
}
