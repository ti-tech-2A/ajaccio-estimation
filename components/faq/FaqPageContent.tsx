'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Plus, TrendingUp, Calculator, Database, MapPin } from 'lucide-react'
import { staggerContainer, fadeUp } from '@/lib/motion'

// ── Types ─────────────────────────────────────────────────────────────────────
interface FaqItem {
  id: string
  question: string
  answer: React.ReactNode
}

interface FaqCategory {
  id: string
  label: string
  icon: React.ReactNode
  items: FaqItem[]
}

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'prix',
    label: 'Prix',
    icon: <TrendingUp size={18} />,
    items: [
      {
        id: 'prix-m2-2026',
        question: 'Quel est le prix au m² à Ajaccio en 2026 ?',
        answer: (
          <>
            Le prix médian au m² à Ajaccio est de <strong>3 400 €</strong> pour un appartement
            dans le secteur 20000 (centre-ville), <strong>3 100 €</strong> dans le 20090 (secteur
            sud) et <strong>2 900 €</strong> à Mezzavia (20167). Pour les villas, les prix varient
            de 3 500 à 4 200 €/m² selon la vue et les prestations. Ces données sont issues de la
            base{' '}
            <a
              href="https://app.dvf.etalab.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2E86AB] hover:underline"
              title="Accéder aux données DVF officielles"
            >
              DVF officielle
            </a>
            , actualisées au{' '}
            <time dateTime="2026-05-01">1er mai 2026</time>.
          </>
        ),
      },
      {
        id: 'variation-quartiers',
        question: 'Les prix varient-ils vraiment autant selon les quartiers ?',
        answer: (
          <>
            Oui — à Ajaccio, l&apos;écart entre un appartement route des Sanguinaires et un bien
            standard en périphérie peut dépasser 40 %. La route des Sanguinaires, le quartier des
            Étrangers et Trottel affichent des primes de localisation significatives. Notre moteur
            intègre ces micro-zones pour éviter les estimations moyennées trop imprécises.
          </>
        ),
      },
      {
        id: 'evolution-marche',
        question: 'Comment évolue le marché immobilier ajaccien ?',
        answer: (
          <>
            Sur les 12 derniers mois, les prix ont progressé de <strong>+3,2 %</strong> dans le
            20000, <strong>+1,8 %</strong> dans le 20090 et <strong>+0,9 %</strong> à Mezzavia. Le
            marché ajaccien affiche une relative stabilité comparé aux métropoles continentales,
            soutenu par une demande locale constante et un attrait touristique résidentiel
            persistant.
          </>
        ),
      },
    ],
  },
  {
    id: 'estimation',
    label: 'Estimation',
    icon: <Calculator size={18} />,
    items: [
      {
        id: 'calcul-estimation',
        question: "Comment est calculée l'estimation ?",
        answer: (
          <>
            Notre moteur analyse les transactions DVF (base notariale officielle) des 24 derniers
            mois dans votre secteur exact. Après nettoyage des valeurs aberrantes (suppression des
            25 % extrêmes), nous calculons la médiane des 50 % centraux. Des coefficients ajustent
            le prix selon l&apos;étage, l&apos;état, la vue et les prestations, avec un plafond
            cumulatif de ±40 %. La fourchette finale intègre une marge de ±10 %.
          </>
        ),
      },
      {
        id: 'gratuit-sans-engagement',
        question: "L'estimation est-elle vraiment gratuite et sans engagement ?",
        answer: (
          <>
            Oui, totalement. Vous obtenez une fourchette de prix immédiatement, sans créer de
            compte, sans donner votre numéro de téléphone au préalable. Si vous souhaitez une
            validation terrain, vous choisissez librement de contacter l&apos;expert ou non.
          </>
        ),
      },
      {
        id: 'precision-estimation',
        question: "Quelle est la précision de l'estimation automatique ?",
        answer: (
          <>
            Avec 10 transactions comparables ou plus, l&apos;écart moyen constaté est de{' '}
            <strong>±8 %</strong> par rapport au prix de vente final. Entre 5 et 9 comparables, la
            précision est estimée à <strong>±12 %</strong>. En dessous de 5 comparables,
            l&apos;estimation reste indicative et nous recommandons une expertise terrain.
            L&apos;indicateur de fiabilité (points verts) vous informe en temps réel.
          </>
        ),
      },
    ],
  },
  {
    id: 'dvf',
    label: 'Données DVF',
    icon: <Database size={18} />,
    items: [
      {
        id: 'difference-meilleurs-agents',
        question: 'Quelle différence avec MeilleursAgents ou SeLoger ?',
        answer: (
          <>
            Ces plateformes utilisent des modèles nationaux calibrés sur de grands volumes. Elles
            ne distinguent pas Mezzavia d&apos;Alata, ni la route des Sanguinaires d&apos;un
            immeuble standard du 20090. Notre outil est calibré exclusivement sur les 3 codes
            postaux d&apos;Ajaccio, avec les données DVF locales et une pondération par secteur.
          </>
        ),
      },
      {
        id: 'frequence-maj-dvf',
        question: 'À quelle fréquence les données DVF sont-elles mises à jour ?',
        answer: (
          <>
            Les données DVF sont publiées deux fois par an par Étalab — début mai et début
            novembre. Notre base est synchronisée à chaque publication. La date de dernière mise
            à jour est affichée sur chaque page de marché. Prochaine mise à jour :{' '}
            <strong>novembre 2026</strong>.
          </>
        ),
      },
      {
        id: 'fiabilite-dvf',
        question: 'Les données DVF sont-elles fiables ?',
        answer: (
          <>
            La base DVF (Demandes de Valeurs Foncières) est produite par la Direction Générale des
            Finances Publiques à partir des actes notariés. Elle constitue la référence officielle
            des transactions immobilières en France. Les données sont exhaustives pour les ventes
            enregistrées chez un notaire — soit l&apos;immense majorité des transactions. Source :{' '}
            <a
              href="https://app.dvf.etalab.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2E86AB] hover:underline"
              title="Accéder aux données DVF officielles"
            >
              données DVF officielles
            </a>
            .
          </>
        ),
      },
    ],
  },
  {
    id: 'geo-fiscalite',
    label: 'Géographie & Fiscalité',
    icon: <MapPin size={18} />,
    items: [
      {
        id: 'cp-20167',
        question:
          'Quelle différence entre Mezzavia (Ajaccio) et Alata sur le code postal 20167 ?',
        answer: (
          <>
            Le CP 20167 couvre deux communes distinctes : <strong>Mezzavia</strong>, quartier de
            la commune d&apos;Ajaccio (INSEE 2A004), inclus dans notre périmètre ; et{' '}
            <strong>Alata</strong>, commune indépendante avec un code INSEE différent, exclue. Nos
            filtres Supabase vérifient systématiquement le code commune INSEE pour éviter toute
            confusion. Si votre bien est à Alata, il ne peut pas être estimé via ce site.{' '}
            <Link href="/marche/20167" className="text-[#2E86AB] hover:underline">
              Voir les données 20167 →
            </Link>
          </>
        ),
      },
      {
        id: 'porticcio-bastelicaccia',
        question: 'Pourquoi Porticcio et Bastelicaccia ne sont-ils pas couverts ?',
        answer: (
          <>
            Notre périmètre actuel se limite à la commune d&apos;Ajaccio (codes postaux 20000,
            20090, 20167 Mezzavia). Porticcio (Grosseto-Prugna) et Bastelicaccia sont des communes
            indépendantes avec des dynamiques de marché différentes. Leur couverture est prévue sur
            des sites dédiés.
          </>
        ),
      },
      {
        id: 'taxe-fonciere',
        question: 'Comment fonctionne la taxe foncière à Ajaccio ?',
        answer: (
          <>
            La taxe foncière est calculée en appliquant le taux communal d&apos;Ajaccio (50,34 %
            en 2025) à la valeur locative cadastrale (VLC) de votre bien. La VLC est fixée par les
            services fiscaux et ne correspond pas à la valeur de marché. Utilisez notre{' '}
            <Link href="/simulateur-fiscal" className="text-[#2E86AB] hover:underline">
              simulateur fiscal
            </Link>{' '}
            pour estimer votre taxe foncière à partir de votre VLC.
          </>
        ),
      },
    ],
  },
]

