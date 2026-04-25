'use client'

import { Shield } from 'lucide-react'
import Link from 'next/link'

interface Step5ContactProps {
  value: {
    fullName: string
    email: string
    phone: string
    gdprConsent: boolean
  }
  onChange: (field: string, val: string | boolean) => void
  errors: Record<string, string>
}

const inputClass = [
  'w-full px-4 py-3 rounded-xl border border-gray-200',
  'focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:ring-offset-1',
  'text-[#5C5C5C] font-[family-name:var(--font-open-sans)]',
  'placeholder:text-[#9B9B9B]',
].join(' ')

export default function Step5Contact({ value, onChange, errors }: Step5ContactProps) {
  return (
    <div>
      <h2 className="text-2xl font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] mb-2">
        Où envoyer votre estimation ?
      </h2>
      <p className="text-[#9B9B9B] font-[family-name:var(--font-open-sans)] mb-8">
        Votre estimation gratuite et sans engagement, directement dans votre boîte mail.
      </p>

      <div className="space-y-5">
        {/* Full name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold font-[family-name:var(--font-open-sans)] text-[#1B4F72] mb-2"
          >
            Nom complet <span className="text-[#C0392B]">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={value.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="Jean Dupont"
            className={[
              inputClass,
              errors.fullName ? 'border-[#C0392B]' : '',
            ].join(' ')}
            autoComplete="name"
          />
          {errors.fullName && (
            <p className="text-xs text-[#C0392B] mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold font-[family-name:var(--font-open-sans)] text-[#1B4F72] mb-2"
          >
            Adresse email <span className="text-[#C0392B]">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={value.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="jean.dupont@email.fr"
            className={[
              inputClass,
              errors.email ? 'border-[#C0392B]' : '',
            ].join(' ')}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-[#C0392B] mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold font-[family-name:var(--font-open-sans)] text-[#1B4F72] mb-2"
          >
            Téléphone <span className="text-[#C0392B]">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={value.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+33 6 XX XX XX XX"
            className={[
              inputClass,
              errors.phone ? 'border-[#C0392B]' : '',
            ].join(' ')}
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="text-xs text-[#C0392B] mt-1">{errors.phone}</p>
          )}
        </div>

        {/* GDPR consent */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={value.gdprConsent}
              onChange={(e) => onChange('gdprConsent', e.target.checked)}
              className="accent-[#2E86AB] w-4 h-4 mt-0.5 shrink-0"
            />
            <span className="text-sm font-[family-name:var(--font-open-sans)] text-[#5C5C5C] leading-relaxed">
              J&apos;accepte que mes données soient utilisées pour me transmettre mon estimation.
              Consultez notre{' '}
              <Link
                href="/politique-confidentialite"
                className="text-[#2E86AB] underline hover:text-[#1B4F72] transition-colors"
                target="_blank"
              >
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          {errors.gdprConsent && (
            <p className="text-xs text-[#C0392B] mt-1 ml-7">{errors.gdprConsent}</p>
          )}
        </div>

        {/* RGPD info */}
        <div className="flex items-start gap-2 p-3 bg-[#6B7F55]/10 rounded-lg text-sm text-[#5C5C5C] mt-4">
          <Shield size={16} className="text-[#6B7F55] shrink-0 mt-0.5" />
          <span className="font-[family-name:var(--font-open-sans)]">
            Vos données ne sont jamais revendues. Elles servent uniquement à vous transmettre votre
            estimation et, si vous le souhaitez, à vous recontacter.
          </span>
        </div>
      </div>
    </div>
  )
}
