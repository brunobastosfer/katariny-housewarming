'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export function RsvpForm() {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'attending' | 'not_attending' | null>(null)
  const [hasCompanion, setHasCompanion] = useState(false)
  const [companionName, setCompanionName] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] RSVP form submitted', { name, status })
    
    if (!name.trim() || !status) {
      console.log('[v0] Validation failed - missing fields')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const rsvpStatus = status === 'attending' ? 'confirmed' : 'declined'
    console.log('[v0] Inserting RSVP:', { name: name.trim(), status: rsvpStatus, companionName: hasCompanion ? companionName.trim() : null })
    const { data, error } = await supabase.from('rsvps').insert({
      name: name.trim(),
      status: rsvpStatus,
      companion_name: hasCompanion && companionName.trim() ? companionName.trim() : null,
    }).select()

    console.log('[v0] Supabase response:', { data, error })
    setLoading(false)

    if (error) {
      console.error('[v0] Error submitting RSVP:', error)
      alert('Erro ao confirmar presença. Por favor, tente novamente.')
    } else {
      console.log('[v0] RSVP submitted successfully')
      setSubmitted(true)
      setName('')
      setStatus(null)
      setHasCompanion(false)
      setCompanionName('')
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  return (
    <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-2 border-primary/10">
      {submitted ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-2">
            Confirmação Recebida!
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Obrigado por confirmar sua presença.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-foreground font-semibold">
              Seu Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-foreground font-semibold mb-3 block text-sm sm:text-base">
              Você vai ao evento?
            </Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setStatus('attending')}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 transition-all ${
                  status === 'attending'
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background text-foreground border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold text-sm sm:text-base">Sim, vou!</div>
                <div className="text-xs sm:text-sm opacity-80">Estarei presente</div>
              </button>
              <button
                type="button"
                onClick={() => setStatus('not_attending')}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 transition-all ${
                  status === 'not_attending'
                    ? 'bg-muted text-foreground border-muted-foreground shadow-md'
                    : 'bg-background text-foreground border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold text-sm sm:text-base">Não poderei</div>
                <div className="text-xs sm:text-sm opacity-80">Infelizmente não</div>
              </button>
            </div>
          </div>

          {status === 'attending' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292m0 0H7.464m4.536 0h4.536m-9-1.06a9 9 0 1118 0" />
                </svg>
                <input
                  type="checkbox"
                  id="hasCompanion"
                  checked={hasCompanion}
                  onChange={(e) => {
                    setHasCompanion(e.target.checked)
                    if (!e.target.checked) setCompanionName('')
                  }}
                  className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary"
                />
                <Label htmlFor="hasCompanion" className="text-foreground font-semibold cursor-pointer">
                  Vou acompanhado(a)
                </Label>
              </div>

              {hasCompanion && (
                <div>
                  <Label htmlFor="companionName" className="text-foreground font-semibold">
                    Nome do Acompanhante
                  </Label>
                  <Input
                    id="companionName"
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    placeholder="Digite o nome do acompanhante"
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={!name.trim() || !status || loading}
            className="w-full py-5 sm:py-6 text-base sm:text-lg font-semibold"
          >
            {loading ? 'Confirmando...' : 'Confirmar Presença'}
          </Button>
        </form>
      )}
    </div>
  )
}
