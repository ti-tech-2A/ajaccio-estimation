'use client'

import { motion } from 'framer-motion'
import { Building2, Home, Warehouse, Map } from 'lucide-react'
import { scaleIn, staggerContainer } from '@/lib/motion'
import type { PropertyType } from '@/types/estimation'

interface Step1PropertyTypeProps {
  value: PropertyType | undefined
  onChange: (v: PropertyType) => void
}

const PROPERTY_OPTIONS: { value: PropertyType; label: string; Icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { value: 'appartement', label: 'Appartement', Icon: Building2 },
  { value: 'villa', label: 'Villa', Icon: Home },
  { value: 'terrain', label: 'Terrain', Icon: Map },
]

export default function Step1PropertyType({ value, onChange }: Step1PropertyTypeProps) {
  return (
    <div>
      <h2 className="text-2xl font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] mb-2">
        Quel type de bien souhaitez-vous estimer ?
      </h2>
      <p className="text-[#666666] font-[family-name:var(--font-open-sans)] mb-8">
        Sélectionnez le type de votre propriété à Ajaccio.
      </p>

      <motion.div
        className="grid grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {PROPERTY_OPTIONS.map(({ value: optionValue, label, Icon }) => {
          const isActive = value === optionValue
          return (
            <motion.div
              key={optionValue}
              variants={scaleIn}
              onClick={() => onChange(optionValue)}
              className={[
                'cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center gap-3 transition-all',
                isActive
                  ? 'border-[#2E86AB] bg-[#D6EEF5]'
                  : 'border-gray-200 bg-white hover:border-[#2E86AB]/50',
              ].join(' ')}
              role="button"
              aria-pressed={isActive}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onChange(optionValue)
                }
              }}
            >
              <Icon
                size={40}
                color={isActive ? '#2E86AB' : '#666666'}
              />
              <span
                className={[
                  'font-[family-name:var(--font-poppins)] font-semibold text-sm text-center',
                  isActive ? 'text-[#1B4F72]' : 'text-[#5C5C5C]',
                ].join(' ')}
              >
                {label}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
