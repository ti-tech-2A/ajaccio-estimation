'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FOOTER_NAV = [
  {
    title: 'Estimation',
    links: [
      { label: 'Estimer mon bien', href: '/estimer' },
      { label: 'Simulateur fiscal', href: '/simulateur-fiscal' },
    ],
  },
  {
    title: 'Marche local',
    links: [
      { label: 'Panorama Ajaccio', href: '/marche' },
      { label: 'Ajaccio 20000', href: '/marche/20000' },
      { label: 'Ajaccio 20090', href: '/marche/20090' },
      { label: 'Mezzavia 20167', href: '/marche/20167' },
    ],
  },
  {
    title: 'Informations',
    links: [
      { label: 'Expert local', href: '/expert' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Ajaccio', href: '/ajaccio' },
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!EMAIL_REGEX.test(email)) {
      setError(true)
      return
    }
    setError(false)
    setSubmitted(true)
  }

  return (
    <footer className="relative overflow-hidden bg-[#071628] text-white">
      <div className="premium-beam premium-beam--blue left-[-10%] bottom-[-12%] z-0 h-[280px] w-[280px]" aria-hidden="true" />
      <div className="premium-beam premium-beam--gold right-[-6%] top-[2%] z-0 h-[260px] w-[260px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-14 lg:px-12 lg:pt-16">
        <div className="grid grid-cols-1 gap-10 border-b border-white/12 pb-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 no-underline"
              aria-label="Accueil ajaccio-estimation.fr"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4813A] shadow-[0_10px_22px_-12px_rgba(196,129,58,0.85)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 12l8-8 8 8"
                    stroke="white"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 10v8h8v-8"
                    stroke="white"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-white/55">
                  estimation immobiliere
                </span>
                <span
                  className="block text-[1.15rem] font-extrabold tracking-tight text-white"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  AJACCIO<span className="text-[#C4813A]">ESTIMATION</span>
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/68">
              Estimation immobiliere gratuite a Ajaccio, basee sur les ventes reelles DVF et la
              connaissance terrain d un mandataire Safti.
            </p>

            <div className="mt-6 rounded-2xl border border-white/14 bg-white/[0.04] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C4813A]">
                Recevoir les analyses DVF
              </p>
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="newsletter-form"
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value)
                          setError(false)
                        }}
                        placeholder="votre@email.fr"
                        className="min-h-11 flex-1 rounded-xl border border-white/20 bg-[#071628] px-4 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[#C4813A]/60"
                      />
                      <button
                        type="submit"
                        className="min-h-11 rounded-xl bg-[#C4813A] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#A86D2E]"
                      >
                        S inscrire
                      </button>
                    </div>
                    {error && (
                      <p className="mt-2 text-xs text-red-300">
                        Merci d entrer une adresse email valide.
                      </p>
                    )}
                  </motion.form>
                ) : (
                  <motion.p
                    key="newsletter-success"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-emerald-300"
                  >
                    Inscription confirmee. Vous recevrez nos prochaines analyses locales.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {FOOTER_NAV.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C4813A]">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 no-underline transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-white/12 py-5 text-xs text-white/52 md:flex-row md:items-center md:justify-between">
          <p>
            Sources: Donnees DVF Etalab, INSEE, perimetre Ajaccio 20000 / 20090 / 20167 (Mezzavia
            uniquement).
          </p>
          <Link
            href="/faq"
            className="text-white/72 no-underline transition-colors duration-200 hover:text-white"
          >
            Details methodologiques
          </Link>
        </div>

        <div className="flex flex-col gap-3 pt-5 text-xs text-white/46 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ajaccio-estimation.fr · Tous droits reserves</p>
          <div className="flex items-center gap-4">
            <Link
              href="/mentions-legales"
              className="text-white/55 no-underline transition-colors duration-200 hover:text-white"
            >
              Mentions legales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="text-white/55 no-underline transition-colors duration-200 hover:text-white"
            >
              Politique de confidentialite
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
