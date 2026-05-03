import React from 'react'
import { TrendingUp, TrendingDown, Minus, Building2, Home, BarChart3, Activity } from 'lucide-react'
import { DataFreshnessBadge } from '@/components/market/DataFreshnessBadge'
import type { MarketAggregates } from '@/lib/server/market-aggregates'
import { DVF_LAST_UPDATE, DVF_LAST_UPDATE_LABEL } from '@/lib/constants'

interface MarketHeroProps {
  postalCode: string
  zoneTitle: string
  introSummary: string
  aggregates: MarketAggregates
}

function formatPriceSqm(value: number): string {
  if (!value) return '—'
  return `${value.toLocaleString('fr-FR')} €`
}

function evolutionTone(pct: number): 'up' | 'down' | 'neutral' {
  if (pct > 0.5) return 'up'
  if (pct < -0.5) return 'down'
  return 'neutral'
}

interface KpiCardProps {
  eyebrow: string
  value: string
  unit?: string
  hint?: string
  Icon: typeof Building2
  iconBg: string
  iconColor: string
  valueColor?: string
  accentBar: string
  trendIcon?: React.ReactNode
}

function KpiCard({
  eyebrow,
  value,
  unit,
  hint,
  Icon,
  iconBg,
  iconColor,
  valueColor = 'text-[#1B4F72]',
  accentBar,
  trendIcon,
}: KpiCardProps) {
  return (
    <div className="relative rounded-2xl bg-white border border-gray-100 shadow-sm p-5 overflow-hidden group hover:shadow-md transition-shadow">
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B9B9B]">
          {eyebrow}
        </p>
        <div className={`rounded-xl ${iconBg} p-2 shrink-0`} aria-hidden="true">
          <Icon size={16} className={iconColor} />
        </div>
      </div>
      <p className="flex items-baseline gap-2">
        <span
          className={`font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-[34px] leading-none tabular-nums tracking-tight ${valueColor}`}
        >
          {value}
        </span>
        {trendIcon}
      </p>
      {unit && (
        <p className="text-[11px] text-[#9B9B9B] mt-1.5 font-medium">{unit}</p>
      )}
      {hint && (
        <p className="text-[11px] text-[#9B9B9B] mt-0.5">{hint}</p>
      )}
    </div>
  )
}

export function MarketHero({
  postalCode,
  zoneTitle,
  introSummary,
  aggregates,
}: MarketHeroProps) {
  const evoTone = evolutionTone(aggregates.evolution12mPct)
  const EvoIcon =
    evoTone === 'up' ? TrendingUp : evoTone === 'down' ? TrendingDown : Minus
  const evoColor =
    evoTone === 'up'
      ? 'text-[#1e8449]'
      : evoTone === 'down'
        ? 'text-[#C0392B]'
        : 'text-[#5C5C5C]'

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B4F72] via-[#1B4F72] to-[#2E86AB] text-white shadow-xl"
      aria-labelledby="market-hero-title"
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#C9A96E]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative px-6 py-10 md:px-10 md:py-12">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse"
            aria-hidden="true"
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/90">
            Observatoire Ajaccio Estimation · Ajaccio {postalCode}
          </span>
        </div>

        {/* H1 */}
        <h1
          id="market-hero-title"
          className="font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-3xl"
        >
          Prix immobilier à Ajaccio {postalCode}
          <span className="block text-[#C9A96E] text-2xl md:text-3xl font-semibold mt-2">
            {zoneTitle}
          </span>
        </h1>

        {/* Lead */}
        <p className="mt-5 text-[15px] md:text-[17px] leading-relaxed text-white/85 max-w-3xl font-[family-name:var(--font-open-sans)]">
          {introSummary}
        </p>

        {/* AEO synthesis line */}
        {aggregates.hasLiveData && (
          <p className="mt-4 text-[14px] md:text-[15px] text-white/75 max-w-3xl">
            Médiane appartement{' '}
            <strong className="text-white">
              {formatPriceSqm(aggregates.apartmentMedianSqm)}/m²
            </strong>
            {aggregates.villaMedianSqm > 0 && (
              <>
                {' '}· villa{' '}
                <strong className="text-white">
                  {formatPriceSqm(aggregates.villaMedianSqm)}/m²
                </strong>
              </>
            )}{' '}
            · données DVF actualisées au{' '}
            <time dateTime={DVF_LAST_UPDATE} className="font-semibold text-white">
              {DVF_LAST_UPDATE_LABEL}
            </time>
            .
          </p>
        )}

        {/* Freshness badge inline */}
        <div className="mt-5">
          <div className="inline-flex">
            <div className="rounded-lg bg-white/10 border border-white/15 backdrop-blur-sm px-3 py-1.5">
              <DataFreshnessBadge variant="inline" showNextUpdate={false} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI dashboard band */}
      <div className="relative px-6 pb-8 md:px-10 md:pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KpiCard
            eyebrow="Médiane appartement"
            value={formatPriceSqm(aggregates.apartmentMedianSqm)}
            unit="€/m² · 12 mois glissants"
            hint={
              aggregates.apartmentCount12m
                ? `${aggregates.apartmentCount12m} ventes`
                : undefined
            }
            Icon={Building2}
            iconBg="bg-[#D6EEF5]"
            iconColor="text-[#2E86AB]"
            accentBar="bg-[#2E86AB]"
          />
          <KpiCard
            eyebrow="Médiane villa"
            value={formatPriceSqm(aggregates.villaMedianSqm)}
            unit="€/m² · 12 mois glissants"
            hint={
              aggregates.villaCount12m
                ? `${aggregates.villaCount12m} ventes${aggregates.villaCount12m < 5 ? ' (échantillon réduit)' : ''}`
                : 'aucune vente villa publiée'
            }
            Icon={Home}
            iconBg="bg-[#F5ECD7]"
            iconColor="text-[#C9A96E]"
            valueColor="text-[#C9A96E]"
            accentBar="bg-[#C9A96E]"
          />
          <KpiCard
            eyebrow="Ventes analysées"
            value={String(aggregates.totalCount24m || '—')}
            unit="sur 24 mois"
            hint={
              aggregates.totalCount36m
                ? `${aggregates.totalCount36m} sur 36 mois`
                : undefined
            }
            Icon={BarChart3}
            iconBg="bg-[#A3B18A]/30"
            iconColor="text-[#6B7F55]"
            accentBar="bg-[#6B7F55]"
          />
          <KpiCard
            eyebrow="Évolution YoY"
            value={`${aggregates.evolution12mPct > 0 ? '+' : ''}${aggregates.evolution12mPct.toFixed(1)} %`}
            unit="médiane appartement"
            hint="12 mois vs 12 précédents"
            Icon={Activity}
            iconBg={
              evoTone === 'up'
                ? 'bg-[#27AE60]/15'
                : evoTone === 'down'
                  ? 'bg-[#C0392B]/15'
                  : 'bg-gray-200'
            }
            iconColor={evoColor}
            valueColor={evoColor}
            accentBar={
              evoTone === 'up'
                ? 'bg-[#27AE60]'
                : evoTone === 'down'
                  ? 'bg-[#C0392B]'
                  : 'bg-[#9B9B9B]'
            }
            trendIcon={
              <EvoIcon size={20} className={evoColor} aria-hidden="true" />
            }
          />
        </div>
      </div>
    </section>
  )
}
