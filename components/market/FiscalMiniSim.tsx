'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const TAUX_AJACCIO = 0.5034

export function FiscalMiniSim() {
  const [vlc, setVlc] = useState('')

  const parsed = parseFloat(vlc)
  const hasResult = vlc !== '' && !isNaN(parsed) && parsed > 0
  const taxe = hasResult ? Math.round(parsed * TAUX_AJACCIO) : 0

  return (
    <div className="bg-[#D6EEF5] rounded-xl p-5 mt-6">
      <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] mb-3">
        Simulation taxe foncière — Ajaccio
      </h3>
      <div className="flex gap-3 items-center flex-wrap">
        <div>
          <label
            htmlFor="vlc-input"
            className="text-xs text-[#9B9B9B] block mb-1"
          >
            Valeur locative cadastrale (€)
          </label>
          <input
            id="vlc-input"
            type="number"
            value={vlc}
            onChange={(e) => setVlc(e.target.value)}
            placeholder="Ex: 1 200"
            className="px-3 py-2 rounded-lg border border-[#2E86AB]/30 w-40 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB] bg-white"
          />
        </div>
        {hasResult && (
          <div className="bg-white rounded-lg px-4 py-3">
            <p className="text-xs text-[#9B9B9B]">Taxe foncière estimée</p>
            <p className="text-xl font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72]">
              {taxe.toLocaleString('fr-FR')} €/an
            </p>
          </div>
        )}
      </div>
      <p className="text-xs text-[#9B9B9B] mt-3">
        Taux communal Ajaccio 2025 : 50,34 %.{' '}
        <Link href="/simulateur-fiscal" className="text-[#2E86AB] hover:underline">
          Simulateur complet →
        </Link>
      </p>
    </div>
  )
}
