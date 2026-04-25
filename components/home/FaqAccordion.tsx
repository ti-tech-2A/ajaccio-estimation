'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'

interface FaqItem {
  q: string
  a: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Comment est calculée l'estimation ?",
    a: "Notre moteur analyse les transactions DVF (base notariale officielle) des 24 derniers mois dans votre secteur exact. Après nettoyage des valeurs aberrantes, nous calculons la médiane et appliquons des coefficients selon l'étage, l'état, la vue et les prestations. La fourchette finale intègre une marge de ±10 %.",
  },
  {
    q: "L'estimation est-elle vraiment gratuite et sans engagement ?",
    a: "Oui, totalement. Vous obtenez une fourchette de prix immédiatement, sans créer de compte, sans donner votre numéro de téléphone au préalable. Si vous souhaitez une validation terrain, vous choisissez librement de contacter l'expert ou non.",
  },
  {
    q: "Quelle différence avec MeilleursAgents ou SeLoger ?",
    a: "Ces plateformes utilisent des modèles nationaux calibrés sur de grands volumes. Elles ne distinguent pas Mezzavia d'Alata, ni la route des Sanguinaires d'un immeuble standard. Notre outil est calibré exclusivement sur les 3 codes postaux d'Ajaccio, avec les données DVF locales.",
  },
  {
    q: "Quelle est la précision de l'estimation automatique ?",
    a: "Avec 10 transactions comparables ou plus, l'écart moyen constaté est de ±8 % par rapport au prix de vente final. En dessous de 5 comparables, l'estimation reste indicative et nous recommandons une expertise terrain. L'indicateur de fiabilité vous informe en temps réel.",
  },
  {
    q: "Quelle différence entre Mezzavia (Ajaccio) et Alata sur le code postal 20167 ?",
    a: "Le CP 20167 couvre deux communes distinctes : Mezzavia, quartier d'Ajaccio (INSEE 2A004), inclus dans notre périmètre ; et Alata, commune indépendante, exclue. Nos filtres discriminent systématiquement les deux en vérifiant le code commune INSEE.",
  },
  {
    q: "À quelle fréquence les données DVF sont-elles mises à jour ?",
    a: "Les données DVF sont publiées deux fois par an par Étalab — début mai et début novembre. Notre base est synchronisée à chaque publication. La date de dernière mise à jour est affichée en bas de chaque page de marché.",
  },
]

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Asymmetric header */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 mb-14">
          <div>
            <p className="text-[#C9A96E] text-sm tracking-[0.15em] uppercase font-semibold mb-3">
              FAQ
            </p>
            <h2
              style={{ fontFamily: 'var(--font-poppins)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#0F2A4A', lineHeight: '1.15' }}
            >
              Questions
              <br />
              fréquentes
            </h2>
            <div className="mt-6 w-12 h-0.5 bg-[#C9A96E]" />
          </div>
          <p className="text-[#4A5568] font-[family-name:var(--font-dm-sans)] leading-relaxed self-end md:max-w-prose">
            Tout ce qu&apos;il faut savoir sur notre méthode d&apos;estimation, la fiabilité des données DVF et le périmètre géographique couvert.
          </p>
        </div>

        {/* Accordion */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="max-w-3xl"
        >
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } }}
                className="border-b border-[#EDE8DE] last:border-0"
              >
                <button
                  className="flex justify-between items-center py-5 w-full text-left cursor-pointer group"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className="font-medium text-[#0F2A4A] pr-6 group-hover:text-[#C9A96E] transition-colors duration-200"
                    style={{ fontSize: '15px' }}
                  >
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-6 h-6 rounded-full border border-[#C9A96E] flex items-center justify-center"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1v8M1 5h8" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        className="font-[family-name:var(--font-dm-sans)] text-[#4A5568] leading-relaxed pb-5"
                        style={{ fontSize: '14px' }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Footer link */}
        <p className="mt-10 text-sm font-[family-name:var(--font-dm-sans)] text-[#8896A5]">
          D&apos;autres questions ?{' '}
          <Link
            href="/faq"
            className="text-[#0F2A4A] font-medium underline underline-offset-4 decoration-[#C9A96E]/50 hover:decoration-[#C9A96E] transition-all"
          >
            Consultez la FAQ complète →
          </Link>
        </p>
      </div>
    </section>
  )
}
