import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Estimer mon bien à Ajaccio — Gratuit et immédiat',
  description:
    'Estimez votre appartement ou villa à Ajaccio en 2 minutes. Données DVF réelles, résultat immédiat, sans engagement.',
}

export default function EstimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
