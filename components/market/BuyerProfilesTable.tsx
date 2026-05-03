import React from 'react'
import { Users } from 'lucide-react'
import type { BuyerProfile } from '@/data/sector-content/types'

interface BuyerProfilesTableProps {
  profiles: BuyerProfile[]
}

export function BuyerProfilesTable({ profiles }: BuyerProfilesTableProps) {
  return (
    <section
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      aria-labelledby="buyers-title"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="rounded-xl bg-[#D6EEF5] p-2 shrink-0" aria-hidden="true">
          <Users size={18} className="text-[#1B4F72]" />
        </div>
        <div>
          <h2
            id="buyers-title"
            className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72]"
          >
            Profils acheteurs et arguments-clés
          </h2>
          <p className="text-sm text-[#9B9B9B] mt-1">
            Comprendre qui achète dans votre secteur permet de positionner le bien sur les bons critères.
          </p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1B4F72] text-white">
              <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Profil acheteur</th>
              <th className="px-4 py-3 text-left font-semibold">Ce qu&apos;il recherche</th>
              <th className="px-4 py-3 text-left font-semibold rounded-tr-lg">Argument à mettre en avant</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p, i) => (
              <tr
                key={p.profile}
                className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF5EC]'}
              >
                <td className="px-4 py-3 align-top font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72]">
                  {p.profile}
                </td>
                <td className="px-4 py-3 align-top text-[#5C5C5C] leading-relaxed">
                  {p.searchingFor}
                </td>
                <td className="px-4 py-3 align-top text-[#5C5C5C] leading-relaxed">
                  {p.argument}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="md:hidden grid grid-cols-1 gap-3">
        {profiles.map((p) => (
          <li
            key={p.profile}
            className="rounded-xl border border-gray-100 bg-[#FAF5EC] p-4"
          >
            <p className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] mb-2">
              {p.profile}
            </p>
            <p className="text-xs text-[#9B9B9B] uppercase font-semibold tracking-wide mb-1">
              Recherche
            </p>
            <p className="text-sm text-[#5C5C5C] leading-relaxed mb-3">{p.searchingFor}</p>
            <p className="text-xs text-[#9B9B9B] uppercase font-semibold tracking-wide mb-1">
              Argument
            </p>
            <p className="text-sm text-[#5C5C5C] leading-relaxed">{p.argument}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
