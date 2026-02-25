import React from "react"
import type { Metadata } from 'next'
import { Cormorant_Garamond, Lato } from 'next/font/google'

import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant'
})

const lato = Lato({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato'
})

export const metadata: Metadata = {
  title: 'Chá de Casa Nova - Katariny & Ryanne',
  description: 'Celebre conosco essa nova fase das nossas vidas',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${lato.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
