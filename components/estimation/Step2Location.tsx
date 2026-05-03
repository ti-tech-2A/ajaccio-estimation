'use client'

import { AlertTriangle, MapPin } from 'lucide-react'
import BanAddressAutocomplete, { type BanAddressSuggestion } from '@/components/forms/BanAddressAutocomplete'

interface Step2LocationProps {
  value: { address: string; postalCode: string }
  onChange: (field: string, val: string) => void
  errors: Record<string, string>
}

const POSTAL_OPTIONS = ['20000', '20090', '20167'] as const

export default function Step2Location({ value, onChange, errors }: Step2LocationProps) {
  function handleAddressChange(address: string, suggestion?: BanAddressSuggestion) {
    onChange('address', address)

    if (suggestion?.postcode) {
      onChange('postalCode', suggestion.postcode)
    }

    if (suggestion?.city) {
      onChange('commune', suggestion.city)
    }
  }

  function handlePostalChange(cp: string) {
    onChange('postalCode', cp)
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
            onChange={(event) => handlePostalChange(event.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:ring-offset-1 text-[#5C5C5C] font-[family-name:var(--font-open-sans)] bg-white appearance-none cursor-pointer"
          >
            <option value="" disabled>Sélectionner un code postal</option>
            {POSTAL_OPTIONS.map((postalCode) => (
              <option key={postalCode} value={postalCode}>{postalCode}</option>
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

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-semibold font-[family-name:var(--font-open-sans)] text-[#1B4F72] mb-2"
          >
            Adresse <span className="text-sm font-normal text-[#9B9B9B]">(optionnel)</span>
          </label>
          <BanAddressAutocomplete
            id="address"
            value={value.address}
            postalCode={value.postalCode}
            onChange={handleAddressChange}
            placeholder="Ex : 10 cours Napoléon, Ajaccio"
            icon={(
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <MapPin size={16} className="text-[#9B9B9B]" />
              </div>
            )}
            inputClassName="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:ring-offset-1 text-[#5C5C5C] font-[family-name:var(--font-open-sans)]"
            listClassName="absolute z-50 left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
            optionClassName="w-full px-4 py-3 text-left text-sm text-[#5C5C5C] transition-colors hover:bg-[#D6EEF5] hover:text-[#1B4F72] font-[family-name:var(--font-open-sans)]"
          />
          {errors.address && (
            <p className="text-xs text-[#C0392B] mt-1">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  )
}
