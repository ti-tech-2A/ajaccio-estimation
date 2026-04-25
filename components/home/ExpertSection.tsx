'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Award, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react'
import { fadeUp, scaleIn, staggerContainer } from '@/lib/motion'

interface ExpertMetric {
  value: string
  label: string
}

const EXPERT_POINTS = [
  'Analyse micro-zone sur les secteurs 20000, 20090 et 20167.',
  'Lecture terrain pour valider les cas atypiques et biens premium.',
  'Retour clair, sans jargon, avec stratégie de prix actionnable.',
]

const EXPERT_METRICS: ExpertMetric[] = [
  { value: '25 ans', label: "D'expérience locale" },
  { value: '147+', label: 'Dossiers accompagnés' },
  { value: '< 24h', label: 'Délai de rappel moyen' },
]

export default function ExpertSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.22 })

  return (
    <section className="relative overflow-hidden bg-[#08162A] py-24 lg:py-28">
      <div
        className="premium-beam premium-beam--blue left-[-14%] top-[-18%] z-0 h-[290px] w-[290px]"
        aria-hidden="true"
      />
      <div
        className="premium-beam premium-beam--gold right-[-8%] bottom-[-16%] z-0 h-[300px] w-[300px]"
        aria-hidden="true"
      />

      <div
        ref={ref}
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:px-12"
      >
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative overflow-hidden rounded-[2rem] border border-white/14 shadow-[0_34px_75px_-42px_rgba(1,7,22,0.95)]"
        >
          <div className="relative aspect-[4/5]">
            <Image
              src="/expert-ajaccio.png"
              alt="Expert immobilier local a Ajaccio"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
              className="bg-white/95"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#071628]/40 via-transparent to-transparent"
              aria-hidden="true"
            />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/26 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                <ShieldCheck size={12} className="text-[#C9A96E]" />
                Mandataire Safti
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/26 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                <Award size={12} className="text-[#C9A96E]" />
                Ajaccio Tous Secteurs
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <p className="text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-[#C9A96E]">
                Accompagnement premium
              </p>
              <p
                className="mt-2 text-3xl font-bold leading-[1.02] tracking-[-0.03em] text-white"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Validation humaine
                <br />
                en complément du moteur DVF
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                Une double lecture data + terrain pour sécuriser votre prix de mise en vente.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex rounded-full border border-white/16 bg-white/[0.04] px-4 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-white/68"
          >
            Expert local
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.03em] text-white lg:text-5xl"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Un regard terrain
            <br />
            <span className="text-[#C9A96E]">pour fiabiliser la décision</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
            Notre estimateur automatise vous donne une borne de prix immediate. Si besoin, un expert
            local ajuste les variables sensibles pour renforcer la precision avant publication.
          </motion.p>

          <motion.ul variants={staggerContainer} className="mt-7 space-y-2.5">
            {EXPERT_POINTS.map((point) => (
              <motion.li
                key={point}
                variants={fadeUp}
                className="flex items-start gap-2.5 text-sm text-white/82"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#C9A96E]" />
                <span>{point}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            variants={fadeUp}
            className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {EXPERT_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="premium-dark-glass rounded-2xl border border-white/12 px-4 py-4 text-center"
              >
                <p
                  className="text-[1.7rem] font-bold leading-none tracking-[-0.03em] text-white"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {metric.value}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-white/52">
                  {metric.label}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/estimer"
              className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-[#C9A96E] px-7 py-3 text-sm font-semibold text-white no-underline transition-all duration-200 hover:bg-[#B8985E] hover:shadow-[0_16px_32px_-20px_rgba(201,169,110,0.85)]"
            >
              Estimer mon bien
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-4 flex items-center gap-2 text-xs text-white/52">
            <Clock3 size={13} className="text-[#C9A96E]" />
            Disponibilité de rappel sous 24h ouvrables.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
