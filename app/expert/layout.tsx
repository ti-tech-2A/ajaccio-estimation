import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "Expert immobilier Ajaccio — 25 ans d'expérience locale",
  description:
    "Rencontrez votre expert immobilier indépendant à Ajaccio. 147 dossiers réalisés, connaissance intime des micro-zones, réponse sous 24h.",
}

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
