import type { Metadata } from 'next'
import React from 'react'
import { MarketTabs } from '@/components/market/MarketTabs'
import { ReadingProgress } from '@/components/market/ReadingProgress'

export const metadata: Metadata = {
  title: 'Marché immobilier Ajaccio — Données DVF en temps réel',
  description:
    'Prix au m², tendances et transactions DVF à Ajaccio (20000, 20090, 20167 Mezzavia). Données officielles actualisées.',
}

export default function MarcheLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <ReadingProgress />
      <MarketTabs />
      {children}
    </div>
  )
}
