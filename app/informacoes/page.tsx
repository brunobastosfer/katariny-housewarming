import { createClient } from '@/lib/supabase/server'

export default async function InformacoesPage() {
  const supabase = await createClient()

  const { data: rsvps } = await supabase
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: gifts } = await supabase
    .from('gifts')
    .select('*')
    .order('name')

  const attending = rsvps?.filter((r) => r.status === 'confirmed') || []
  const notAttending = rsvps?.filter((r) => r.status === 'declined') || []
  const purchasedGifts = gifts?.filter((g) => g.purchased && g.purchaser_name) || []

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-primary/20 mb-8">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Painel de Informações
          </h1>
          <p className="text-muted-foreground">
            Chá de Casa Nova - Katariny & Ryanne
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary text-primary-foreground rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold mb-2">{attending.length}</div>
            <div className="text-sm opacity-90">Confirmaram Presença</div>
          </div>
          <div className="bg-muted text-foreground rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold mb-2">{notAttending.length}</div>
            <div className="text-sm opacity-70">Não Poderão Comparecer</div>
          </div>
          <div className="bg-accent text-accent-foreground rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold mb-2">{purchasedGifts.length}</div>
            <div className="text-sm opacity-90">Presentes Adquiridos</div>
          </div>
        </div>

        {/* RSVPs Section */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-border mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            Confirmações de Presença
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
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
                    <div
                      key={rsvp.id}
                      className="bg-primary/5 rounded-lg p-3 border border-primary/10"
                    >
                      <p className="font-semibold text-foreground">{rsvp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rsvp.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

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
                    <div
                      key={rsvp.id}
                      className="bg-muted/50 rounded-lg p-3 border border-border"
                    >
                      <p className="font-semibold text-foreground">{rsvp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rsvp.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gifts Section */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-border">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            Presentes Adquiridos
          </h2>

          {purchasedGifts.length === 0 ? (
            <p className="text-muted-foreground">Nenhum presente foi adquirido ainda.</p>
          ) : (
            <div className="space-y-3">
              {purchasedGifts.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-accent/10 rounded-lg p-4 border-2 border-accent/20 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground text-lg">{gift.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Presenteado por: <span className="font-semibold text-primary">{gift.purchaser_name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {gift.created_at && new Date(gift.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">R$ {gift.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t-2 border-border">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg text-foreground">Total Arrecadado:</p>
              <p className="text-3xl font-bold text-primary">
                R${' '}
                {purchasedGifts
                  .reduce((sum, gift) => sum + gift.price, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
