'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { Home, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import AjaccioRadarChart from '@/components/market/AjaccioRadarChart'
import DemoPieChart from '@/components/market/DemoPieChart'
import { UrbanismeAccordion } from '@/components/market/UrbanismeAccordion'
import { fadeUp, staggerContainer } from '@/lib/motion'

const AjaccioMap = dynamic(() => import('@/components/market/AjaccioMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-[#D6EEF5] rounded-xl animate-pulse" aria-hidden="true" />
  ),
})

const TOC_LINKS = [
  { href: '#marche', label: 'Marché immobilier' },
  { href: '#demographie', label: 'Démographie' },
  { href: '#urbanisme', label: 'Urbanisme' },
  { href: '#profils', label: 'Profils acheteurs/vendeurs' },
  { href: '#secteurs', label: 'Explorer les secteurs' },
]

const DEMO_STATS = [
  { label: 'Population Ajaccio', value: '72 000 hab.' },
  { label: 'Âge médian', value: '41 ans' },
  { label: '% propriétaires', value: '49 %' },
  { label: 'Résidences secondaires', value: '18 %' },
]

const URBANISME_ITEMS = [
  {
    title: 'Zone UA/UB — mixte résidentiel/commercial',
    content:
      "Le centre-ville d'Ajaccio est classé en zone UA/UB au PLU, autorisant un usage mixte résidentiel et commercial. Les constructions sont encadrées par des règles de hauteur (R+4 max dans le périmètre historique) et d'alignement sur voirie.",
  },
  {
    title: "PPRI — secteurs à risque d'inondation limités",
    content:
      "Le Plan de Prévention des Risques d'Inondation (PPRI) d'Ajaccio identifie quelques secteurs proches des cours d'eau. L'impact sur les transactions est limité mais doit être vérifié avant tout projet de construction ou de rénovation lourde.",
  },
  {
    title: 'Projets 2024-2026 — réhabilitation cours Napoléon',
    content:
      "La Ville d'Ajaccio conduit la réhabilitation du cours Napoléon (2024-2026) : requalification piétonne, mobilier urbain, végétalisation. Ce projet devrait renforcer l'attractivité du centre historique et soutenir les valeurs immobilières du secteur.",
  },
]

