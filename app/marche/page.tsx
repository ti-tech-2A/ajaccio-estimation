import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { DataFreshnessBadge } from '@/components/market/DataFreshnessBadge'
import { ComparisonChart } from '@/components/market/ComparisonChart'
import { JsonLd } from '@/components/ui/JsonLd'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MARKET_20000, MARKET_20090, MARKET_20167 } from '@/data/market-data'

export const revalidate = 2592000

export const metadata: Metadata = {
  title: 'Marché immobilier Ajaccio — Prix DVF 20000, 20090, 20167',
  description:
    'Observatoire du marché immobilier ajaccien. Prix médians au m², tendances et transactions DVF pour les codes postaux 20000, 20090 et 20167 (Mezzavia). Données officielles actualisées.',
  openGraph: {
    title: 'Marché immobilier Ajaccio — Prix DVF 20000, 20090, 20167',
    description:
      "Prix médians, tendances et transactions DVF pour tous les secteurs d'Ajaccio.",
    url: 'https://ajaccio-estimation.fr/marche',
    type: 'website',
  },
}

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Prix immobiliers Ajaccio — DVF',
  description: 'Données DVF agrégées pour les CP 20000, 20090 et 20167 (Mezzavia)',
  url: 'https://ajaccio-estimation.fr/marche',
  creator: { '@type': 'Organization', name: 'ajaccio-estimation.fr' },
  dateModified: '2026-05-01',
}

const ALL_DATA = [MARKET_20000, MARKET_20090, MARKET_20167]

const comparisonData = ALL_DATA.map((d) => ({
  cp: d.postalCode,
  Appartements: d.apptPriceMedian,
  Villas: d.villaPriceMedian,
}))

function EvolutionBadge({ value }: { value: string }) {
  const isUp = value.startsWith('+')
  return (
    <Badge variant={isUp ? 'up' : 'down'} size="sm">
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {value}
    </Badge>
  )
}

export default function MarchePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 pt-32 pb-10">
      <JsonLd schema={datasetSchema} />

      {/* H1 + freshness */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-poppins)] text-3xl font-bold text-[#1B4F72] mb-2">
          Marché immobilier à Ajaccio
        </h1>
        <DataFreshnessBadge />
      </div>

      {/* Comparison BarChart */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72] mb-4">
          Prix médians par secteur (€/m²)
        </h2>
        <ComparisonChart data={comparisonData} />
      </section>

      {/* 3 CP cards */}
      <section className="mb-12">
        <h2 className="font-[family-name:var(--font-poppins)] text-xl font-semibold text-[#1B4F72] mb-5">
          Données par code postal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALL_DATA.map((d) => (
            <div
              key={d.postalCode}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="apartment" size="md">
                  {d.postalCode}
                </Badge>
                <EvolutionBadge value={d.priceEvolution12m} />
              </div>
              <p className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-base mb-4">
                {d.zone}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#D6EEF5] rounded-xl p-3">
                  <p className="text-xs text-[#9B9B9B] mb-1">Appartement</p>
                  <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-lg">
                    {d.apptPriceMedian.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-xs text-[#9B9B9B]">médiane / m²</p>
                </div>
                <div className="bg-[#F5ECD7] rounded-xl p-3">
                  <p className="text-xs text-[#9B9B9B] mb-1">Villa</p>
                  <p className="font-[family-name:var(--font-poppins)] font-bold text-[#C9A96E] text-lg">
                    {d.villaPriceMedian.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-xs text-[#9B9B9B]">médiane / m²</p>
                </div>
              </div>
              <p className="text-sm text-[#9B9B9B] mb-5">
                {d.transactionCount12m} transactions sur 12 mois
              </p>
              <div className="mt-auto">
                <Link
                  href={`/marche/${d.postalCode}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E86AB] hover:text-[#1B4F72] transition-colors"
                >
                  Voir les données
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1B4F72] rounded-2xl p-8 text-center">
        <h2 className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-white mb-3">
          Estimez votre bien gratuitement
        </h2>
        <p className="text-[#D6EEF5] mb-6 max-w-md mx-auto">
          Obtenez une estimation basée sur les données DVF réelles d&apos;Ajaccio, affinée par notre
          expert local.
        </p>
        <Link href="/estimer">
          <Button variant="prestige" size="lg">
            Estimer mon bien
          </Button>
        </Link>
      </section>
    </main>
  )
}
