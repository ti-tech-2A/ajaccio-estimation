import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { DataFreshnessBadge } from '@/components/market/DataFreshnessBadge'
import { PriceChart } from '@/components/market/PriceChart'
import { SegmentChart } from '@/components/market/SegmentChart'
import { TransactionsTable } from '@/components/market/TransactionsTable'
import { FiscalMiniSim } from '@/components/market/FiscalMiniSim'
import { UrbanismeAccordion } from '@/components/market/UrbanismeAccordion'
import { JsonLd } from '@/components/ui/JsonLd'
import { Button } from '@/components/ui/Button'
import { MARKET_20090 } from '@/data/market-data'

export const revalidate = 2592000

export const metadata: Metadata = {
  title: 'Prix immobilier Ajaccio 20090 — DVF Aspretto, Bodiccione, Madonuccia',
  description:
    "Prix au m², tendances DVF et transactions récentes à Ajaccio 20090 : Aspretto, Campo dell'Oro, Pietralba, Bodiccione, Octroi, Madonuccia, Binda, Saint-Joseph, Candia, Saint-Jean, La Pietrina. Données actualisées au 1er mai 2026.",
  openGraph: {
    title: 'Prix immobilier Ajaccio 20090 — DVF Aspretto, Sud',
    description:
      "Prix médian 3 100 €/m² pour un appartement, 3 800 €/m² pour une villa. Données DVF officielles.",
    url: 'https://ajaccio-estimation.fr/marche/20090',
    type: 'website',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ajaccio-estimation.fr' },
    { '@type': 'ListItem', position: 2, name: 'Marché', item: 'https://ajaccio-estimation.fr/marche' },
    { '@type': 'ListItem', position: 3, name: 'Ajaccio 20090', item: 'https://ajaccio-estimation.fr/marche/20090' },
  ],
}

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Prix immobiliers Ajaccio 20090 — DVF',
  description: 'Données DVF agrégées pour le code postal 20090 (Ajaccio sud)',
  url: 'https://ajaccio-estimation.fr/marche/20090',
  creator: { '@type': 'Organization', name: 'ajaccio-estimation.fr' },
  dateModified: '2026-05-01',
}

const URBANISME_ITEMS = [
  {
    title: "PLU — Plan Local d'Urbanisme",
    content:
      "Zone UB/UC dominante dans le secteur sud. Développement résidentiel pavillonnaire autorisé dans les quartiers de Bodiccione et Madonuccia. Hauteurs généralement limitées à R+3.",
  },
  {
    title: "PPRI — Plan de Prévention des Risques d'Inondation",
    content:
      "Zones sensibles identifiées autour du Prunelli et de la plaine d'Aspretto. Consulter le dossier PPRI disponible en mairie d'Ajaccio.",
  },
  {
    title: 'Projets urbains',
    content:
      "Réaménagement de la zone commerciale de Campo dell'Oro. Amélioration des liaisons piétonnes entre Aspretto et le centre-ville. Extension de la piste cyclable littorale.",
  },
]

const { monthlyPrices, segments, recentTransactions } = MARKET_20090

export default function Marche20090Page() {
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
        <span className="text-[#1B4F72] font-medium" aria-current="page">Ajaccio 20090</span>
      </nav>

      {/* Section 1 — H1 + AEO */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-poppins)] text-3xl font-bold text-[#1B4F72] mb-2">
          Prix immobilier Ajaccio 20090
        </h1>
        <DataFreshnessBadge />
        <p className="mt-4 text-[#5C5C5C] leading-relaxed max-w-3xl">
          À Ajaccio (20090), secteur englobant Aspretto et Campo dell&apos;Oro, Pietralba, Bodiccione, l&apos;Octroi, la
          Madonuccia, Binda, Saint-Joseph, Candia, Saint-Jean et La Pietrina / les Jardins de
          l&apos;Empereur, le prix médian au m² est de{' '}
          <strong className="text-[#1B4F72]">3 100 €</strong> pour un appartement et{' '}
          <strong className="text-[#1B4F72]">3 800 €</strong> pour une villa, selon les données DVF
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
          Vous avez un bien à Ajaccio 20090 ?
        </h2>
        <p className="text-[#D6EEF5] mb-6 max-w-md mx-auto">
          Obtenez une estimation gratuite basée sur les données DVF de ce secteur.
        </p>
        <Link href="/estimer?cp=20090">
          <Button variant="prestige" size="lg">
            Estimer mon bien
          </Button>
        </Link>
      </section>
    </main>
  )
}
