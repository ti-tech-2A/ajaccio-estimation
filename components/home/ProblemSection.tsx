'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, MapPin, ShieldCheck } from 'lucide-react'
import { fadeUp, slideInLeft, staggerContainer } from '@/lib/motion'

interface ProblemItem {
  title: string
  text: string
}

const PROBLEMS: ProblemItem[] = [
  {
    title: 'Écarts de prix sous-estimés',
    text: 'Les estimateurs nationaux lissent les valeurs et ignorent les micro-zones ajacciennes.',
  },
  {
    title: 'Mélange Mezzavia / Alata',
    text: 'Le CP 20167 couvre deux communes distinctes, ce qui fausse de nombreux modèles.',
  },
  {
    title: 'Mises à jour trop lentes',
    text: 'La plupart des outils ne suivent pas le rythme bi-annuel des publications DVF.',
  },
]

const SOLUTION_POINTS = [
  'Filtrage par code postal et code INSEE de la commune',
  'Lecture terrain locale pour valider les cas atypiques',
  'Synchronisation régulière des données',
  'Filtrage par micro-marché d\u0027Ajaccio',
]

export default function ProblemSection() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const leftInView = useInView(leftRef, { once: true, amount: 0.2 })
  const rightInView = useInView(rightRef, { once: true, amount: 0.2 })

  return (
    <section className="relative overflow-hidden bg-[#F7F2EA] py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-14 lg:px-12">
        <motion.div
          ref={leftRef}
          variants={slideInLeft}
          initial="hidden"
          animate={leftInView ? 'visible' : 'hidden'}
          className="self-start"
        >
          <span className="inline-flex rounded-full border border-[#0F2A4A]/12 bg-white px-4 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#0F2A4A]/70">
            Pourquoi les prix divergent
          </span>
          <h2
            className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.03em] text-[#0F2A4A] lg:text-5xl"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Ajaccio ne se lit pas
            <br />
            comme une moyenne nationale
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#4A5568]">
            Entre la route des Sanguinaires, le centre et les zones sud, les amplitudes de prix
            sont fortes. Une valuation premium doit donc raisonner à l&apos;échelle micro-locale.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-[#0F2A4A]/75">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm">
              <MapPin size={13} className="text-[#C9A96E]" />
              20000 · 20090 · 20167
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm">
              <ShieldCheck size={13} className="text-[#C9A96E]" />
              Données officielles DVF
            </span>
          </div>
        </motion.div>

        <motion.div
          ref={rightRef}
          variants={staggerContainer}
          initial="hidden"
          animate={rightInView ? 'visible' : 'hidden'}
          className="rounded-3xl border border-[#0F2A4A]/12 bg-white p-6 shadow-[0_24px_60px_-42px_rgba(15,42,74,0.45)] md:p-8"
        >
          <div className="space-y-4 border-b border-[#EDE8DE] pb-6">
            {PROBLEMS.map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="flex gap-4 rounded-2xl border border-[#EDE8DE] bg-[#FAF8F3] p-4"
              >
                <span
                  className="mt-0.5 block text-sm font-bold text-[#C9A96E]"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-[#0F2A4A]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#4A5568]">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-6 rounded-2xl bg-[#08162A] p-5 text-white">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#C9A96E]">
              Notre réponse premium
            </p>
            <ul className="mt-4 space-y-2.5">
              {SOLUTION_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-white/86">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#C9A96E]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
