import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PriceChart } from '@/components/market/PriceChart'
import { YearlyEvolutionChart } from '@/components/market/YearlyEvolutionChart'
import { SectorIntroduction } from '@/components/market/SectorIntroduction'
import { MicroSectorsTable } from '@/components/market/MicroSectorsTable'
import { TypologyPriceTable } from '@/components/market/TypologyPriceTable'
import { BuyerProfilesTable } from '@/components/market/BuyerProfilesTable'
import { FactorsGrid } from '@/components/market/FactorsGrid'
import { LiveTransactionsTable } from '@/components/market/LiveTransactionsTable'
import { SellerAdvice } from '@/components/market/SellerAdvice'
import { FaqAccordion } from '@/components/market/FaqAccordion'
import { MarketCTA } from '@/components/market/MarketCTA'
import { MarketHero } from '@/components/market/MarketHero'
import { SectionHeading } from '@/components/market/SectionHeading'
import { DvfSalesMapClient } from '@/components/market/DvfSalesMapClient'
import { JsonLd } from '@/components/ui/JsonLd'
import { Badge } from '@/components/ui/Badge'
import { getMarketPageData } from '@/lib/server/market-aggregates'
import { SECTOR_20000 } from '@/data/sector-content/20000'
import { DVF_LAST_UPDATE, DVF_LAST_UPDATE_LABEL, DVF_NEXT_UPDATE_LABEL } from '@/lib/constants'
import { CalendarClock } from 'lucide-react'

export const revalidate = 2592000

const SECTOR = SECTOR_20000
const POSTAL_CODE = '20000'
const ZONE_LABEL = 'Centre-ville · Cours Napoléon · Sanguinaires'

export const metadata: Metadata = {
  title: SECTOR.metaTitle,
  description: SECTOR.metaDescription,
  alternates: { canonical: `https://ajaccio-estimation.fr/marche/${POSTAL_CODE}` },
  openGraph: {
    title: SECTOR.metaTitle,
    description: SECTOR.metaDescription,
    url: `https://ajaccio-estimation.fr/marche/${POSTAL_CODE}`,
    type: 'website',
  },
}

