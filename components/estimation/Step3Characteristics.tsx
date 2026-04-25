'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'
import type { PropertyType, WizardFormData } from '@/types/estimation'

interface StepperProps {
  label: string
  value: number | undefined
  onChange: (val: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  optional?: boolean
}

function Stepper({ label, value, onChange, min, max, step = 1, unit, optional }: StepperProps) {
  const current = value ?? min
  const [localValue, setLocalValue] = useState<string>(current.toString())

  useEffect(() => {
    setLocalValue(current.toString())
  }, [current])

  function decrement() {
    const next = current - step
    if (next >= min) {
      onChange(next)
      setLocalValue(next.toString())
    }
  }

  function increment() {
    const next = current + step
    if (next <= max) {
      onChange(next)
      setLocalValue(next.toString())
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '') {
      setLocalValue('')
      return
    }
    const num = parseInt(val, 10)
    if (!isNaN(num)) {
      setLocalValue(num.toString())
      if (num >= min && num <= max) {
        onChange(num)
      }
    }
  }

  const handleBlur = () => {
    let num = parseInt(localValue, 10)
    if (isNaN(num) || num < min) {
      num = min
    } else if (num > max) {
      num = max
    }
    setLocalValue(num.toString())
    onChange(num)
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 gap-2">
      <span className="text-sm font-[family-name:var(--font-open-sans)] text-[#5C5C5C] font-medium leading-tight">
        {label}
        {optional && (
          <span className="ml-1 text-[#9B9B9B] font-normal text-xs whitespace-nowrap">(optionnel)</span>
        )}
      </span>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          aria-label="Diminuer"
          onClick={decrement}
          disabled={current <= min}
          className="w-8 h-8 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2E86AB] hover:text-[#2E86AB] hover:bg-[#2E86AB]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-[#5C5C5C]"
        >
          <span className="text-lg leading-none select-none">−</span>
        </button>
        
        <div className="flex items-baseline justify-center min-w-[3.5rem] sm:min-w-[4rem] group relative">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-10 sm:w-12 text-center text-sm font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#2E86AB] focus:outline-none transition-colors p-0 rounded-none shadow-none focus:ring-0"
          />
          {unit && <span className="text-xs text-[#9B9B9B] ml-0.5 select-none pointer-events-none">{unit}</span>}
        </div>

        <button
          type="button"
          aria-label="Augmenter"
          onClick={increment}
          disabled={current >= max}
          className="w-8 h-8 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2E86AB] hover:text-[#2E86AB] hover:bg-[#2E86AB]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-[#5C5C5C]"
        >
          <span className="text-lg leading-none select-none">+</span>
        </button>
      </div>
    </div>
  )
}

interface Step3CharacteristicsProps {
  value: Partial<WizardFormData>
  onChange: (field: string, val: number | undefined) => void
  propertyType: PropertyType
}

export default function Step3Characteristics({ value, onChange, propertyType }: Step3CharacteristicsProps) {
  const isAppartement = propertyType === 'appartement'
  const isVilla = propertyType === 'villa'
  const yearBuilt = value.yearBuilt ?? 1990

  return (
    <div>
      <h2 className="text-2xl font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] mb-2">
        Caractéristiques du bien
      </h2>
      <p className="text-[#9B9B9B] font-[family-name:var(--font-open-sans)] mb-8">
        Ces informations permettent d&apos;affiner votre estimation.
      </p>

      <div className="bg-white rounded-xl border border-gray-100 px-4 mb-4">
        <Stepper
          label={propertyType === 'terrain' ? "Surface terrain" : "Surface"}
          value={value.surface}
          onChange={(v) => onChange('surface', v)}
          min={10}
          max={9999}
          unit="m²"
        />
        {propertyType !== 'terrain' && (
          <>
            <Stepper
              label="Nombre de pièces"
              value={value.rooms}
              onChange={(v) => onChange('rooms', v)}
              min={1}
              max={20}
            />
            <Stepper
              label="Nombre de chambres"
              value={value.bedrooms}
              onChange={(v) => onChange('bedrooms', v)}
              min={0}
              max={15}
            />
          </>
        )}
      </div>

      <AnimatePresence>
        {isAppartement && (
          <motion.div
            key="appartement-fields"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl border border-gray-100 px-4 mb-4"
          >
            <Stepper
              label="Étage"
              value={value.floor}
              onChange={(v) => onChange('floor', v)}
              min={0}
              max={30}
              optional
            />
            <Stepper
              label="Nombre d'étages total"
              value={value.totalFloors}
              onChange={(v) => onChange('totalFloors', v)}
              min={1}
              max={50}
              optional
            />
          </motion.div>
        )}

        {isVilla && (
          <motion.div
            key="villa-fields"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl border border-gray-100 px-4 mb-4"
          >
            <Stepper
              label="Surface terrain"
              value={value.landSurface}
              onChange={(v) => onChange('landSurface', v)}
              min={0}
              max={10000}
              step={50}
              unit="m²"
              optional
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Year built slider */}
      {propertyType !== 'terrain' && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-[family-name:var(--font-open-sans)] text-[#5C5C5C] font-medium">
            Année de construction{' '}
            <span className="text-[#9B9B9B] font-normal text-xs">(optionnel)</span>
          </span>
          <span className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-sm">
            {yearBuilt}
          </span>
        </div>
        <input
          type="range"
          min={1900}
          max={2026}
          value={yearBuilt}
          onChange={(e) => onChange('yearBuilt', parseInt(e.target.value, 10))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#2E86AB] bg-gray-200"
          aria-label="Année de construction"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-[#9B9B9B]">1900</span>
          </div>
        </div>
      )}
    </div>
  )
}
