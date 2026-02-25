'use client'

import { useState } from 'react'
import Image from 'next/image'
import { GiftCard } from './gift-card'
import { PaymentModal } from './payment-modal'

type Gift = {
  id: string
  name: string
  price: number
  image_url: string | null
  purchased_by: string | null
  purchased_at: string | null
}

type Props = {
  gifts: Gift[]
}

export function GiftList({ gifts }: Props) {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)

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
