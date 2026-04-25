'use client'

import { useState, useRef, useEffect } from 'react'
import { AlertTriangle, MapPin } from 'lucide-react'

interface AddressFeature {
  properties: {
    label: string
    postcode: string
    city: string
    name: string
  }
}

interface Step2LocationProps {
  value: { address: string; postalCode: string }
  onChange: (field: string, val: string) => void
  errors: Record<string, string>
}

const POSTAL_OPTIONS = ['20000', '20090', '20167'] as const

export default function Step2Location({ value, onChange, errors }: Step2LocationProps) {
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [addressInput, setAddressInput] = useState(value.address)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleAddressChange(query: string) {
    setAddressInput(query)
    onChange('address', query)
    setSuggestions([])

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.length < 3) {
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: query, limit: '5' })
        if (value.postalCode) params.append('postcode', value.postalCode)
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?${params}`)
        if (!res.ok) return
        const data = await res.json() as { features: AddressFeature[] }
        setSuggestions(data.features ?? [])
        setShowSuggestions(data.features?.length > 0)
      } catch {
        // Silently fail — autocomplete is optional
      }
    }, 300)
  }

  function handleSuggestionSelect(feature: AddressFeature) {
    const label = feature.properties.label
    setAddressInput(label)
    onChange('address', label)
    setSuggestions([])
    setShowSuggestions(false)
  }

  function handlePostalChange(cp: string) {
    onChange('postalCode', cp)
    // Re-trigger address search with new postal code
    if (addressInput.length >= 3) {
      handleAddressChange(addressInput)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] mb-2">
        Où se situe votre bien ?
      </h2>
      <p className="text-[#9B9B9B] font-[family-name:var(--font-open-sans)] mb-8">
        Renseignez le code postal et l&apos;adresse de votre bien à Ajaccio.
      </p>

      <div className="space-y-6">
        {/* Postal code */}
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-semibold font-[family-name:var(--font-open-sans)] text-[#1B4F72] mb-2"
          >
            Code postal <span className="text-[#C0392B]">*</span>
          </label>
          <select
            id="postalCode"
            value={value.postalCode}
            onChange={(e) => handlePostalChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:ring-offset-1 text-[#5C5C5C] font-[family-name:var(--font-open-sans)] bg-white appearance-none cursor-pointer"
          >
            <option value="" disabled>Sélectionner un code postal</option>
            {POSTAL_OPTIONS.map((cp) => (
              <option key={cp} value={cp}>{cp}</option>
            ))}
          </select>
          {errors.postalCode && (
            <p className="text-xs text-[#C0392B] mt-1">{errors.postalCode}</p>
          )}

          {value.postalCode === '20167' && (
            <div className="flex items-start gap-2 p-3 bg-[#EDD9B3] rounded-lg text-sm text-[#5C5C5C] mt-2">
              <AlertTriangle size={16} className="text-[#C9A96E] shrink-0 mt-0.5" />
              <span>
                Ce code postal couvre Mezzavia (Ajaccio) et Alata. Seuls les biens de la commune
                d&apos;Ajaccio sont couverts par ce site.
              </span>
            </div>
          )}
        </div>

        {/* Address autocomplete */}
        <div ref={containerRef}>
          <label
            htmlFor="address"
            className="block text-sm font-semibold font-[family-name:var(--font-open-sans)] text-[#1B4F72] mb-2"
          >
            Adresse <span className="text-sm font-normal text-[#9B9B9B]">(optionnel)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin size={16} className="text-[#9B9B9B]" />
            </div>
            <input
              id="address"
              type="text"
              value={addressInput}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Ex : 10 cours Napoléon, Ajaccio"
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:ring-offset-1 text-[#5C5C5C] font-[family-name:var(--font-open-sans)]"
              autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((feature, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-3 text-sm text-[#5C5C5C] hover:bg-[#D6EEF5] hover:text-[#1B4F72] transition-colors font-[family-name:var(--font-open-sans)]"
                      onClick={() => handleSuggestionSelect(feature)}
                    >
                      {feature.properties.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.address && (
            <p className="text-xs text-[#C0392B] mt-1">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  )
}
