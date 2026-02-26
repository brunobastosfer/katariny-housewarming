import { createClient } from '@/lib/supabase/server'

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
  gift_purchases: Purchase[]
}

type Rsvp = {
  id: string
  name: string
  status: string
  companion_name: string | null
  created_at: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function InformacoesPage() {
  const supabase = await createClient()

  const [{ data: rsvps }, { data: gifts }] = await Promise.all([
    supabase.from('rsvps').select('*').order('created_at', { ascending: false }),
    supabase.from('gifts').select('id, name, price, image_url, created_at, gift_purchases(id, purchaser_name, payment_method, created_at)').order('name'),
  ])

  const allRsvps: Rsvp[] = rsvps || []
  const allGifts: Gift[] = (gifts as Gift[]) || []

  const attending = allRsvps.filter((r) => r.status === 'confirmed')
  const notAttending = allRsvps.filter((r) => r.status === 'declined')
  const giftsWithPurchases = allGifts.filter((g) => g.gift_purchases?.length > 0)
  const totalPurchases = allGifts.reduce((sum, g) => sum + (g.gift_purchases?.length || 0), 0)
  const totalArrecadado = allGifts.reduce((sum, g) => {
    const count = g.gift_purchases?.length || 0
    return sum + Number(g.price) * count
  }, 0)

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-primary/20">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Painel de Informações
          </h1>
          <p className="text-muted-foreground">Chá de Casa Nova — Katariny & Ryanne</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary text-primary-foreground rounded-xl p-5 shadow-md">
            <div className="text-4xl font-bold mb-1">{attending.length}</div>
            <div className="text-sm opacity-90">Confirmados</div>
          </div>
          <div className="bg-muted text-foreground rounded-xl p-5 shadow-md">
            <div className="text-4xl font-bold mb-1">{notAttending.length}</div>
            <div className="text-sm opacity-70">Não Vão</div>
          </div>
          <div className="bg-accent text-accent-foreground rounded-xl p-5 shadow-md">
            <div className="text-4xl font-bold mb-1">{totalPurchases}</div>
            <div className="text-sm opacity-90">Presentes Dados</div>
          </div>
          <div className="bg-card border-2 border-primary/20 rounded-xl p-5 shadow-md">
            <div className="text-2xl font-bold mb-1 text-primary">R$ {totalArrecadado.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Total Arrecadado</div>
          </div>
        </div>

        {/* RSVPs Section */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-border">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            Confirmações de Presença
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Attending */}
            <div>
              <h3 className="font-semibold text-lg text-primary mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Vão Comparecer ({attending.length})
              </h3>
              <div className="space-y-2">
                {attending.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhuma confirmação ainda.</p>
                ) : (
                  attending.map((rsvp) => (
                    <div key={rsvp.id} className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                      <p className="font-semibold text-foreground">{rsvp.name}</p>
                      {rsvp.companion_name && (
                        <p className="text-sm text-muted-foreground">+ {rsvp.companion_name}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(rsvp.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Not Attending */}
            <div>
              <h3 className="font-semibold text-lg text-muted-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Não Poderão Comparecer ({notAttending.length})
              </h3>
              <div className="space-y-2">
                {notAttending.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhuma ausência registrada.</p>
                ) : (
                  notAttending.map((rsvp) => (
                    <div key={rsvp.id} className="bg-muted/50 rounded-lg p-3 border border-border">
                      <p className="font-semibold text-foreground">{rsvp.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(rsvp.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gifts & Purchases Section */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-border">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            Presentes e Presenteadores
          </h2>

          {giftsWithPurchases.length === 0 ? (
            <p className="text-muted-foreground">Nenhum presente foi adquirido ainda.</p>
          ) : (
            <div className="space-y-4">
              {giftsWithPurchases.map((gift) => (
                <div key={gift.id} className="bg-accent/5 rounded-xl p-5 border-2 border-accent/20">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-foreground text-lg">{gift.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {gift.gift_purchases.length} {gift.gift_purchases.length === 1 ? 'presente dado' : 'presentes dados'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-primary">R$ {Number(gift.price).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">por pessoa</p>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-border pt-3">
                    {gift.gift_purchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-foreground">{purchase.purchaser_name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className="capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                            {purchase.payment_method === 'pix' ? 'PIX' : 'Cartão'}
                          </span>
                          <span className="text-xs">{formatDate(purchase.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {giftsWithPurchases.length > 0 && (
            <div className="mt-8 pt-6 border-t-2 border-border flex justify-between items-center">
              <p className="font-semibold text-lg text-foreground">Total Arrecadado:</p>
              <p className="text-3xl font-bold text-primary">R$ {totalArrecadado.toFixed(2)}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
