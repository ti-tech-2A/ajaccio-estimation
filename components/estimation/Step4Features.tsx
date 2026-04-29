'use client'

import type { PropertyCondition, PropertyType } from '@/types/estimation'

interface ConditionOption {
  value: PropertyCondition
  label: string
  color: string
}

const CONDITIONS: ConditionOption[] = [
  { value: 'neuf', label: 'Neuf', color: '#27AE60' },
  { value: 'tres-bon', label: 'Très bon', color: '#2E86AB' },
  { value: 'bon', label: 'Bon', color: '#C9A96E' },
  { value: 'a-rafraichir', label: 'À rafraîchir', color: '#E67E22' },
  { value: 'a-renover', label: 'À rénover', color: '#C0392B' },
]

const APPARTEMENT_FEATURES = [
  'Terrasse',
  'Balcon',
  'Loggia',
  'Parking box',
  'Place sous-sol',
  'Vue mer',
  'Vue dégagée',
  'Ascenseur',
  'Cave',
  'Gardiennage',
  'Climatisation',
  'Double vitrage',
  'DPE A/B',
  'Résidence récente',
]

const VILLA_FEATURES = [
  'Piscine chauffée',
  'Piscine standard',
  'Terrain > 2000m²',
  'Vue mer panoramique',
  'Vue mer partielle',
  'Garage double',
  'Plain-pied',
  'Accès facile',
  'Domotique',
  'Cuisine équipée haut de gamme',
  'DPE A/B',
]

interface Step4FeaturesProps {
  condition: PropertyCondition | undefined
  features: string[]
  propertyType: PropertyType
  onConditionChange: (c: PropertyCondition) => void
  onFeaturesChange: (f: string[]) => void
}

export default function Step4Features({
  condition,
  features,
  propertyType,
  onConditionChange,
  onFeaturesChange,
}: Step4FeaturesProps) {
  const availableFeatures = propertyType === 'appartement' ? APPARTEMENT_FEATURES : VILLA_FEATURES

  function toggleFeature(feature: string) {
    if (features.includes(feature)) {
      onFeaturesChange(features.filter((f) => f !== feature))
    } else {
      onFeaturesChange([...features, feature])
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] mb-2">
        État et prestations
      </h2>
      <p className="text-[#666666] font-[family-name:var(--font-open-sans)] mb-8">
        Ces éléments influencent directement la valeur de votre bien.
      </p>

      {/* Condition */}
      <div className="mb-8">
        <p className="text-sm font-semibold font-[family-name:var(--font-open-sans)] text-[#1B4F72] mb-3">
          État général <span className="text-[#C0392B]">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((cond) => {
            const isActive = condition === cond.value
            return (
              <button
                key={cond.value}
                type="button"
                onClick={() => onConditionChange(cond.value)}
                className={[
                  'px-4 py-2.5 rounded-xl border-2 text-sm font-[family-name:var(--font-open-sans)] font-semibold transition-all',
                  isActive ? 'text-white' : 'border-gray-200 bg-white text-[#5C5C5C] hover:border-gray-300',
                ].join(' ')}
                style={
                  isActive
                    ? { borderColor: cond.color, backgroundColor: cond.color }
                    : undefined
                }
                aria-pressed={isActive}
              >
                {cond.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <div>
        <p className="text-sm font-semibold font-[family-name:var(--font-open-sans)] text-[#1B4F72] mb-3">
          Prestations et points forts{' '}
          <span className="text-[#666666] font-normal">(sélection multiple)</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availableFeatures.map((feature) => {
            const isChecked = features.includes(feature)
            return (
              <label
                key={feature}
                className={[
                  'flex items-center gap-2 cursor-pointer p-2 rounded-lg border transition-colors',
                  isChecked
                    ? 'border-[#2E86AB] bg-[#D6EEF5]'
                    : 'border-gray-200 bg-white hover:border-[#2E86AB]/50',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFeature(feature)}
                  className="accent-[#2E86AB] w-4 h-4 shrink-0"
                />
                <span className="text-xs font-[family-name:var(--font-open-sans)] text-[#5C5C5C] leading-tight">
                  {feature}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
