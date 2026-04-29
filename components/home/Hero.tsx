'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Building2, Home, Map } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

export default function Hero() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()

  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1)
  const loopCountRef = useRef(0)

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const currentVideo = e.currentTarget
    if (!currentVideo.duration) return

    // Déclenche le fondu en croix 0.6s avant la fin pour masque le saut
    if (loopCountRef.current < 2 && currentVideo.currentTime >= currentVideo.duration - 0.6) {
      if (activeVideo === 1) {
        if (video2Ref.current && video2Ref.current.paused) {
          video2Ref.current.currentTime = 0
          video2Ref.current.play()
          setActiveVideo(2)
          loopCountRef.current += 1
        }
      } else {
        if (video1Ref.current && video1Ref.current.paused) {
          video1Ref.current.currentTime = 0
          video1Ref.current.play()
          setActiveVideo(1)
          loopCountRef.current += 1
        }
      }
    }
  }

  const handleVideoEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    // Fige sur la 1ere image à la fin du dernier cycle
    if (loopCountRef.current >= 2) {
      e.currentTarget.currentTime = 0
    }
  }


  return (
    <>
    <section
      id="accueil"
      className="relative overflow-hidden bg-[#FAF5EC] pb-20 pt-32 md:pt-36 lg:pb-28"
    >
      {/* Subtle radial gradient top-right */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_75%_10%,rgba(46,134,171,0.10),transparent_55%)]"
        aria-hidden="true"
      />
      {/* Subtle blob bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-16 -left-20 z-0 h-72 w-72 rounded-full bg-[#C9A96E]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">

        {/* ── LEFT COLUMN ── */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {/* Badge */}
          <span className="inline-flex items-center rounded-full bg-[#1B4F72] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            Estimation en 3 minutes
          </span>

          {/* H1 */}
          <h1
            className="mt-4 text-[clamp(1.55rem,3.2vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#1B4F72]"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Estimez gratuitement
            <br />
            votre bien sur <span className="text-[#C9A96E]">Ajaccio</span>
          </h1>

          {/* Sous-titre */}
          <p className="mt-3 max-w-xl text-[0.88rem] leading-relaxed text-[#5C5C5C]">
            Sélectionnez votre type de bien pour obtenir votre estimation gratuite
            instantanément basée sur les données actuelles du marché. Bénéficiez
            des conseils avisés d&apos;un professionnel de l&apos;immobilier pour guider vos
            décisions en matière de bien.
          </p>

          {/* Card formulaire */}
          <div
            className="mt-5 max-w-lg rounded-2xl border border-[#1B4F72]/12 bg-white p-6 shadow-[0_24px_48px_-28px_rgba(27,79,114,0.22)]"
          >
            <h2 className="mb-4 text-sm font-semibold text-[#1B4F72]">
              Quel type de bien souhaitez-vous estimer ?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'appartement', label: 'Appartement', Icon: Building2 },
                { value: 'villa', label: 'Villa', Icon: Home },
                { value: 'terrain', label: 'Terrain', Icon: Map },
              ].map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => router.push(`/estimer?type=${value}`)}
                  className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-[#1B4F72]/10 bg-white py-4 transition-all hover:border-[#2E86AB] hover:bg-[#D6EEF5] hover:shadow-sm"
                >
                  <Icon size={28} className="text-[#9B9B9B] transition-colors group-hover:text-[#2E86AB]" />
                  <span className="text-xs font-semibold text-[#5C5C5C] md:text-sm group-hover:text-[#1B4F72]">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN — Image ── */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-[580px]"
        >
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_32px_64px_-36px_rgba(27,79,114,0.35)] h-[380px] md:h-[450px] w-full bg-[#1B4F72]">
            <video
              ref={video1Ref}
              src="/video/ajaccio_video_2.mp4"
              autoPlay={!reduceMotion}
              muted
              playsInline
              aria-hidden="true"
              onEnded={handleVideoEnded}
              onTimeUpdate={!reduceMotion ? handleTimeUpdate : undefined}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${activeVideo === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            />
            {!reduceMotion && (
              <video
                ref={video2Ref}
                src="/video/ajaccio_video_2.mp4"
                muted
                playsInline
                aria-hidden="true"
                onEnded={handleVideoEnded}
                onTimeUpdate={handleTimeUpdate}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${activeVideo === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              />
            )}
          </div>

          {/* Badge flottant bas-gauche */}
          <div className="absolute -bottom-4 -left-4 z-20 rounded-xl border border-[#1B4F72]/10 bg-white/90 px-4 py-2.5 text-sm font-medium text-[#1B4F72] shadow-[0_16px_32px_-20px_rgba(27,79,114,0.30)] backdrop-blur-sm">
            <span aria-hidden="true">📊</span>{' '}Données DVF + expertise locale Ajaccio
          </div>
        </motion.div>

      </div>
    </section>

    {/* ── CHIFFRES CLÉS ── */}
    <section
      id="chiffres-cles"
      className="relative overflow-hidden bg-gradient-to-b from-[#EEE7DA] to-[#FAF5EC] py-16"
      aria-label="Chiffres clés et avantages"
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#2E86AB]/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

          {/* Carte 1 — Volume */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0 }}
            className="group relative flex flex-col gap-5 rounded-2xl border border-[#1B4F72]/10 bg-white/85 px-7 py-8 shadow-[0_8px_32px_-12px_rgba(27,79,114,0.14)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_rgba(27,79,114,0.22)]"
          >
            {/* Accent top bar */}
            <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#C9A96E] to-[#E8C98A]" />

            {/* Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A96E]/12">
              <svg className="h-5 w-5 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>

            {/* Stat number */}
            <div>
              <p
                className="text-[2.8rem] font-bold leading-none tracking-tight text-[#C9A96E]"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                40+
              </p>
              <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#1B4F72]/50">
                estimations par mois à Ajaccio
              </p>
            </div>

            {/* Description */}
            <p className="text-[0.84rem] leading-relaxed text-[#5C5C5C]">
              En moyenne, 40 propriétaires et futurs acquéreurs nous font confiance chaque mois pour estimer leur bien ou valider leur futur achat.
            </p>
          </motion.div>

          {/* Carte 2 — IA Corse */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
            className="group relative flex flex-col gap-5 rounded-2xl border border-[#1B4F72]/10 bg-white/85 px-7 py-8 shadow-[0_8px_32px_-12px_rgba(27,79,114,0.14)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_rgba(27,79,114,0.22)]"
          >
            <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#2E86AB] to-[#5BAED0]" />

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2E86AB]/10">
              <svg className="h-5 w-5 text-[#2E86AB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            </div>

            <div>
              <p
                className="text-[1.85rem] font-bold leading-tight tracking-tight text-[#1B4F72]"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                IA spécialisée<br />marché corse
              </p>
              <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#1B4F72]/50">
                Précision & expertise locale
              </p>
            </div>

            <p className="text-[0.84rem] leading-relaxed text-[#5C5C5C]">
              Nos algorithmes intègrent les spécificités du marché insulaire pour une estimation au plus juste de la réalité corse.
            </p>
          </motion.div>

          {/* Carte 3 — Gratuit */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
            className="group relative flex flex-col gap-5 rounded-2xl border border-[#1B4F72]/10 bg-white/85 px-7 py-8 shadow-[0_8px_32px_-12px_rgba(27,79,114,0.14)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_rgba(27,79,114,0.22)]"
          >
            <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#1B4F72] to-[#2E86AB]" />

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A96E]/12">
              <svg className="h-5 w-5 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>

            <div>
              <p
                className="text-[2.8rem] font-bold leading-none tracking-tight text-[#C9A96E]"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Gratuit
              </p>
              <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#1B4F72]/50">
                100% en ligne · sans engagement
              </p>
            </div>

            <p className="text-[0.84rem] leading-relaxed text-[#5C5C5C]">
              Résultat instantané, sans inscription ni engagement. Votre estimation en 3 minutes chrono.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
    </>
  )
}
