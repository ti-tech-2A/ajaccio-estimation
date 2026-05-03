import React from 'react'
import { MapPin } from 'lucide-react'
import type { SectorPositioning } from '@/data/sector-content/types'

interface SectorIntroductionProps {
  positioning: SectorPositioning
}

export function SectorIntroduction({ positioning }: SectorIntroductionProps) {
  return (
    <section
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      aria-labelledby="sector-intro-title"
    >
      {/* Header band */}
      <div className="bg-gradient-to-br from-[#1B4F72] to-[#2E86AB] px-6 py-5 text-white">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white/15 p-2 shrink-0" aria-hidden="true">
            <MapPin size={20} />
          </div>
          <div>
            <h2
              id="sector-intro-title"
              className="font-[family-name:var(--font-poppins)] text-lg font-semibold"
            >
              Comprendre le secteur
            </h2>
            <p className="text-sm text-white/85 mt-1 font-[family-name:var(--font-open-sans)]">
              {positioning.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Angle */}
      <div className="px-6 pt-5">
        <p className="font-[family-name:var(--font-open-sans)] text-[#5C5C5C] leading-relaxed italic border-l-4 border-[#C9A96E] pl-4">
          {positioning.angle}
        </p>
      </div>

      {/* Q&A grid */}
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {positioning.questions.map((q, i) => (
          <div
            key={i}
            className="bg-[#FAF5EC] rounded-xl p-4 border border-gray-100"
          >
            <dt className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-sm mb-2">
              {q.question}
            </dt>
            <dd className="text-sm text-[#5C5C5C] leading-relaxed font-[family-name:var(--font-open-sans)]">
              {q.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
