import React from 'react'
import { TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Factor, ImpactLevel } from '@/data/sector-content/types'

type Tone = 'positive' | 'negative'

interface FactorsGridProps {
  title: string
  description: string
  factors: Factor[]
  tone: Tone
}

const IMPACT_LABEL: Record<ImpactLevel, string> = {
  fort: 'Impact fort',
  moyen: 'Impact moyen',
  faible: 'Impact modéré',
}

const POSITIVE_TONE = {
  iconBg: 'bg-[#27AE60]/15',
  iconColor: 'text-[#1e8449]',
  accentColor: '#27AE60',
  Icon: TrendingUp,
  CardIcon: CheckCircle2,
  cardIconColor: 'text-[#1e8449]',
}

const NEGATIVE_TONE = {
  iconBg: 'bg-[#C0392B]/15',
  iconColor: 'text-[#C0392B]',
  accentColor: '#C0392B',
  Icon: TrendingDown,
  CardIcon: AlertCircle,
  cardIconColor: 'text-[#C0392B]',
}

const IMPACT_BAR: Record<ImpactLevel, number> = {
  fort: 100,
  moyen: 65,
  faible: 35,
}

export function FactorsGrid({ title, description, factors, tone }: FactorsGridProps) {
  const T = tone === 'positive' ? POSITIVE_TONE : NEGATIVE_TONE
  const titleId = `factors-${tone}-title`

  return (
    <section
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      aria-labelledby={titleId}
    >
      <div className="flex items-start gap-3 mb-5">
        <div className={`rounded-xl ${T.iconBg} p-2 shrink-0`} aria-hidden="true">
          <T.Icon size={18} className={T.iconColor} />
        </div>
        <div>
          <h2
            id={titleId}
            className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72]"
          >
            {title}
          </h2>
          <p className="text-sm text-[#9B9B9B] mt-1">{description}</p>
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {factors.map((f) => (
          <li
            key={f.label}
            className="rounded-xl border border-gray-100 bg-[#FAF5EC] p-4 flex gap-3"
          >
            <T.CardIcon
              size={18}
              className={`${T.cardIconColor} shrink-0 mt-0.5`}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <p className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-sm leading-tight">
                  {f.label}
                </p>
                <span
                  className="text-[10px] uppercase tracking-wide font-semibold whitespace-nowrap"
                  style={{ color: T.accentColor }}
                >
                  {IMPACT_LABEL[f.impact]}
                </span>
              </div>

              {/* Impact bar */}
              <div
                className="h-1 rounded-full bg-gray-200 overflow-hidden mb-2"
                role="presentation"
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${IMPACT_BAR[f.impact]}%`,
                    backgroundColor: T.accentColor,
                  }}
                />
              </div>

              <p className="text-xs text-[#5C5C5C] leading-relaxed">{f.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
