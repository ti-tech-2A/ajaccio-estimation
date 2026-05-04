import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Calculator, BarChart3 } from 'lucide-react'

type CTAVariant = 'top' | 'middle' | 'bottom'

interface MarketCTAProps {
  variant: CTAVariant
  postalCode: string
  zone?: string
}

const COPY: Record<CTAVariant, {
  eyebrow: string
  title: string
  body: string
  buttonLabel: string
  Icon: typeof Calculator
  bgClass: string
  textColor: string
  bodyColor: string
  buttonClass: string
}> = {
  top: {
    eyebrow: 'Vous possédez un bien ici ?',
    title: 'Estimez votre bien à Ajaccio en 2 minutes',
    body: 'Estimation gratuite basée sur les ventes DVF récentes de votre secteur.',
    buttonLabel: 'Estimer mon bien',
    Icon: Calculator,
    bgClass: 'bg-gradient-to-br from-[#1B4F72] to-[#2E86AB]',
    textColor: 'text-white',
    bodyColor: 'text-white/85',
    buttonClass:
      'bg-white text-[#1B4F72] hover:bg-[#FAF5EC] focus-visible:ring-white',
  },
  middle: {
    eyebrow: 'Aller plus loin',
    title: 'Comparer mon bien aux ventes récentes',
    body: 'Une estimation personnalisée tient compte de l\'adresse, de l\'étage, de l\'état et des extras de votre bien.',
    buttonLabel: 'Demander mon estimation détaillée',
    Icon: BarChart3,
    bgClass: 'bg-[#FAF5EC] border border-[#C9A96E]/30',
    textColor: 'text-[#1B4F72]',
    bodyColor: 'text-[#5C5C5C]',
    buttonClass:
      'bg-[#C9A96E] text-white hover:bg-[#b8975e] focus-visible:ring-[#C9A96E]',
  },
  bottom: {
    eyebrow: 'Et maintenant ?',
    title: 'Recevez une analyse complète de votre bien',
    body: "Estimation DVF + lecture terrain par un expert local Ajaccio. Gratuit, sans engagement.",
    buttonLabel: 'Lancer mon estimation',
    Icon: Sparkles,
    bgClass: 'bg-gradient-to-br from-[#1B4F72] to-[#2E86AB]',
    textColor: 'text-white',
    bodyColor: 'text-white/85',
    buttonClass:
      'bg-[#C9A96E] text-white hover:bg-[#b8975e] focus-visible:ring-[#C9A96E]',
  },
}

const DURATION_BY_CP: Record<string, string> = {
  '20090': '3 minutes',
}

export function MarketCTA({ variant, postalCode, zone }: MarketCTAProps) {
  const c = COPY[variant]
  const href = `/estimer?cp=${postalCode}`
  const title =
    variant === 'top' && DURATION_BY_CP[postalCode]
      ? c.title.replace('2 minutes', DURATION_BY_CP[postalCode])
      : c.title

  return (
    <section
      className={`rounded-2xl ${c.bgClass} px-6 py-7 md:px-8 md:py-8`}
      aria-label="Appel à l'estimation"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex gap-4 items-start md:items-center">
          <div
            className={[
              'rounded-xl p-2.5 shrink-0',
              variant === 'middle' ? 'bg-[#C9A96E]/15' : 'bg-white/15',
            ].join(' ')}
            aria-hidden="true"
          >
            <c.Icon
              size={22}
              className={variant === 'middle' ? 'text-[#C9A96E]' : 'text-white'}
            />
          </div>
          <div className="min-w-0">
            <p
              className={[
                'text-xs uppercase tracking-wide font-semibold mb-1',
                variant === 'middle' ? 'text-[#C9A96E]' : 'text-white/80',
              ].join(' ')}
            >
              {c.eyebrow}
            </p>
            <h2
              className={`font-[family-name:var(--font-poppins)] text-xl md:text-2xl font-bold ${c.textColor}`}
            >
              {title}
              {zone ? <span className="text-base font-normal opacity-80"> — {zone}</span> : null}
            </h2>
            <p
              className={`text-sm mt-1 leading-relaxed font-[family-name:var(--font-open-sans)] ${c.bodyColor}`}
            >
              {c.body}
            </p>
          </div>
        </div>

        <Link
          href={href}
          className={[
            'inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold whitespace-nowrap transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            c.buttonClass,
          ].join(' ')}
          aria-label={`${c.buttonLabel} pour Ajaccio ${postalCode}`}
        >
          {c.buttonLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