const SECTOR_CARDS = [
  {
    cp: '20000',
    label: 'Ajaccio Centre',
    description: 'Centre historique, cours Napoléon, route des Sanguinaires.',
    priceSqm: '3 400 €/m²',
    href: '/marche/20000',
  },
  {
    cp: '20090',
    label: 'Ajaccio Sud',
    description: "Aspretto, Les Cannes - Les Salines, Jardins de l'Empereur, Binda.",
    priceSqm: '3 100 €/m²',
    href: '/marche/20090',
  },
  {
    cp: '20167',
    label: 'Mezzavia',
    description: "Quartier calme d'Ajaccio, cadre résidentiel à l'écart du trafic.",
    priceSqm: '2 900 €/m²',
    href: '/marche/20167',
  },
]

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AjaccioPageContent() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <nav aria-label="Table des matières">
            <p className="font-[family-name:var(--font-poppins)] text-xs font-semibold text-[#666666] uppercase tracking-wider mb-4">
              Sur cette page
            </p>
            <ul className="flex flex-col gap-2">
              {TOC_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#5C5C5C] hover:text-[#2E86AB] transition-colors py-1 block leading-snug"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/estimer" tabIndex={-1}>
            <Button variant="prestige" size="lg" className="w-full mt-8">
              Estimer mon bien
            </Button>
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="min-w-0">
        {/* Section 1 — Introduction */}
        <section id="marche" className="mb-16 scroll-mt-24">
          <motion.div
            ref={heroRef}
            variants={staggerContainer}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
          >
            <motion.h1
              variants={fadeUp}
              className="font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-4xl text-[#1B4F72] mb-4"
            >
              Ajaccio — Marché immobilier, démographie et urbanisme
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-[family-name:var(--font-open-sans)] text-[#5C5C5C] leading-relaxed text-base"
            >
              Capitale de la Corse-du-Sud et ville la plus peuplée de l&apos;île, Ajaccio offre
              un marché immobilier atypique en France métropolitaine. À la croisée de la demande
              locale, du tourisme résidentiel et de l&apos;investissement continental, les prix au
              m² y évoluent selon des dynamiques propres à chaque quartier. Le centre-ville
              historique (20000), avec ses rues piétonnes et sa façade maritime, attire les
              acquéreurs en quête de patrimoine. Le secteur sud (20090), plus récent, concentre
              l&apos;essentiel des résidences principales. Mezzavia (20167) offre un cadre
              résidentiel calme à l&apos;écart de l&apos;agitation urbaine. Avec 312 transactions
              analysées sur les 12 derniers mois, notre observatoire dresse un tableau précis de
              chaque micro-zone, alimenté exclusivement par les données{' '}
              <a
                href="https://app.dvf.etalab.gouv.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2E86AB] hover:underline"
                title="Accéder aux données DVF officielles"
              >
                DVF officielles
              </a>
              , mises à jour deux fois par an.
            </motion.p>

            {/* Hero image */}
            <motion.div
              variants={fadeUp}
              className="relative h-64 rounded-2xl overflow-hidden mt-6 mb-10"
            >
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
                alt="Vue panoramique du golfe d'Ajaccio"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </motion.div>

            {/* Radar chart */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <h2 className="font-[family-name:var(--font-poppins)] font-semibold text-lg text-[#1B4F72] mb-4">
                Comparatif des secteurs (indice 0-100)
              </h2>
              <AjaccioRadarChart />
            </motion.div>
          </motion.div>
        </section>

        {/* Section 2 — Démographie */}
        <section id="demographie" className="mb-16 scroll-mt-24">
          <AnimatedSection>
            <h2 className="font-[family-name:var(--font-poppins)] font-bold text-2xl text-[#1B4F72] mb-6">
              Démographie et profil des habitants
            </h2>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {DEMO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#D6EEF5] rounded-xl p-4 flex flex-col gap-1"
                >
                  <p className="text-xs text-[#666666]">{stat.label}</p>
                  <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Pie chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-base text-[#1B4F72] mb-4">
                Répartition du parc résidentiel
              </h3>
              <DemoPieChart />
              <p className="text-xs text-[#666666] mt-4">
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
            </div>
          </AnimatedSection>
        </section>

        {/* Section 3 — Urbanisme */}
        <section id="urbanisme" className="mb-16 scroll-mt-24">
          <AnimatedSection>
            <h2 className="font-[family-name:var(--font-poppins)] font-bold text-2xl text-[#1B4F72] mb-6">
              Urbanisme et réglementation
            </h2>

            {/* Map */}
            <div className="mb-6">
              <AjaccioMap />
            </div>

            {/* PLU accordion */}
            <UrbanismeAccordion items={URBANISME_ITEMS} />
          </AnimatedSection>
        </section>

        {/* Section 4 — Profils */}
        <section id="profils" className="mb-16 scroll-mt-24">
          <AnimatedSection>
            <h2 className="font-[family-name:var(--font-poppins)] font-bold text-2xl text-[#1B4F72] mb-6">
              Profil des acheteurs et vendeurs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Acheteur */}
              <div className="bg-[#D6EEF5] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#1B4F72] rounded-xl flex items-center justify-center shrink-0">
                    <UserCheck size={20} className="text-white" />
                  </div>
                  <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72]">
                    L&apos;acheteur type
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-[#5C5C5C] font-[family-name:var(--font-open-sans)]">
                  <li className="flex justify-between border-b border-[#1B4F72]/10 pb-2">
                    <span className="text-[#666666]">Âge moyen</span>
                    <span className="font-semibold text-[#1B4F72]">42 ans</span>
                  </li>
                  <li className="flex justify-between border-b border-[#1B4F72]/10 pb-2">
                    <span className="text-[#666666]">Budget</span>
                    <span className="font-semibold text-[#1B4F72]">250 000 – 400 000 €</span>
                  </li>
                  <li className="flex justify-between border-b border-[#1B4F72]/10 pb-2">
                    <span className="text-[#666666]">Motivation</span>
                    <span className="font-semibold text-[#1B4F72]">RP / Invest. locatif</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#666666]">Délai moyen</span>
                    <span className="font-semibold text-[#1B4F72]">4 mois</span>
                  </li>
                </ul>
              </div>

              {/* Vendeur */}
              <div className="bg-[#F5ECD7] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#C9A96E] rounded-xl flex items-center justify-center shrink-0">
                    <Home size={20} className="text-white" />
                  </div>
                  <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72]">
                    Le vendeur type
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-[#5C5C5C] font-[family-name:var(--font-open-sans)]">
                  <li className="flex justify-between border-b border-[#C9A96E]/20 pb-2">
                    <span className="text-[#666666]">Âge moyen</span>
                    <span className="font-semibold text-[#1B4F72]">58 ans</span>
                  </li>
                  <li className="flex justify-between border-b border-[#C9A96E]/20 pb-2">
                    <span className="text-[#666666]">Profil</span>
                    <span className="font-semibold text-[#1B4F72]">Succession / Déménagement</span>
                  </li>
                  <li className="flex justify-between border-b border-[#C9A96E]/20 pb-2">
                    <span className="text-[#666666]">Délai de vente</span>
                    <span className="font-semibold text-[#1B4F72]">3-6 mois</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#666666]">Prix constaté</span>
                    <span className="font-semibold text-[#1B4F72]">-2 % à +3 % vs estimation</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Section 5 — Secteurs */}
        <section id="secteurs" className="mb-16 scroll-mt-24">
          <AnimatedSection>
            <h2 className="font-[family-name:var(--font-poppins)] font-bold text-2xl text-[#1B4F72] mb-6">
              Explorer les secteurs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SECTOR_CARDS.map((sector) => (
                <Link
                  key={sector.cp}
                  href={sector.href}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center bg-[#D6EEF5] text-[#1B4F72] text-xs font-semibold font-[family-name:var(--font-poppins)] rounded-full px-3 py-1 mb-3">
                    {sector.cp}
                  </div>
                  <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-base mb-2 group-hover:text-[#2E86AB] transition-colors">
                    {sector.label}
                  </h3>
                  <p className="font-[family-name:var(--font-open-sans)] text-sm text-[#5C5C5C] mb-4 leading-relaxed">
                    {sector.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-poppins)] font-bold text-[#2E86AB] text-sm">
                      {sector.priceSqm}
                    </span>
                    <span className="text-[#2E86AB] text-sm group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Mobile CTA */}
        <div className="lg:hidden mt-8">
          <Link href="/estimer" tabIndex={-1}>
            <Button variant="prestige" size="lg" className="w-full">
              Estimer mon bien
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
