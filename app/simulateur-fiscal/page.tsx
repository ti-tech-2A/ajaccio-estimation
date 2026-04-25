/* eslint-disable react/no-unescaped-entities */

'use client'

import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type TabId = 'fonciere' | 'habitation' | 'plusvalue'
type TravauxMode = 'forfait' | 'reel'

interface Tab {
  id: TabId
  label: string
}

interface PlusValueState {
  prixAcquisition: string
  prixVente: string
  dureeDetention: number
  travauxMode: TravauxMode
  travauxReel: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const tabs: Tab[] = [
  { id: 'fonciere', label: 'Taxe foncière' },
  { id: 'habitation', label: "Taxe d'habitation" },
  { id: 'plusvalue', label: 'Plus-value immobilière' },
]

function getAbattementIR(years: number): number {
  if (years <= 5) return 0
  if (years <= 21) return Math.min((years - 5) * 6, 96)
  if (years === 22) return 100
  return 100
}

function getAbattementPS(years: number): number {
  if (years <= 5) return 0
  if (years <= 21) return Math.min((years - 5) * 1.65, 26.4)
  if (years === 22) return 28
  if (years <= 30) return Math.min(28 + (years - 22) * 9, 100)
  return 100
}

// Pre-compute chart data for all 30 years
const chartData = Array.from({ length: 31 }, (_, i) => ({
  annee: i,
  IR: Math.round(getAbattementIR(i)),
  PS: Math.round(getAbattementPS(i) * 10) / 10,
}))

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoTooltip({ content }: { content: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="w-4 h-4 rounded-full border border-[#9B9B9B] text-[#9B9B9B] text-[10px] font-bold inline-flex items-center justify-center leading-none hover:border-[#2E86AB] hover:text-[#2E86AB] transition-colors"
        aria-label="Information"
      >
        i
      </button>
      {visible && (
        <span className="absolute left-6 top-0 z-30 bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs text-[#5C5C5C] w-64 font-[family-name:var(--font-open-sans)]">
          {content}
        </span>
      )}
    </span>
  )
}

function NumberInput({
  label,
  value,
  onChange,
  suffix = '€',
  placeholder = '0',
  helpText,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  suffix?: string
  placeholder?: string
  helpText?: string
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-[#1B4F72] mb-1 font-[family-name:var(--font-open-sans)]">
        {label}
      </label>
      {helpText && (
        <p className="text-xs text-[#9B9B9B] mb-1 font-[family-name:var(--font-open-sans)]">{helpText}</p>
      )}
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-[#1B4F72] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E86AB] bg-white text-sm"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B9B9B] text-sm">{suffix}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 1 — Taxe foncière
// ---------------------------------------------------------------------------
function TabFonciere() {
  const [vlc, setVlc] = useState('')
  const [tauxCommunal, setTauxCommunal] = useState('50.34')

  const { taxeFonciere, baseImposable } = useMemo(() => {
    const v = parseFloat(vlc) || 0
    const t = parseFloat(tauxCommunal) || 0
    return {
      taxeFonciere: Math.round(v * t / 100),
      baseImposable: Math.round(v * 0.5),
    }
  }, [vlc, tauxCommunal])

  return (
    <div className="max-w-xl">
      <NumberInput
        label="Valeur locative cadastrale"
        value={vlc}
        onChange={setVlc}
        suffix="€"
        placeholder="ex. 3 000"
        helpText="Montant figurant sur votre avis de taxe foncière, rubrique « Base »"
      />

      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#1B4F72] mb-1 font-[family-name:var(--font-open-sans)] flex items-center gap-1">
          Taux communal Ajaccio (%)
          <InfoTooltip content="Taux voté par la ville d'Ajaccio. Ce taux peut être ajusté annuellement par le conseil municipal. Valeur 2024 : 50,34 %. Vérifiez votre dernier avis de taxe foncière pour le taux exact." />
        </label>
        <div className="relative">
          <input
            type="number"
            value={tauxCommunal}
            onChange={(e) => setTauxCommunal(e.target.value)}
            step="0.01"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-[#1B4F72] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E86AB] bg-white text-sm"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B9B9B] text-sm">%</span>
        </div>
        <p className="text-xs text-[#9B9B9B] mt-1 font-[family-name:var(--font-open-sans)]">
          Taux pré-rempli : 50,34 % (Ajaccio 2024). Modifiable selon votre avis.
        </p>
      </div>

      <div className="bg-[#D6EEF5] rounded-2xl p-6 mt-6">
        <p className="text-sm text-[#9B9B9B] font-[family-name:var(--font-open-sans)]">Taxe foncière annuelle estimée</p>
        <p className="text-4xl font-bold font-[family-name:var(--font-poppins)] text-[#1B4F72] mt-1">
          {taxeFonciere.toLocaleString('fr-FR')} €
        </p>
        <p className="text-sm text-[#5C5C5C] mt-2 font-[family-name:var(--font-open-sans)]">
          Base imposable : {baseImposable.toLocaleString('fr-FR')} €
        </p>
      </div>

      <div className="mt-6 p-4 bg-[#F5ECD7] rounded-xl">
        <p className="text-xs text-[#5C5C5C] font-[family-name:var(--font-open-sans)]">
          <strong>Barème indicatif :</strong> La taxe foncière = Valeur Locative Cadastrale × 50 % (abattement légal) × taux communal.
          Ce simulateur est indicatif. Pour le montant exact, référez-vous à votre avis d'imposition.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 2 — Taxe d'habitation
// ---------------------------------------------------------------------------
function TabHabitation() {
  const [vlc2, setVlc2] = useState('')
  const [majorationRate, setMajorationRate] = useState('10')

  const taxeHabitation = useMemo(() => {
    const v = parseFloat(vlc2) || 0
    const r = parseFloat(majorationRate) || 0
    return Math.round(v * (r / 100))
  }, [vlc2, majorationRate])

  return (
    <div className="max-w-xl">
      <div className="bg-[#EDD9B3] rounded-xl p-4 mb-6 text-sm text-[#5C5C5C] font-[family-name:var(--font-open-sans)]">
        La taxe d'habitation a été supprimée pour les résidences principales. Elle reste applicable aux résidences secondaires avec une possible majoration communale.
      </div>

      <NumberInput
        label="Valeur locative cadastrale"
        value={vlc2}
        onChange={setVlc2}
        suffix="€"
        placeholder="ex. 3 000"
        helpText="Montant figurant sur votre avis de taxe d'habitation, rubrique « Base »"
      />

      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#1B4F72] mb-1 font-[family-name:var(--font-open-sans)] flex items-center gap-1">
          Taux applicable (%)
          <InfoTooltip content="Taux de taxe d'habitation sur les résidences secondaires, incluant l'éventuelle majoration communale. À Ajaccio, une majoration peut s'appliquer dans les zones tendues." />
        </label>
        <div className="relative">
          <input
            type="number"
            value={majorationRate}
            onChange={(e) => setMajorationRate(e.target.value)}
            step="0.1"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-[#1B4F72] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E86AB] bg-white text-sm"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B9B9B] text-sm">%</span>
        </div>
      </div>

      <div className="bg-[#D6EEF5] rounded-2xl p-6 mt-6">
        <p className="text-sm text-[#9B9B9B] font-[family-name:var(--font-open-sans)]">Taxe d'habitation annuelle estimée</p>
        <p className="text-4xl font-bold font-[family-name:var(--font-poppins)] text-[#1B4F72] mt-1">
          {taxeHabitation.toLocaleString('fr-FR')} €
        </p>
        <p className="text-sm text-[#5C5C5C] mt-2 font-[family-name:var(--font-open-sans)]">
          (Résidences secondaires uniquement)
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 3 — Plus-value
// ---------------------------------------------------------------------------
function TabPlusValue() {
  const [state, setState] = useState<PlusValueState>({
    prixAcquisition: '',
    prixVente: '',
    dureeDetention: 10,
    travauxMode: 'forfait',
    travauxReel: '',
  })

  const set = (partial: Partial<PlusValueState>) =>
    setState((prev) => ({ ...prev, ...partial }))

  const result = useMemo(() => {
    const acquisition = parseFloat(state.prixAcquisition) || 0
    const vente = parseFloat(state.prixVente) || 0
    const duree = state.dureeDetention
    const travaux =
      state.travauxMode === 'forfait'
        ? acquisition * 0.15
        : parseFloat(state.travauxReel) || 0

    const prixAcquisitionTotal = acquisition + travaux
    const plusValueBrute = vente - prixAcquisitionTotal

    const abatIR = getAbattementIR(duree)
    const abatPS = getAbattementPS(duree)
    const pvImposableIR = Math.max(0, plusValueBrute * (1 - abatIR / 100))
    const pvImposablePS = Math.max(0, plusValueBrute * (1 - abatPS / 100))
    const ir = Math.round(pvImposableIR * 0.19)
    const ps = Math.round(pvImposablePS * 0.172)
    const total = ir + ps

    return {
      acquisition,
      vente,
      travaux,
      prixAcquisitionTotal,
      plusValueBrute,
      abatIR,
      abatPS,
      pvImposableIR,
      pvImposablePS,
      ir,
      ps,
      total,
    }
  }, [state])

  const fmt = (n: number) => n.toLocaleString('fr-FR')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left — inputs */}
      <div>
        <NumberInput
          label="Prix d'acquisition"
          value={state.prixAcquisition}
          onChange={(v) => set({ prixAcquisition: v })}
          helpText="Prix d'achat du bien (frais de notaire inclus)"
        />
        <NumberInput
          label="Prix de vente"
          value={state.prixVente}
          onChange={(v) => set({ prixVente: v })}
          helpText="Prix de cession net vendeur"
        />

        {/* Travaux mode */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[#1B4F72] mb-2 font-[family-name:var(--font-open-sans)]">
            Travaux déductibles
          </label>
          <div className="flex gap-2 mb-3">
            {(['forfait', 'reel'] as TravauxMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => set({ travauxMode: mode })}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  state.travauxMode === mode
                    ? 'bg-[#1B4F72] text-white'
                    : 'bg-gray-100 text-[#5C5C5C] hover:bg-gray-200'
                }`}
              >
                {mode === 'forfait' ? 'Forfait 15 %' : 'Montant réel'}
              </button>
            ))}
          </div>
          {state.travauxMode === 'forfait' ? (
            <p className="text-xs text-[#9B9B9B] font-[family-name:var(--font-open-sans)]">
              Forfait légal de 15 % du prix d'acquisition appliqué automatiquement (bien détenu depuis plus de 5 ans).
            </p>
          ) : (
            <NumberInput
              label="Montant réel des travaux"
              value={state.travauxReel}
              onChange={(v) => set({ travauxReel: v })}
              helpText="Travaux de construction, reconstruction, agrandissement (justificatifs requis)"
            />
          )}
        </div>

        {/* Slider durée */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[#1B4F72] mb-2 font-[family-name:var(--font-open-sans)]">
            Durée de détention : <span className="text-[#2E86AB]">{state.dureeDetention} ans</span>
          </label>
          <input
            type="range"
            min={0}
            max={30}
            value={state.dureeDetention}
            onChange={(e) => set({ dureeDetention: parseInt(e.target.value) })}
            className="w-full accent-[#2E86AB]"
          />
          <div className="flex justify-between text-xs text-[#9B9B9B] mt-1 font-[family-name:var(--font-open-sans)]">
            <span>0 an</span>
            <span>30 ans (exonération totale)</span>
          </div>
        </div>
      </div>

      {/* Right — results + chart */}
      <div>
        {/* Decomposed table */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-base font-bold text-[#1B4F72] font-[family-name:var(--font-poppins)] mb-4">
            Décomposition du calcul
          </h3>
          <table className="w-full text-sm font-[family-name:var(--font-open-sans)]">
            <tbody className="divide-y divide-gray-100">
              <tr className="py-2">
                <td className="py-2 text-[#5C5C5C]">Prix d'acquisition total</td>
                <td className="py-2 text-right font-semibold text-[#1B4F72]">{fmt(result.prixAcquisitionTotal)} €</td>
              </tr>
              <tr>
                <td className="py-2 text-[#5C5C5C]">Plus-value brute</td>
                <td className={`py-2 text-right font-semibold ${result.plusValueBrute >= 0 ? 'text-[#C0392B]' : 'text-[#27AE60]'}`}>
                  {fmt(result.plusValueBrute)} €
                </td>
              </tr>
              <tr>
                <td className="py-2 text-[#5C5C5C]">Abattement IR ({result.abatIR} %)</td>
                <td className="py-2 text-right text-[#27AE60]">
                  -{fmt(Math.round(result.plusValueBrute * result.abatIR / 100))} €
                </td>
              </tr>
              <tr>
                <td className="py-2 text-[#5C5C5C]">PV imposable IR</td>
                <td className="py-2 text-right font-semibold text-[#1B4F72]">{fmt(Math.round(result.pvImposableIR))} €</td>
              </tr>
              <tr>
                <td className="py-2 text-[#5C5C5C]">IR 19 %</td>
                <td className="py-2 text-right text-[#C0392B]">{fmt(result.ir)} €</td>
              </tr>
              <tr>
                <td className="py-2 text-[#5C5C5C]">Prélèvements sociaux 17,2 %</td>
                <td className="py-2 text-right text-[#C0392B]">{fmt(result.ps)} €</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#C9A96E]">
                <td className="pt-3 pb-1 font-bold text-[#1B4F72] font-[family-name:var(--font-poppins)]">Total à payer</td>
                <td className="pt-3 pb-1 text-right text-2xl font-bold font-[family-name:var(--font-poppins)] text-[#C9A96E]">
                  {fmt(result.total)} €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Abattement chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1B4F72] font-[family-name:var(--font-poppins)] mb-4">
            Abattements selon la durée de détention
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="annee"
                tickFormatter={(v: number) => `${v}a`}
                tick={{ fontSize: 10, fill: '#9B9B9B' }}
              />
              <YAxis
                tickFormatter={(v: number) => `${v}%`}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#9B9B9B' }}
                width={36}
              />
              <Tooltip
                formatter={(value: number, name: string) => [`${value} %`, name]}
                labelFormatter={(label: number) => `${label} ans`}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value: string) => (value === 'IR' ? 'Abattement IR' : 'Abattement PS')}
              />
              <ReferenceLine
                x={state.dureeDetention}
                stroke="#C9A96E"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{ value: `${state.dureeDetention}a`, fill: '#C9A96E', fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="IR"
                stroke="#1B4F72"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="PS"
                stroke="#2E86AB"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Outbound links */}
        <div className="flex gap-4 mt-6 text-xs text-[#9B9B9B] font-[family-name:var(--font-open-sans)]">
          <a
            href="https://www.legifrance.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2E86AB] hover:underline"
          >
            Barèmes officiels Légifrance
          </a>
          <a
            href="https://bofip.impots.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2E86AB] hover:underline"
          >
            BOFiP
          </a>
        </div>
        <p className="text-xs text-[#9B9B9B] mt-2 italic font-[family-name:var(--font-open-sans)]">
          Simulation indicative — consultez un professionnel fiscal.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SimulateurFiscalPage() {
  const [activeTab, setActiveTab] = useState<TabId>('fonciere')

  return (
    <main className="min-h-screen bg-[#FAF5EC]">
      {/* Hero */}
      <section className="bg-[#1B4F72] pt-32 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#C9A96E] text-sm font-semibold font-[family-name:var(--font-open-sans)] mb-2 uppercase tracking-wider">
            Outils fiscaux
          </p>
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-poppins)] text-white mb-3">
            Simulateur fiscal immobilier
          </h1>
          <p className="text-white/70 font-[family-name:var(--font-open-sans)] text-base max-w-2xl">
            Estimez votre taxe foncière, taxe d'habitation et plus-value immobilière à Ajaccio. Résultats calculés en temps réel.
          </p>
        </div>
      </section>

      {/* Sticky tabs */}
      <div className="flex border-b border-gray-200 mb-8 sticky top-[100px] bg-white z-20 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold text-sm transition-colors border-b-2 font-[family-name:var(--font-open-sans)] ${
              activeTab === tab.id
                ? 'border-[#2E86AB] text-[#2E86AB]'
                : 'border-transparent text-[#9B9B9B] hover:text-[#1B4F72]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        {activeTab === 'fonciere' && <TabFonciere />}
        {activeTab === 'habitation' && <TabHabitation />}
        {activeTab === 'plusvalue' && <TabPlusValue />}
      </div>
    </main>
  )
}
