import React from 'react'
import { MapPinned, AlertTriangle } from 'lucide-react'
import type { MicroSector } from '@/data/sector-content/types'

interface MicroSectorsTableProps {
  sectors: MicroSector[]
}

export function MicroSectorsTable({ sectors }: MicroSectorsTableProps) {
  return (
    <section
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      aria-labelledby="microsectors-title"
    >
      <div className="mb-5">
        <h2
          id="microsectors-title"
          className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72]"
        >
          Micro-secteurs et lecture immobilière
        </h2>
        <p className="text-sm text-[#9B9B9B] mt-1">
          Chaque sous-quartier a ses propres dynamiques — adresse, type de bien, points de vigilance.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1B4F72] text-white">
              <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Micro-secteur</th>
              <th className="px-4 py-3 text-left font-semibold">Lecture immobilière</th>
              <th className="px-4 py-3 text-left font-semibold rounded-tr-lg">Points de vigilance</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((s, i) => (
              <tr
                key={s.name}
                className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF5EC]'}
              >
                <td className="px-4 py-3 align-top font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] whitespace-nowrap">
                  {s.name}
                </td>
                <td className="px-4 py-3 align-top text-[#5C5C5C] leading-relaxed">
                  {s.reading}
                </td>
                <td className="px-4 py-3 align-top text-[#5C5C5C] leading-relaxed">
                  {s.vigilance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="md:hidden space-y-3">
        {sectors.map((s) => (
          <li
            key={s.name}
            className="rounded-xl border border-gray-100 bg-[#FAF5EC] p-4"
          >
            <div className="flex items-start gap-2 mb-2">
              <MapPinned size={16} className="text-[#2E86AB] shrink-0 mt-0.5" aria-hidden="true" />
              <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-sm">
                {s.name}
              </h3>
            </div>
            <p className="text-sm text-[#5C5C5C] leading-relaxed mb-3">{s.reading}</p>
            <div className="flex items-start gap-2 pt-3 border-t border-gray-200">
              <AlertTriangle size={14} className="text-[#C9A96E] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-[#5C5C5C] leading-relaxed">{s.vigilance}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
