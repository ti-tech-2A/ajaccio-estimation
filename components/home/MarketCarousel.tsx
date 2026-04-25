'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface ZoneData {
  cp: string
  zone: string
  slug: string
  apptPrice: number
  villaPrice: number
  transactions: number
  evolution: string
  highlight: string
}

const ZONES: ZoneData[] = [
  {
    cp: '20000',
    zone: 'Ajaccio Centre',
    slug: '20000',
    apptPrice: 3400,
    villaPrice: 4200,
    transactions: 142,
    evolution: '+2,8 %',
    highlight: 'Centre historique · Cours Napoléon · Sanguinaires',
  },
  {
    cp: '20090',
    zone: 'Ajaccio Sud',
    slug: '20090',
    apptPrice: 3100,
    villaPrice: 3800,
    transactions: 128,
    evolution: '+1,9 %',
    highlight: 'Aspretto · Campo dell\'Oro · Jardins de l\'Empereur',
  },
  {
    cp: '20167',
    zone: 'Mezzavia',
    slug: '20167',
    apptPrice: 2900,
    villaPrice: 3500,
    transactions: 42,
    evolution: '+3,1 %',
    highlight: 'Mezzavia (Ajaccio) uniquement · hors Alata',
  },
]

export default function MarketCarousel() {
  const [active, setActive] = useState(0)
  const zone = ZONES[active]

  return (
    <section className="bg-[#0F2A4A] py-24 overflow-hidden relative">
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[#C9A96E] text-sm tracking-[0.15em] uppercase font-semibold mb-3">
              Données DVF officielles
            </p>
            <h2
              className="text-white leading-tight"
              style={{ fontFamily: 'var(--font-poppins)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em' }}
            >
              Le marché immobilier
              <br />à Ajaccio
            </h2>
          </div>
          <p className="text-white/40 text-sm font-[family-name:var(--font-dm-sans)] md:text-right">
            Actualisées au{' '}
            <time dateTime="2026-05-01" className="text-white/70">
              1er mai 2026
            </time>
            <br />
            Prochaine MAJ : novembre 2026
          </p>
        </div>

        {/* Tab selectors */}
        <div className="flex gap-1 mb-10 border border-white/10 rounded-xl p-1 w-fit">
          {ZONES.map((z, i) => (
            <button
              key={z.cp}
              onClick={() => setActive(i)}
              className={[
                'px-5 py-2.5 rounded-[10px] text-sm font-[family-name:var(--font-dm-sans)] font-medium transition-all duration-200 cursor-pointer',
                i === active
                  ? 'bg-[#C9A96E] text-white'
                  : 'text-white/50 hover:text-white/80',
              ].join(' ')}
            >
              {z.cp}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {/* Left — zone info */}
            <div>
              <h3
                style={{ fontFamily: 'var(--font-poppins)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 600, letterSpacing: '-0.01em' }}
                className="text-white mb-2"
              >
                {zone.zone}
              </h3>
              <p className="text-white/40 text-sm font-[family-name:var(--font-dm-sans)] mb-8 leading-relaxed">
                {zone.highlight}
              </p>

              {/* Price blocks */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="border-l-2 border-[#C9A96E] pl-4">
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">
                    Appartements
                  </p>
                  <p
                    style={{ fontFamily: 'var(--font-poppins)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}
                    className="text-white leading-none"
                  >
                    {zone.apptPrice.toLocaleString('fr-FR')}
                    <span className="text-base font-normal text-white/60 ml-1">€/m²</span>
                  </p>
                </div>
                <div className="border-l-2 border-white/20 pl-4">
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">
                    Villas
                  </p>
                  <p
                    style={{ fontFamily: 'var(--font-poppins)', fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}
                    className="text-white leading-none"
                  >
                    {zone.villaPrice.toLocaleString('fr-FR')}
                    <span className="text-base font-normal text-white/60 ml-1">€/m²</span>
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex gap-8">
                <div>
                  <p className="text-white/40 text-xs font-[family-name:var(--font-dm-sans)] mb-0.5">Transactions 12 mois</p>
                  <p className="text-white font-[family-name:var(--font-dm-sans)] font-semibold">{zone.transactions}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-medium mb-0.5">Évolution annuelle</p>
                  <p className="text-[#C9A96E] font-semibold">{zone.evolution}</p>
                </div>
              </div>
            </div>

            {/* Right — CTA card */}
            <div className="flex flex-col justify-between bg-white/5 border border-white/10 rounded-2xl p-8">
              <div>
                <p className="text-white/50 text-xs font-[family-name:var(--font-dm-sans)] uppercase tracking-wider mb-3">
                  Analyse complète
                </p>
                <p
                  style={{ fontFamily: 'var(--font-poppins)', fontSize: '1.5rem', fontWeight: 600 }}
                  className="text-white mb-4 leading-snug"
                >
                  Consultez les dernières<br />transactions notariées
                </p>
                <p className="text-white/40 text-sm font-[family-name:var(--font-dm-sans)] leading-relaxed">
                  Graphiques de tendances, segmentation par type de bien, données DVF filtrées secteur par secteur.
                </p>
              </div>
              <Link
                href={`/marche/${zone.slug}`}
                className="inline-flex items-center gap-2 mt-8 text-[#C9A96E] font-medium text-sm group"
              >
                Voir le marché {zone.cp}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom line */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-white/30 text-xs font-[family-name:var(--font-dm-sans)]">
            Source :{' '}
            <a
              href="https://app.dvf.etalab.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/70 underline transition-colors"
            >
              données DVF officielles
            </a>{' '}
            — Étalab / Ministère de l&apos;Économie
          </p>
          <Link
            href="/marche"
            className="text-white/50 text-xs font-[family-name:var(--font-dm-sans)] hover:text-white transition-colors"
          >
            Voir toutes les zones →
          </Link>
        </div>
      </div>
    </section>
  )
}
