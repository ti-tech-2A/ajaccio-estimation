'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Database, Eye, MapPin, type LucideIcon } from 'lucide-react'
import { fadeUp, slideInLeft, staggerContainer } from '@/lib/motion'

interface DiffItem {
  icon: LucideIcon
  title: string
  text: string
}

const DIFFS: DiffItem[] = [
  {
    icon: Database,
    title: 'Données DVF officielles',
    text: 'Chaque valeur repose sur les actes notariés enregistrés, pas sur un indice opaque.',
  },
  {
    icon: MapPin,
    title: 'Lecture micro-zone',
    text: 'Route des Sanguinaires, Vieille ville, Cours Napoléon, Binda, Les Cannes, Pietralba, Mezzavia : chaque zone est analysée avec son contexte.',
  },
  {
    icon: Eye,
    title: 'Transparence lisible',
    text: 'Nombre de comparables, niveau de précision et borne de prix : tout est explicite.',
  },
]

export default function Differentiators() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const leftInView = useInView(leftRef, { once: true, amount: 0.2 })
  const rightInView = useInView(rightRef, { once: true, amount: 0.2 })

  return (
    <section className="relative overflow-hidden bg-[#F7F2EA] py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_1.25fr] lg:gap-12 lg:px-12">
        <motion.div
          ref={leftRef}
          variants={slideInLeft}
          initial="hidden"
          animate={leftInView ? 'visible' : 'hidden'}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <span className="inline-flex rounded-full border border-[#0F2A4A]/12 bg-white px-4 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#0F2A4A]/72">
            Pourquoi ce positionnement
          </span>
          <h2
            className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.03em] text-[#0F2A4A] lg:text-5xl"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Un niveau de précision
            <br />
            pensé pour Ajaccio
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#4A5568]">
            Nous avons construit une expérience premium orientée décision : moins de bruit, plus de
            signal local, et une lecture immédiate des chiffres utiles.
          </p>
          <Link
            href="/faq"
            className="mt-6 inline-flex items-center text-sm font-semibold text-[#C9A96E] no-underline transition-colors hover:text-[#B8985E]"
          >
            Voir la méthode détaillée
          </Link>
        </motion.div>

        <motion.div
          ref={rightRef}
          variants={staggerContainer}
          initial="hidden"
          animate={rightInView ? 'visible' : 'hidden'}
          className="space-y-4"
        >
          {DIFFS.map((diff, index) => {
            const Icon = diff.icon

            return (
              <motion.article
                key={diff.title}
                variants={fadeUp}
                className="group rounded-2xl border border-[#E2DBCF] bg-white p-5 shadow-[0_24px_50px_-40px_rgba(15,42,74,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_65px_-40px_rgba(15,42,74,0.62)] md:p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#0F2A4A] text-white">
                    <Icon size={20} />
                  </span>
                  <div className="flex-1">
                    <p
                      className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9A96E]/75"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      0{index + 1}
                    </p>
                    <h3
                      className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[#0F2A4A]"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      {diff.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4A5568]">{diff.text}</p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
