import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes sur l'estimation immobilière à Ajaccio",
  description:
    "Toutes les réponses sur l'estimation immobilière à Ajaccio : méthode DVF, précision, zones couvertes, fiscalité.",
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