// Flat list for open-index tracking
const ALL_ITEMS: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items)

// ── Component ─────────────────────────────────────────────────────────────────
export default function FaqPageContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const idx = ALL_ITEMS.findIndex((item) => item.id === hash)
    if (idx !== -1) {
      setOpenIndex(idx)
      // Delay scroll to allow DOM to render
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 200)
    }
  }, [])

  let globalIndex = 0

  return (
    <main className="max-w-3xl mx-auto px-4 pt-32 pb-16">
      {/* Header */}
      <div ref={headerRef}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="mb-14 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-4xl text-[#1B4F72] mb-4"
          >
            Questions fréquentes
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="font-[family-name:var(--font-open-sans)] text-[#5C5C5C] text-base max-w-xl mx-auto"
          >
            Tout ce que vous devez savoir sur l&apos;estimation immobilière à Ajaccio, la méthode
            DVF, les zones couvertes et la fiscalité.
          </motion.p>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="space-y-12">
        {FAQ_CATEGORIES.map((category) => (
          <section key={category.id}>
            {/* Category header */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-8 h-8 rounded-lg bg-[#D6EEF5] text-[#1B4F72] flex items-center justify-center shrink-0">
                {category.icon}
              </span>
              <h2 className="font-[family-name:var(--font-poppins)] font-semibold text-lg text-[#1B4F72]">
                {category.label}
              </h2>
            </div>

            {/* Items */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
              {category.items.map((item) => {
                const itemIndex = globalIndex++
                const isOpen = openIndex === itemIndex

                return (
                  <div key={item.id} id={item.id} className="bg-white scroll-mt-24">
                    <button
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#FAF5EC] transition-colors"
                      onClick={() => setOpenIndex(isOpen ? null : itemIndex)}
                      aria-expanded={isOpen}
                    >
                      <span className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-base pr-4">
                        {item.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-[#2E86AB]"
                      >
                        <Plus size={18} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p className="font-[family-name:var(--font-open-sans)] text-sm text-[#5C5C5C] leading-relaxed px-6 pb-6">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-16 text-center">
        <p className="font-[family-name:var(--font-open-sans)] text-sm text-[#9B9B9B] mb-2">
          Vous avez une autre question ?
        </p>
        <Link href="/expert" className="text-[#2E86AB] hover:underline text-sm font-medium">
          Contacter l&apos;expert directement →
        </Link>
      </div>
    </main>
  )
}
