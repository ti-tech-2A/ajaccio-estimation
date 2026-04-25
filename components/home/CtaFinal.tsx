'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion'

const BENEFITS = [
  {
    title: 'Conseils personnalisés gratuits',
    text: 'Un mandataire local Ajaccio analyse votre bien et vous guide pour vendre, louer ou estimer au meilleur prix — sans engagement.',
  },
  {
    title: 'Expertise du marché corse',
    text: "Calibrée sur les 3 codes postaux d'Ajaccio (20000 · 20090 · 20167), notre approche distingue les micro-zones que les outils nationaux ignorent.",
  },
  {
    title: 'Gratuit et sans démarchage',
    text: 'La consultation est offerte. Aucun appel non sollicité : vous restez maître de votre décision, à votre rythme.',
  },
]

export default function CtaFinal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const router = useRouter()
  const [address, setAddress] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = address.trim() ? `?adresse=${encodeURIComponent(address.trim())}` : ''
    router.push(`/expert${params}#contact-form`)
  }

  return (
    <section className="relative overflow-hidden bg-[#F7F2EA] py-20 lg:py-24">
      {/* Subtle top border accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />

      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section header */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center text-3xl font-bold leading-tight tracking-[-0.025em] text-[#08162A] lg:text-4xl"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Bénéficiez gratuitement des conseils
          <br className="hidden sm:block" />
          {' '}d'un mandataire immobilier local
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-12 grid grid-cols-1 gap-8 rounded-[2rem] border border-[#0F2A4A]/10 bg-white p-8 shadow-[0_28px_64px_-32px_rgba(15,42,74,0.18)] md:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14"
        >
          {/* LEFT — address form */}
          <motion.div variants={fadeUp} className="flex flex-col justify-center gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cta-address"
                  className="text-[0.78rem] font-semibold text-[#0F2A4A]"
                >
                  Adresse du bien
                </label>
                <input
                  id="cta-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex : 1 Cours Napoléon, 20000 Ajaccio"
                  className="w-full rounded-[10px] border border-[#0F2A4A]/18 bg-[#F7F2EA] px-4 py-3.5 text-sm text-[#08162A] placeholder:text-[#8A9BB0] outline-none transition-all focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#C9A96E] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#B8985E] hover:shadow-[0_14px_30px_-14px_rgba(201,169,110,0.85)] active:scale-[0.98]"
              >
                Estimer mon bien
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
            </form>

            <p className="text-[0.72rem] leading-relaxed text-[#6B7A8D]">
              <span className="font-semibold text-[#0F2A4A]">Sans inscription.</span> Vos données
              restent privées et ne sont jamais transmises sans votre accord.
            </p>
          </motion.div>

          {/* RIGHT — benefits list */}
          <motion.div variants={fadeUp} className="flex flex-col justify-center gap-7">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C9A96E]/15">
                  <Check size={11} strokeWidth={2.5} className="text-[#C9A96E]" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-snug text-[#08162A]">
                    {benefit.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4A5568]">{benefit.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle bottom border accent */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent" />
    </section>
  )
}
