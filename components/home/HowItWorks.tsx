'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BarChart3, ClipboardList, UserCheck, type LucideIcon } from 'lucide-react'
import { fadeUp, scaleIn, staggerContainer } from '@/lib/motion'

interface StepData {
  icon: LucideIcon
  title: string
  text: string
}

const STEPS: StepData[] = [
  {
    icon: ClipboardList,
    title: 'Décrivez le bien',
    text: 'Type, surface, localisation et prestations en moins de deux minutes.',
  },
  {
    icon: BarChart3,
    title: 'Recevez la fourchette',
    text: 'Une valeur dérivée des ventes DVF récentes sur votre secteur précis.',
  },
  {
    icon: UserCheck,
    title: "Affinez avec l'expert",
    text: 'Un avis terrain local pour verrouiller votre stratégie de mise en vente.',
  },
]

function StepCard({
  step,
  index,
  isVisible,
}: {
  step: StepData
  index: number
  isVisible: boolean
}) {
  const Icon = step.icon

  return (
    <motion.div
      variants={scaleIn}
      className="premium-dark-glass relative rounded-3xl border border-white/12 p-6 text-white md:p-7"
    >
      <span
        className="absolute right-5 top-4 text-5xl font-bold text-white/8"
        style={{ fontFamily: 'var(--font-cormorant)' }}
        aria-hidden="true"
      >
        0{index + 1}
      </span>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A96E]/22 text-[#C9A96E]">
        <Icon size={20} aria-hidden="true" />
      </span>
      <h3
        className="mt-4 text-2xl font-bold leading-tight tracking-[-0.02em]"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        {step.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{step.text}</p>

      {index < STEPS.length - 1 && (
        <span
          className={[
            'absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-[#08162A] p-1.5 text-white/65 lg:inline-flex',
            isVisible ? 'opacity-100' : 'opacity-20',
          ].join(' ')}
          aria-hidden="true"
        >
          <ArrowRight size={14} />
        </span>
      )}
    </motion.div>
  )
}

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section className="relative overflow-hidden bg-[#08162A] py-24 lg:py-28">
      <div className="premium-beam premium-beam--blue left-[12%] top-[-16%] z-0 h-[220px] w-[220px]" aria-hidden="true" />
      <div className="premium-beam premium-beam--gold right-[-8%] bottom-[-12%] z-0 h-[260px] w-[260px]" aria-hidden="true" />

      <div ref={sectionRef} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-white/14 bg-white/[0.04] px-4 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-white/68">
            Méthodologie
          </span>
          <h2
            className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.03em] text-white lg:text-5xl"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Une expérience simple,
            <br />
            un rendu premium
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/66">
            Chaque étape réduit l&apos;incertitude et augmente la précision, jusqu&apos;à une fourchette
            actionnable pour votre projet immobilier à Ajaccio.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
          {STEPS.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} isVisible={inView} />
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/estimer"
            className="inline-flex min-h-12 items-center rounded-[8px] bg-[#C9A96E] px-8 py-3 text-sm font-semibold text-white no-underline transition-all duration-200 hover:bg-[#B8985E] hover:shadow-[0_16px_34px_-20px_rgba(201,169,110,0.85)]"
          >
            Commencer mon estimation
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