export default async function Marche20000Page() {
  const { aggregates, typology, monthly, yearly, transactions } =
    await getMarketPageData(POSTAL_CODE)

  const monthlyChartData = monthly.series
    .filter((p) => p.medianSqm > 0)
    .map((p) => ({ month: p.label, pricePerSqm: p.medianSqm }))

  // ─── Schemas ───────────────────────────────────────────────────────────────

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ajaccio-estimation.fr' },
      { '@type': 'ListItem', position: 2, name: 'Marché immobilier', item: 'https://ajaccio-estimation.fr/marche' },
      { '@type': 'ListItem', position: 3, name: `Ajaccio ${POSTAL_CODE}`, item: `https://ajaccio-estimation.fr/marche/${POSTAL_CODE}` },
    ],
  }

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Prix immobiliers Ajaccio ${POSTAL_CODE} — DVF`,
    description: `Données DVF agrégées (médianes, évolution, typologie) pour le code postal ${POSTAL_CODE} d'Ajaccio.`,
    url: `https://ajaccio-estimation.fr/marche/${POSTAL_CODE}`,
    creator: { '@type': 'Organization', name: 'ajaccio-estimation.fr' },
    isAccessibleForFree: true,
    spatialCoverage: {
      '@type': 'Place',
      name: 'Ajaccio',
      address: { '@type': 'PostalAddress', postalCode: POSTAL_CODE, addressLocality: 'Ajaccio', addressCountry: 'FR' },
    },
    dateModified: DVF_LAST_UPDATE,
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SECTOR.faq.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }

  const realEstateListingSchema = transactions.rows.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Dernières transactions DVF — Ajaccio ${POSTAL_CODE}`,
        itemListElement: transactions.rows.slice(0, 5).map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Residence',
            name: `${t.type === 'villa' ? 'Villa' : 'Appartement'} — ${t.surface} m²`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: [t.number, t.street].filter(Boolean).join(' ') || undefined,
              postalCode: POSTAL_CODE,
              addressLocality: 'Ajaccio',
              addressCountry: 'FR',
            },
            floorSize: { '@type': 'QuantitativeValue', value: t.surface, unitCode: 'MTK' },
          },
        })),
      }
    : null

  return (
    <main className="pt-28 pb-16">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={datasetSchema} />
      <JsonLd schema={faqSchema} />
      {realEstateListingSchema && <JsonLd schema={realEstateListingSchema} />}

      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb + DVF date pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <nav
            aria-label="Fil d'Ariane"
            className="text-[13px] text-[#9B9B9B] flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#2E86AB] transition-colors">
              Accueil
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/marche" className="hover:text-[#2E86AB] transition-colors">
              Marché immobilier
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#1B4F72] font-medium" aria-current="page">
              Ajaccio {POSTAL_CODE}
            </span>
          </nav>
          <p className="inline-flex items-center gap-2 rounded-full bg-white border border-[#C9A96E]/30 px-3 py-1.5 text-[12px] font-medium text-[#5C5C5C] shadow-sm">
            <CalendarClock size={14} className="text-[#C9A96E]" aria-hidden="true" />
            <span>Market data</span>
          </p>
        </div>

        {/* ─── HERO + KPI dashboard ────────────────────────────────────── */}
        <MarketHero
          postalCode={POSTAL_CODE}
          zoneTitle={ZONE_LABEL}
          introSummary={SECTOR.introSummary}
          aggregates={aggregates}
        />

        {!aggregates.hasLiveData && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Données DVF live indisponibles pour le moment — les chiffres affichés peuvent être incomplets.
          </div>
        )}
      </div>

      {/* ─── BAND 1 — Présentation secteur (cream bg) ─────────────────── */}
      <div className="bg-[#FAF5EC]/60 mt-16 py-16 border-y border-[#C9A96E]/10">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <SectionHeading
            eyebrow="Comprendre le secteur"
            title="Ajaccio centre — un marché urbain et patrimonial"
            description="Sept questions essentielles pour cadrer la lecture immobilière du 20000."
          />
          <SectorIntroduction positioning={SECTOR.positioning} />
        </div>
      </div>

      {/* ─── BAND 2 — Micro-secteurs (white bg) ───────────────────────── */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <SectionHeading
            eyebrow="Micro-secteurs"
            title="Six sous-quartiers, six logiques différentes"
            description="Chaque adresse a son ADN — dynamiques, dominantes, points de vigilance."
          />
          <MicroSectorsTable sectors={SECTOR.microSectors} />
        </div>
      </div>

      {/* ─── BAND 3 — Tendances chiffrées (cream bg) ──────────────────── */}
      <div className="bg-[#FAF5EC]/60 py-16 border-y border-[#C9A96E]/10">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <SectionHeading
            eyebrow="Tendances Observées sur secteur"
            title="L'évolution des prix mois après mois, année après année"
            description="Toutes les médianes ci-dessous sont calculées en direct sur la base DVF officielle, après suppression des valeurs aberrantes (P25–P75)."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly chart */}
            <article className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100">
              <header className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#2E86AB] mb-2">
                  24 mois
                </p>
                <h3 className="font-[family-name:var(--font-poppins)] text-lg md:text-xl font-bold text-[#1B4F72]">
                  Évolution mensuelle
                </h3>
                <p className="text-sm text-[#9B9B9B] mt-1">
                  Médiane mensuelle des ventes d&apos;appartements.
                </p>
              </header>
              {monthlyChartData.length > 1 ? (
                <PriceChart data={monthlyChartData} />
              ) : (
                <p className="text-sm text-[#9B9B9B] py-12 text-center">
                  Volume mensuel insuffisant pour afficher une courbe fiable.
                </p>
              )}
            </article>

            {/* Yearly chart */}
            <article className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100">
              <header className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#C9A96E] mb-2">
                  6 ans
                </p>
                <h3 className="font-[family-name:var(--font-poppins)] text-lg md:text-xl font-bold text-[#1B4F72]">
                  Tendance pluriannuelle
                </h3>
                <p className="text-sm text-[#9B9B9B] mt-1">
                  Médiane annuelle après trim P25–P75.
                </p>
              </header>
              <YearlyEvolutionChart data={yearly.series} />
              <p className="text-[11px] italic text-[#9B9B9B] mt-3 leading-relaxed">
                À interpréter avec prudence si volume annuel faible.
              </p>
            </article>
          </div>
        </div>
      </div>

      {/* ─── CTA TOP — full-bleed gold accent ──────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <MarketCTA variant="top" postalCode={POSTAL_CODE} />
      </div>

      {/* ─── BAND 4 — Typologies + profils acheteurs ──────────────────── */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Prix par typologie"
              title="Studio, T2, T3, T4+, maisons : combien valent-ils vraiment ?"
              description="Médianes DVF sur 5 ans glissants, fourchettes interquartiles et lecture commerciale par segment."
            />
            <TypologyPriceTable typology={typology} />
          </div>

          <div className="space-y-8">
            <SectionHeading
              eyebrow="Qui achète ici"
              title="Six profils acheteurs et leurs critères-clés"
              description="Vendre, c'est cibler. Chaque profil regarde des critères différents — voici les vôtres."
            />
            <BuyerProfilesTable profiles={SECTOR.buyerProfiles} />
          </div>
        </div>
      </div>

      {/* ─── CTA MIDDLE ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4">
        <MarketCTA variant="middle" postalCode={POSTAL_CODE} />
      </div>

      {/* ─── BAND 5 — Facteurs valo / décote (cream bg) ──────────────── */}
      <div className="bg-[#FAF5EC]/60 mt-16 py-16 border-y border-[#C9A96E]/10">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <SectionHeading
            eyebrow="Critères qui font le prix"
            title="Ce qui valorise — ce qui pénalise"
            description="Deux biens identiques sur le papier peuvent valoir 25 % d'écart. Voici les leviers."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FactorsGrid
              tone="positive"
              title="Critères qui valorisent"
              description="Ce qui fait monter le prix dans ce secteur"
              factors={SECTOR.valuationFactors}
            />
            <FactorsGrid
              tone="negative"
              title="Critères qui pénalisent"
              description="Les freins identifiés sur ce secteur"
              factors={SECTOR.discountFactors}
            />
          </div>
        </div>
      </div>

      {/* ─── BAND 6 — Carte + transactions (white bg) ─────────────────── */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <SectionHeading
            eyebrow="Cartographie DVF"
            title="Les ventes récentes, vue par vue"
            description="Chaque cercle est une vente DVF des 24 derniers mois. Taille proportionnelle au prix au m²."
          />
          <DvfSalesMapClient transactions={transactions.rows} postalCode={POSTAL_CODE} />

          <article className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100 mt-2">
            <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#2E86AB] mb-1">
                  Détail des transactions · 24 mois
                </p>
                <h3 className="font-[family-name:var(--font-poppins)] text-lg md:text-xl font-bold text-[#1B4F72]">
                  Dernières transactions DVF
                </h3>
                <p className="text-sm text-[#9B9B9B] mt-1">
                  Adresses partielles publiées par l&apos;État — données officielles, vie privée préservée.
                </p>
              </div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#FAF5EC] border border-[#C9A96E]/20 px-3 py-1.5 text-[12px] font-medium text-[#5C5C5C] shrink-0">
                <CalendarClock size={14} className="text-[#C9A96E]" aria-hidden="true" />
                <span>
                  Mise à jour{' '}
                  <time dateTime={DVF_LAST_UPDATE} className="text-[#1B4F72] font-semibold">
                    {DVF_LAST_UPDATE_LABEL}
                  </time>
                </span>
              </p>
            </header>
            <LiveTransactionsTable transactions={transactions.rows} limit={12} />
          </article>
        </div>
      </div>

      {/* ─── BAND 7 — Démographie + urbanisme (cream bg) ──────────────── */}
      <div className="bg-[#FAF5EC]/60 py-16 border-y border-[#C9A96E]/10">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Cadre territorial"
              title="Démographie d'Ajaccio — le contexte qui pèse sur les prix"
              description="Comprendre Ajaccio dans son ensemble pour mieux interpréter les chiffres du 20000."
            />

            <article className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100">
              <h3 className="font-[family-name:var(--font-poppins)] text-lg font-bold text-[#1B4F72] mb-5">
                Données démographiques — Ajaccio
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-[#D6EEF5] rounded-xl p-4">
                  <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider font-bold mb-1">Population</p>
                  <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-xl">72 000</p>
                  <p className="text-xs text-[#1e8449] font-medium">+0,8 % vs national</p>
                </div>
                <div className="bg-[#F5ECD7] rounded-xl p-4">
                  <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider font-bold mb-1">Propriétaires</p>
                  <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-xl">49 %</p>
                  <p className="text-xs text-[#C0392B] font-medium">−9 % vs national</p>
                </div>
                <div className="bg-[#D6EEF5] rounded-xl p-4">
                  <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider font-bold mb-1">Revenu médian</p>
                  <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-xl">22 400 €</p>
                  <p className="text-xs text-[#9B9B9B]">par an</p>
                </div>
                <div className="bg-[#F5ECD7] rounded-xl p-4">
                  <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider font-bold mb-1">Résidences sec.</p>
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
                  className="text-[#2E86AB] hover:underline font-medium"
                >
                  données INSEE
                </a>
              </p>
            </article>

          </div>
        </div>
      </div>

      {/* ─── BAND 8 — Conseils vendeurs (white bg) ────────────────────── */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <SectionHeading
            eyebrow="Méthode"
            title="Vendre au juste prix — les 5 leviers qui font la différence"
            description="Ce que la donnée seule ne peut pas dire, l'expérience terrain le complète."
            tone="gold"
          />
          <SellerAdvice advice={SECTOR.sellerAdvice} />
        </div>
      </div>

      {/* ─── BAND 9 — FAQ (cream bg) ──────────────────────────────────── */}
      <div className="bg-[#FAF5EC]/60 py-16 border-y border-[#C9A96E]/10">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <SectionHeading
            eyebrow="Questions fréquentes"
            title={`Tout ce qu'on nous demande sur le 20000`}
            description="Réponses concises, non commerciales, basées sur le terrain."
          />
          <FaqAccordion items={SECTOR.faq} />
        </div>
      </div>

      {/* ─── CTA BOTTOM ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <MarketCTA variant="bottom" postalCode={POSTAL_CODE} zone="Ajaccio centre" />
      </div>

      {/* ─── Maillage interne ───────────────────────────────────────────── */}
      <nav
        aria-label="Autres secteurs d'Ajaccio"
        className="max-w-6xl mx-auto px-4 mt-16 pt-12 border-t border-gray-200"
      >
        <SectionHeading
          eyebrow="Continuer l'exploration"
          title="Découvrir les autres secteurs d'Ajaccio"
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link
            href="/marche/20090"
            className="group rounded-2xl bg-white border border-gray-100 hover:border-[#2E86AB] hover:shadow-lg hover:-translate-y-0.5 p-6 transition-all"
          >
            <Badge variant="apartment" size="sm">20090</Badge>
            <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-lg mt-3">
              Ajaccio Sud
            </p>
            <p className="text-sm text-[#9B9B9B] mt-1.5 leading-relaxed">
              Aspretto, Campo dell&apos;Oro, Les Cannes, Saint-Joseph, Pietrina.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2E86AB] mt-4 group-hover:gap-2 transition-all">
              Voir le marché 20090 <ArrowRight size={14} />
            </span>
          </Link>
          <Link
            href="/marche/20167"
            className="group rounded-2xl bg-white border border-gray-100 hover:border-[#2E86AB] hover:shadow-lg hover:-translate-y-0.5 p-6 transition-all"
          >
            <Badge variant="apartment" size="sm">20167</Badge>
            <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-lg mt-3">
              Mezzavia
            </p>
            <p className="text-sm text-[#9B9B9B] mt-1.5 leading-relaxed">
              Périphérie ajaccienne — maisons, espace, accessibilité (Mezzavia uniquement).
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2E86AB] mt-4 group-hover:gap-2 transition-all">
              Voir le marché 20167 <ArrowRight size={14} />
            </span>
          </Link>
          <Link
            href="/marche"
            className="group rounded-2xl bg-gradient-to-br from-[#1B4F72] to-[#2E86AB] text-white hover:shadow-lg hover:-translate-y-0.5 p-6 transition-all"
          >
            <Badge variant="prestige" size="sm">Vue globale</Badge>
            <p className="font-[family-name:var(--font-poppins)] font-bold text-white text-lg mt-3">
              Tout le marché Ajaccio
            </p>
            <p className="text-sm text-white/80 mt-1.5 leading-relaxed">
              Comparaison des trois codes postaux et synthèse globale.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#C9A96E] mt-4 group-hover:gap-2 transition-all">
              Voir la page pilier <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
