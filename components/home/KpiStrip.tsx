'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { fadeUp, staggerContainer } from '@/lib/motion'
import type { HomeKpiMetric } from '@/lib/server/market-signal'

interface KpiStripProps {
  metrics: HomeKpiMetric[]
  sourceLabel: string
}

function KpiItem({ end, suffix, label, sublabel, decimals = 0, hint }: HomeKpiMetric) {
  const { ref, displayValue } = useCountUp({ end, suffix, decimals })

  return (
    <div className="premium-dark-glass rounded-2xl p-5 shadow-[0_24px_50px_-36px_rgba(3,8,22,0.95)]">
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className="block whitespace-nowrap text-[clamp(1.55rem,2.6vw,2.4rem)] font-extrabold leading-none text-white"
        style={{ fontFamily: 'var(--font-cormorant)', letterSpacing: '-0.03em' }}
      >
        {displayValue}
      </span>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/55">
          {label}
        </span>
        {hint ? (
          <span
            className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/25 text-[0.58rem] font-semibold text-white/65"
            title={hint}
            aria-label={hint}
          >
            i
          </span>
        ) : null}
      </div>
      <span className="mt-1 block text-xs font-medium text-[#C9A96E]">{sublabel}</span>
    </div>
  )
}

export default function KpiStrip({ metrics, sourceLabel }: KpiStripProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.18 })

  return (
    <section className="relative overflow-hidden bg-[#08162A] py-24">
      <div className="premium-beam premium-beam--blue left-[-10%] top-[-10%] z-0 h-[260px] w-[260px]" aria-hidden="true" />
      <div className="premium-beam premium-beam--gold right-[-8%] bottom-[-18%] z-0 h-[280px] w-[280px]" aria-hidden="true" />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-14 lg:px-12"
      >
        <motion.div variants={fadeUp} className="self-center">
          <span className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-4 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-white/65">
            Signal marché local
          </span>
          <h2
            className="mt-5 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white lg:text-4xl"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Notre moteur IA
            <br />
            <span className="text-[#C9A96E]">ultra-locale et actionnable</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/68">
            Notre moteur croise les ventes notariales DVF, les caractéristiques du bien et la
            granularité micro-secteur pour obtenir une valeur juste, défendable et exploitable.
          </p>
          <p className="mt-4 text-xs text-white/55">{sourceLabel}</p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((kpi) => (
            <KpiItem key={kpi.label} {...kpi} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
