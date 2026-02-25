import { createClient } from '@/lib/supabase/server'
import { GiftList } from '@/components/gift-list'
import { RsvpForm } from '@/components/rsvp-form'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch gifts directly from table
  const { data: gifts, error } = await supabase
    .from('gifts')
    .select('*')
    .order('name')
  
  console.log('[v0] Gifts fetched:', { count: gifts?.length || 0, error })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Event Details */}
      <div className="relative bg-card border-b-4 border-primary/20">
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-primary/10 rounded-full">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Chá de Casa Nova
            </p>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
            Ryanne <span className="text-primary">&</span> Katariny
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 px-2">
            Com muito carinho, convidamos você para celebrar essa nova fase das nossas vidas.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 sm:gap-6 md:gap-12 mb-8 w-full max-w-3xl mx-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm text-muted-foreground">Data</p>
                <p className="font-semibold text-sm sm:text-base text-foreground">07 de Março, 2026</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Sábado às 13h</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm text-muted-foreground">Local</p>
                <p className="font-semibold text-sm sm:text-base text-foreground">Rua Pedro Boêmio, 911a</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Próximo ao Mercantil Santo Expedito</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Section */}
      <div className="bg-primary/5 py-8 sm:py-12 border-b-2 border-primary/10">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center text-foreground mb-2">
            Confirme sua Presença
          </h2>
          <p className="text-center text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            Sua confirmação é muito importante para nós!
          </p>
          <RsvpForm />
        </div>
      </div>

      {/* Gift List Section */}
      <div className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Lista de Presentes
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Escolha um presente para nos ajudar a montar nosso novo lar. Cada item foi escolhido com carinho!
            </p>
          </div>
          
          <GiftList gifts={gifts || []} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6 sm:py-8 text-center px-4">
        <p className="font-serif text-lg sm:text-xl md:text-2xl mb-2">Obrigado por fazer parte desse momento!</p>
        <p className="text-xs sm:text-sm opacity-90">Ryanne & Katariny</p>
      </footer>
    </div>
  )
}
