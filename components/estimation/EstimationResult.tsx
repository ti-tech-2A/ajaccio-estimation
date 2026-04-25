'use client'

import { motion } from 'framer-motion'
import { CircleAlert } from 'lucide-react'
import Link from 'next/link'
import { PrecisionIndicator } from '@/components/estimation/PrecisionIndicator'
import { DataFreshnessBadge } from '@/components/market/DataFreshnessBadge'
import { Button } from '@/components/ui/Button'
import type { EstimationResult as EstimationResultType } from '@/types/estimation'

interface EstimationResultProps {
  result: EstimationResultType
  postalCode: string
  onRequestCallback: () => void
}

function formatPrice(value: number): string {
  return value.toLocaleString('fr-FR')
}

export default function EstimationResult({
  result,
  postalCode,
  onRequestCallback,
}: EstimationResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-live="polite"
    >
      {result.precisionLevel === 0 ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-[#C0392B]/10 flex items-center justify-center mx-auto mb-4">
            <CircleAlert className="w-8 h-8 text-[#C0392B]" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-[family-name:var(--font-poppins)] font-semibold text-[#C0392B] mb-3">
            Donnees insuffisantes pour votre secteur
          </h3>
          <p className="text-[#5C5C5C] font-[family-name:var(--font-open-sans)] mb-6">
            Nous ne disposons pas encore de suffisamment de transactions recentes dans votre secteur
            pour produire une estimation fiable.
          </p>
          <PrecisionIndicator level={0} comparableCount={0} showLabel />
          <div className="mt-6">
            <Button variant="prestige" onClick={onRequestCallback}>
              Etre rappele par notre expert
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-8">
            <p className="text-sm font-[family-name:var(--font-open-sans)] text-[#9B9B9B] mb-3">
              Estimation de votre bien
            </p>
            <p className="text-4xl md:text-5xl font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] leading-tight">
              {formatPrice(result.priceLow)} EUR{' '}
              <span className="text-[#9B9B9B] font-normal">-</span>{' '}
              {formatPrice(result.priceHigh)} EUR
            </p>
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              <span className="bg-[#2E86AB] text-white px-3 py-1 rounded-full text-sm font-semibold font-[family-name:var(--font-open-sans)]">
                ~{formatPrice(result.priceMedianSqm)} EUR/m2
              </span>
            </div>
          </div>

          <div className="bg-[#FAF5EC] rounded-xl p-4 mb-6 space-y-3">
            <PrecisionIndicator
              level={result.precisionLevel}
              comparableCount={result.comparableCount}
              showLabel
            />
            <DataFreshnessBadge variant="inline" showNextUpdate={false} />
          </div>

          <p className="text-sm italic text-[#9B9B9B] mt-4 font-[family-name:var(--font-open-sans)]">
            Estimation indicative basee sur les donnees DVF. Pour une evaluation precise, faites
            appel a notre expert local.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="prestige" onClick={onRequestCallback}>
              Affiner avec un expert
            </Button>
            <Link href={`/marche/${postalCode}`}>
              <Button variant="outline">
                Voir les donnees de votre secteur
              </Button>
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  )
}
