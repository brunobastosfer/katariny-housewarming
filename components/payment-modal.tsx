'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import QRCode from 'qrcode'
import Image from 'next/image'

type Gift = {
  id: string
  name: string
  price: number
  image_url: string | null
  purchased_by: string | null
  purchased_at: string | null
}

type Props = {
  gift: Gift
  onClose: () => void
}

export function PaymentModal({ gift, onClose }: Props) {
  const [step, setStep] = useState<'name' | 'method' | 'pix' | 'card' | 'success'>('name')
  const [buyerName, setBuyerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [pixCode, setPixCode] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!buyerName.trim()) return
    setStep('method')
  }

  const handleMethodSelect = async (method: 'pix' | 'card') => {
    setPaymentMethod(method)
    
    if (method === 'pix') {
      // Generate PIX QR Code with proper format
      const pixKey = 'katariny_fernandes@hotmail.com'
      const amount = gift.price.toFixed(2)
      const merchantName = 'Katariny e Ryanne'
      const merchantCity = 'SAO PAULO'
      const txid = 'CHA' + Date.now().toString().slice(-10)
      
      // Build PIX payload following EMV specification
      const payloadElements = [
        '00020101', // Payload Format Indicator
        '010212', // Point of Initiation Method (dynamic)
        '26' + (22 + pixKey.length).toString().padStart(2, '0') + '0014br.gov.bcb.pix01' + pixKey.length.toString().padStart(2, '0') + pixKey,
        '52040000', // Merchant Category Code
        '5303986', // Transaction Currency (986 = BRL)
        '54' + amount.length.toString().padStart(2, '0') + amount,
        '5802BR', // Country Code
        '59' + merchantName.length.toString().padStart(2, '0') + merchantName,
        '60' + merchantCity.length.toString().padStart(2, '0') + merchantCity,
        '62' + (4 + txid.length).toString().padStart(2, '0') + '05' + txid.length.toString().padStart(2, '0') + txid
      ]
      
      const payload = payloadElements.join('')
      const crc = calculateCRC16(payload + '6304')
      const pixPayload = payload + '6304' + crc
      
      setPixCode(pixPayload)
      
      try {
        const qrCode = await QRCode.toDataURL(pixPayload, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: 'M'
        })
        setQrCodeUrl(qrCode)
        setStep('pix')
      } catch (err) {
        console.error('[v0] Error generating QR code:', err)
      }
    } else {
      // Redirect to Mercado Pago checkout
      setStep('card')
      initMercadoPago()
    }
  }

  const calculateCRC16 = (str: string): string => {
    let crc = 0xFFFF
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
  }

  const initMercadoPago = async () => {
    setLoading(true)
    console.log('[v0] Creating Mercado Pago preference for:', gift.name)

    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: gift.id,
          giftName: gift.name,
          giftPrice: gift.price,
          buyerName: buyerName,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment preference')
      }

      const data = await response.json()
      console.log('[v0] Preference created:', data.preferenceId)

      // Redirect to Mercado Pago checkout
      window.location.href = data.initPoint
    } catch (error) {
      console.error('[v0] Error creating preference:', error)
      alert('Erro ao iniciar pagamento. Por favor, tente novamente.')
      setStep('method')
    } finally {
      setLoading(false)
    }
  }

  const handlePixConfirmation = async () => {
    setLoading(true)
    const supabase = createClient()

    console.log('[v0] Confirming PIX payment for gift:', gift.id, 'buyer:', buyerName)

    const { data, error } = await supabase
      .from('gifts')
      .update({
        purchased: true,
        purchaser_name: buyerName,
      })
      .eq('id', gift.id)
      .select()

    console.log('[v0] Update response:', { data, error })
    setLoading(false)

    if (error) {
      console.error('[v0] Error updating gift:', error)
      alert('Erro ao confirmar pagamento. Por favor, tente novamente.')
    } else {
      setStep('success')
      setTimeout(() => {
        onClose()
        window.location.reload()
      }, 3000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b-2 border-primary/10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            {step === 'name' && 'Identificação'}
            {step === 'method' && 'Método de Pagamento'}
            {step === 'pix' && 'Pagamento PIX'}
            {step === 'card' && 'Pagamento com Cartão'}
            {step === 'success' && 'Sucesso!'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Gift Info */}
          <div className="bg-primary/5 rounded-xl p-4 mb-6 border-2 border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {gift.image_url ? (
                  <Image
                    src={gift.image_url || "/placeholder.svg"}
                    alt={gift.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{gift.name}</h3>
                <p className="text-2xl font-bold text-primary">R$ {gift.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Step: Name Input */}
          {step === 'name' && (
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <Label htmlFor="buyer-name" className="text-foreground font-semibold">
                  Qual é o seu nome?
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Informe seu nome para que possamos identificar quem presenteou.
                </p>
                <Input
                  id="buyer-name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                  className="text-lg py-6"
                />
              </div>
              <Button type="submit" className="w-full py-6 text-lg font-semibold">
                Continuar para Pagamento
              </Button>
            </form>
          )}

          {/* Step: Method Selection */}
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground mb-6">
                Escolha como deseja pagar pelo presente
              </p>
              
              <button
                onClick={() => handleMethodSelect('card')}
                className="w-full p-6 bg-card border-2 border-primary/20 hover:border-primary/40 rounded-xl transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">Pagar com Cartão</h3>
                    <p className="text-sm text-muted-foreground">Crédito ou débito via Mercado Pago</p>
                  </div>
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect('pix')}
                className="w-full p-6 bg-card border-2 border-primary/20 hover:border-primary/40 rounded-xl transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">Pagar com PIX</h3>
                    <p className="text-sm text-muted-foreground">Pagamento instantâneo via QR Code</p>
                  </div>
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <Button
                variant="outline"
                onClick={() => setStep('name')}
                className="w-full py-4"
              >
                Voltar
              </Button>
            </div>
          )}

          {/* Step: PIX Payment */}
          {step === 'pix' && qrCodeUrl && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Escaneie o QR Code abaixo com o app do seu banco para realizar o pagamento via PIX.
                </p>
                
                <div className="inline-block bg-white p-4 rounded-xl shadow-md">
                  <Image
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code PIX"
                    width={300}
                    height={300}
                    className="mx-auto"
                  />
                </div>

                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Chave PIX</p>
                  <p className="font-mono font-semibold text-foreground">
                    katariny_fernandes@hotmail.com
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixCode)
                      alert('Código PIX copiado!')
                    }}
                    className="w-full p-3 bg-primary/10 hover:bg-primary/20 rounded-lg border-2 border-primary/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold text-primary">Copiar código PIX</span>
                  </button>
                </div>

                <div className="mt-4 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Valor</p>
                  <p className="text-3xl font-bold text-primary">
                    R$ {gift.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-border pt-6 space-y-3">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Após realizar o pagamento, clique no botão abaixo para confirmar.
                </p>
                <Button
                  onClick={handlePixConfirmation}
                  disabled={loading}
                  className="w-full py-6 text-lg font-semibold"
                >
                  {loading ? 'Confirmando...' : 'Efetuei o PIX'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep('method')}
                  disabled={loading}
                  className="w-full py-4"
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}

          {/* Step: Card Payment */}
          {step === 'card' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-lg text-foreground font-semibold mb-2">
                    Preparando pagamento...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Você será redirecionado para o Mercado Pago
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                      Redirecionando para Mercado Pago
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Você está sendo redirecionado para a plataforma segura do Mercado Pago para finalizar seu pagamento.
                    </p>
                    <div className="bg-background rounded-lg p-4 border border-primary/10">
                      <p className="text-sm text-muted-foreground mb-1">Presente</p>
                      <p className="font-semibold text-foreground mb-3">{gift.name}</p>
                      <p className="text-2xl font-bold text-primary">R$ {gift.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setStep('method')}
                    className="w-full py-4"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-3xl font-bold text-foreground mb-3">
                Muito Obrigado!
              </h3>
              <p className="text-lg text-muted-foreground mb-2">
                Seu presente foi registrado com sucesso.
              </p>
              <p className="text-foreground font-semibold">
                Estamos muito felizes com sua contribuição!
              </p>
              <p className="text-sm text-muted-foreground mt-6">
                Katariny & Ryanne
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
