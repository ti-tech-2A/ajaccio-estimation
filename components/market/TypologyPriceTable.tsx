import React from 'react'
import { Home, Building2 } from 'lucide-react'
import type { MarketTypology } from '@/lib/server/market-aggregates'

interface TypologyPriceTableProps {
  typology: MarketTypology
}

const SEGMENT_READING: Record<string, string> = {
  studio_t1: 'Investisseur, étudiant — produit de rendement court terme.',
  t2: 'Primo-accédant, couple actif, investisseur locatif — cœur du marché entrée de gamme.',
  t3: 'Cœur du marché — couples avec enfant, primo-accédants élargis, investisseurs.',
  t4_plus: 'Familles, rareté en centre-ville, valorisation forte si extras (terrasse, parking).',
  maison: 'Famille, retour en Corse, acquéreur patrimonial — terrain et adresse priment.',
}

function formatPriceSqm(value: number): string {
  if (!value) return '—'
  return `${value.toLocaleString('fr-FR')} €`
}

function formatRange(p25: number, p75: number): string {
  if (!p25 || !p75) return '—'
  return `${p25.toLocaleString('fr-FR')} – ${p75.toLocaleString('fr-FR')} €`
}

export function TypologyPriceTable({ typology }: TypologyPriceTableProps) {
  const hasData = typology.hasLiveData

  return (
    <section
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      aria-labelledby="typology-title"
    >
      <div className="mb-5">
        <h2
          id="typology-title"
          className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72]"
        >
          Prix par typologie de bien
        </h2>
        <p className="text-sm text-[#9B9B9B] mt-1">
          Médianes DVF sur 5 ans glissants, fourchette interquartile (P25-P75) et lecture commerciale.
        </p>
      </div>

      {!hasData && (
        <div className="rounded-xl border border-gray-100 bg-[#FAF5EC] p-4 text-sm text-[#9B9B9B]">
          Données DVF en cours d&apos;actualisation pour cette typologie.
        </div>
      )}

      {hasData && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1B4F72] text-white">
                  <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Typologie</th>
                  <th className="px-4 py-3 text-left font-semibold">Surface</th>
                  <th className="px-4 py-3 text-right font-semibold">Médiane €/m²</th>
                  <th className="px-4 py-3 text-right font-semibold">Fourchette P25–P75</th>
                  <th className="px-4 py-3 text-right font-semibold">Ventes</th>
                  <th className="px-4 py-3 text-left font-semibold rounded-tr-lg">Lecture</th>
                </tr>
              </thead>
              <tbody>
                {typology.rows.map((row, i) => (
                  <tr
                    key={row.segment}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF5EC]'}
                  >
                    <td className="px-4 py-3 align-top font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        {row.segment === 'maison' ? (
                          <Home size={14} className="text-[#C9A96E]" aria-hidden="true" />
                        ) : (
                          <Building2 size={14} className="text-[#2E86AB]" aria-hidden="true" />
                        )}
                        {row.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-[#9B9B9B] whitespace-nowrap">
                      {row.surfaceRange}
                    </td>
                    <td className="px-4 py-3 align-top text-right font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72]">
                      {formatPriceSqm(row.medianSqm)}
                    </td>
                    <td className="px-4 py-3 align-top text-right text-[#5C5C5C] whitespace-nowrap">
                      {formatRange(row.p25Sqm, row.p75Sqm)}
                    </td>
                    <td className="px-4 py-3 align-top text-right text-[#9B9B9B]">
                      {row.count || '—'}
                    </td>
                    <td className="px-4 py-3 align-top text-[#5C5C5C] leading-relaxed">
                      {SEGMENT_READING[row.segment] ?? ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="md:hidden space-y-3">
            {typology.rows.map((row) => (
              <li
                key={row.segment}
                className="rounded-xl border border-gray-100 bg-[#FAF5EC] p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72]">
                      {row.label}
                    </p>
                    <p className="text-xs text-[#9B9B9B]">{row.surfaceRange}</p>
                  </div>
                  <p className="font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] text-lg whitespace-nowrap">
                    {formatPriceSqm(row.medianSqm)}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-[#5C5C5C] mb-2">
                  <span>Fourchette : {formatRange(row.p25Sqm, row.p75Sqm)}</span>
                  <span>{row.count || '—'} ventes</span>
                </div>
                <p className="text-xs text-[#5C5C5C] leading-relaxed pt-2 border-t border-gray-200">
                  {SEGMENT_READING[row.segment] ?? ''}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-5 text-xs italic text-[#9B9B9B] leading-relaxed">
        Ces prix ne doivent pas être lus comme une valeur automatique. Deux biens de surface comparable
        peuvent présenter des écarts importants selon l&apos;adresse, l&apos;étage, l&apos;ascenseur, la terrasse,
        la vue, le stationnement, l&apos;état intérieur, la copropriété et la performance énergétique.
      </p>
    </section>
  )
}
