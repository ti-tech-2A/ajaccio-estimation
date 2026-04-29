'use client'

import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { getSectorsByPostalCode } from '@/data/sectors'
import { DataFreshnessBadge } from '@/components/market/DataFreshnessBadge'

const CoverageMap = dynamic(() => import('./CoverageMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-[24px] border border-[#D4A853]/20 bg-[#071523] shadow-[0_32px_74px_-44px_rgba(15,42,74,0.98)] md:h-[360px]">
      <div className="h-full rounded-[22px] bg-[radial-gradient(circle_at_30%_18%,rgba(46,134,171,0.24),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(212,168,83,0.18),transparent_38%)] animate-pulse" />
    </div>
  ),
})

const POSTAL_CODES: Array<{ cp: '20000' | '20090' | '20167'; zoneName: string; note?: string }> = [
  { cp: '20000', zoneName: 'Ajaccio Centre' },
  { cp: '20090', zoneName: 'Ajaccio Sud' },
  { cp: '20167', zoneName: 'Mezzavia', note: 'Mezzavia (Ajaccio) uniquement · Alata exclu' },
]

export default function Coverage() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section className="bg-[#EDE8DE] py-24">
      <div
        ref={ref}
        className="max-w-6xl mx-auto px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-14">
          <p className="text-[#C9A96E] text-sm tracking-[0.15em] uppercase font-semibold mb-3">
            Périmètre d&apos;estimation
          </p>
          <h2
            style={{ fontFamily: 'var(--font-poppins)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#0F2A4A' }}
          >
            Zones couvertes
          </h2>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* Left — zones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-8">
              {POSTAL_CODES.map(({ cp, zoneName, note }, idx) => {
                const sectors = getSectorsByPostalCode(cp)
                return (
                  <motion.div
                    key={cp}
                    initial={{ opacity: 0, x: -16 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: idx * 0.1 }}
                  >
                    {/* Zone header */}
                    <div className="flex items-baseline gap-3 mb-3">
                      <span
                        className="font-[family-name:var(--font-dm-sans)] font-bold text-white bg-[#0F2A4A] px-3 py-0.5 rounded-md"
                        style={{ fontSize: '12px' }}
                      >
                        {cp}
                      </span>
                      <span
                        style={{ fontFamily: 'var(--font-poppins)', fontSize: '1.375rem', fontWeight: 600, color: '#0F2A4A' }}
                      >
                        {zoneName}
                      </span>
                    </div>

                    {/* Sectors list */}
                    <ul className="flex flex-col gap-1.5 ml-1">
                      {sectors.map((sector) => (
                        <li
                          key={sector.id}
                          className="flex items-center gap-2 text-[#4A5568] font-[family-name:var(--font-dm-sans)]"
                          style={{ fontSize: '14px' }}
                        >
                          <span className="w-1 h-1 rounded-full bg-[#C9A96E] flex-shrink-0" aria-hidden="true" />
                          {sector.label}
                        </li>
                      ))}
                    </ul>

                    {/* CP 20167 warning */}
                    {note && (
                      <div className="mt-3 flex items-start gap-2 bg-[#F7F2EA] rounded-lg px-3 py-2 border-l-2 border-[#C9A96E]">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                          <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="#C9A96E" strokeWidth="1.25" strokeLinejoin="round" />
                          <path d="M8 6v3.5M8 11.5v.5" stroke="#C9A96E" strokeWidth="1.25" strokeLinecap="round" />
                        </svg>
                        <p className="text-[#4A5568] font-[family-name:var(--font-dm-sans)]" style={{ fontSize: '12px' }}>
                          {note}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right — map + badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            <CoverageMap />

            {/* Calendar badge */}
            <div className="bg-white rounded-2xl p-5 border border-[#EDE8DE] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0F2A4A] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p
                  className="font-[family-name:var(--font-dm-sans)] font-semibold text-[#0F2A4A] mb-1"
                  style={{ fontSize: '14px' }}
                >
                  Calendrier des mises à jour DVF
                </p>
                <DataFreshnessBadge variant="inline" showNextUpdate />
              </div>
            </div>

            {/* Non-coverage note */}
            <p className="text-[#5E6E7E] text-xs font-[family-name:var(--font-dm-sans)] leading-relaxed">
              Porticcio, Bastelicaccia, Pietrosella et les autres communes du golfe ne sont <strong className="text-[#4A5568]">pas couverts</strong>. Notre outil est calibré exclusivement sur les données Ajaccio pour garantir la précision.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
