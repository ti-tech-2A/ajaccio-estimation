import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { DataFreshnessBadge } from '@/components/market/DataFreshnessBadge'
import { PriceChart } from '@/components/market/PriceChart'
import { SegmentChart } from '@/components/market/SegmentChart'
import { TransactionsTable } from '@/components/market/TransactionsTable'
import { FiscalMiniSim } from '@/components/market/FiscalMiniSim'
import { UrbanismeAccordion } from '@/components/market/UrbanismeAccordion'
import { JsonLd } from '@/components/ui/JsonLd'
import { Button } from '@/components/ui/Button'
import { MARKET_20167 } from '@/data/market-data'

export const revalidate = 2592000

export const metadata: Metadata = {
  title: 'Prix immobilier Mezzavia Ajaccio 20167 — DVF',
  description:
    "Prix au m², tendances DVF et transactions récentes à Mezzavia, quartier d'Ajaccio (20167, INSEE 2A004). Données exclusivement pour la commune d'Ajaccio — Alata exclue. Données actualisées au 1er mai 2026.",
  openGraph: {
    title: 'Prix immobilier Mezzavia Ajaccio 20167 — DVF',
    description:
      "Prix médian 2 900 €/m² pour un appartement, 3 500 €/m² pour une villa à Mezzavia (Ajaccio 20167). Données DVF officielles.",
    url: 'https://ajaccio-estimation.fr/marche/20167',
    type: 'website',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ajaccio-estimation.fr' },
    { '@type': 'ListItem', position: 2, name: 'Marché', item: 'https://ajaccio-estimation.fr/marche' },
    { '@type': 'ListItem', position: 3, name: 'Mezzavia 20167', item: 'https://ajaccio-estimation.fr/marche/20167' },
  ],
}

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Prix immobiliers Mezzavia 20167 — DVF',
  description:
    "Données DVF agrégées pour Mezzavia (code postal 20167, commune d'Ajaccio, INSEE 2A004). Les données d'Alata ne sont pas incluses.",
  url: 'https://ajaccio-estimation.fr/marche/20167',
  creator: { '@type': 'Organization', name: 'ajaccio-estimation.fr' },
  dateModified: '2026-05-01',
}

const URBANISME_ITEMS = [
  {
    title: "PLU — Plan Local d'Urbanisme",
    content:
      "Zone AU (à urbaniser) et N (naturelle) prédominantes. Mezzavia conserve un caractère péri-urbain avec des hauteurs limitées à R+2 dans les nouvelles opérations. Consulter le PLU d'Ajaccio pour les parcelles concernées.",
  },
  {
    title: "PPRI — Plan de Prévention des Risques d'Inondation",
    content:
      "Certaines parties du territoire de Mezzavia sont soumises à un aléa inondation lié aux cours d'eau secondaires. Vérifier la situation de la parcelle auprès de la mairie d'Ajaccio.",
  },
  {
    title: 'Projets urbains',
    content:
      "Amélioration de la desserte en transport en commun vers le centre-ville. Études en cours pour l'extension de la zone d'activités.",
  },
]

const { monthlyPrices, segments, recentTransactions } = MARKET_20167

export default function Marche20167Page() {
  return (
    <main className="max-w-5xl mx-auto px-4 pt-32 pb-10">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={datasetSchema} />

      {/* Breadcrumb visual */}
      <nav aria-label="Fil d'Ariane" className="text-sm text-[#9B9B9B] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#2E86AB]">Accueil</Link>
        <span>/</span>
        <Link href="/marche" className="hover:text-[#2E86AB]">Marché</Link>
        <span>/</span>
        <span className="text-[#1B4F72] font-medium" aria-current="page">Mezzavia 20167</span>
      </nav>

      {/* Mezzavia/Alata warning */}
      <div className="flex items-start gap-3 p-4 bg-[#EDD9B3] rounded-xl mb-6 text-sm text-[#5C5C5C]">
        <AlertTriangle size={18} className="text-[#C9A96E] shrink-0 mt-0.5" />
        <span>
          <strong className="text-[#1B4F72]">CP 20167 — Périmètre Mezzavia uniquement.</strong>{' '}
          Cette page présente les données de Mezzavia, quartier de la commune d&apos;Ajaccio (INSEE
          2A004). Les données d&apos;Alata, commune indépendante partageant ce code postal, ne sont pas
          incluses.
        </span>
      </div>

      {/* Section 1 — H1 + AEO */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-poppins)] text-3xl font-bold text-[#1B4F72] mb-2">
          Prix immobilier Mezzavia — Ajaccio 20167
        </h1>
        <DataFreshnessBadge />
        <p className="mt-4 text-[#5C5C5C] leading-relaxed max-w-3xl">
          À Mezzavia, quartier d&apos;Ajaccio (20167), le prix médian au m² est de{' '}
          <strong className="text-[#1B4F72]">2 900 €</strong> pour un appartement et{' '}
          <strong className="text-[#1B4F72]">3 500 €</strong> pour une villa, selon les données DVF
          actualisées au{' '}
          <time dateTime="2026-05-01">1er mai 2026</time>.
        </p>
      </div>

      {/* Section 2 — PriceChart */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72] mb-4">
          Évolution des prix sur 24 mois (€/m²)
        </h2>
        <PriceChart data={monthlyPrices} />
      </section>

      {/* Section 3 — Transactions table */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72] mb-4">
          Dernières transactions DVF
        </h2>
        <TransactionsTable transactions={recentTransactions} />
      </section>

      {/* Section 4 — SegmentChart + table */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72] mb-4">
          Prix médians par segment (€/m²)
        </h2>
        <SegmentChart data={segments} />
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="bg-[#1B4F72] text-white">
                <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Segment</th>
                <th className="px-4 py-3 text-right font-semibold">Appartement (€/m²)</th>
                <th className="px-4 py-3 text-right font-semibold">Villa (€/m²)</th>
                <th className="px-4 py-3 text-right font-semibold rounded-tr-lg">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((s, i) => (
                <tr key={s.segment} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5ECD7]'}>
                  <td className="px-4 py-3 text-[#1B4F72] font-medium">{s.segment}</td>
                  <td className="px-4 py-3 text-right text-[#5C5C5C]">
                    {s.apartments > 0 ? s.apartments.toLocaleString('fr-FR') + ' €' : '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-[#5C5C5C]">
                    {s.villas > 0 ? s.villas.toLocaleString('fr-FR') + ' €' : '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-[#9B9B9B]">{s.transactionCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5 — Données INSEE */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72] mb-5">
          Données démographiques — Ajaccio
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-[#D6EEF5] rounded-xl p-4">
            <p className="text-xs text-[#9B9B9B] mb-1">Population</p>
            <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-xl">72 000</p>
            <p className="text-xs text-[#27AE60]">+0,8 % vs national</p>
          </div>
          <div className="bg-[#F5ECD7] rounded-xl p-4">
            <p className="text-xs text-[#9B9B9B] mb-1">Propriétaires</p>
            <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-xl">49 %</p>
            <p className="text-xs text-[#C0392B]">−9 % vs national</p>
          </div>
          <div className="bg-[#D6EEF5] rounded-xl p-4">
            <p className="text-xs text-[#9B9B9B] mb-1">Revenu médian</p>
            <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-xl">22 400 €</p>
            <p className="text-xs text-[#9B9B9B]">par an</p>
          </div>
          <div className="bg-[#F5ECD7] rounded-xl p-4">
            <p className="text-xs text-[#9B9B9B] mb-1">Résidences secondaires</p>
            <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-xl">18 %</p>
            <p className="text-xs text-[#9B9B9B]">du parc total</p>
          </div>
        </div>
        <p className="text-xs text-[#9B9B9B]">
          Source :{' '}
          <a
            href="https://www.insee.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2E86AB] hover:underline"
          >
            données INSEE
          </a>
        </p>
      </section>

      {/* Section 6 — Urbanisme accordion */}
      <section className="mb-8">
        <h2 className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72] mb-4">
          Urbanisme &amp; réglementation
        </h2>
        <UrbanismeAccordion items={URBANISME_ITEMS} />
      </section>

      {/* Section 7 — FiscalMiniSim */}
      <section className="mb-8">
        <h2 className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72] mb-2">
          Fiscalité
        </h2>
        <FiscalMiniSim />
      </section>

      {/* Section 8 — CTA */}
      <section className="bg-[#1B4F72] rounded-2xl p-8 text-center">
        <h2 className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-white mb-3">
          Vous avez un bien à Mezzavia (20167) ?
        </h2>
        <p className="text-[#D6EEF5] mb-6 max-w-md mx-auto">
          Obtenez une estimation gratuite basée sur les données DVF de ce secteur.
        </p>
        <Link href="/estimer?cp=20167">
          <Button variant="prestige" size="lg">
            Estimer mon bien
          </Button>
        </Link>
      </section>
    </main>
  )
}
