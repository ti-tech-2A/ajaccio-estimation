'use client'

import { motion } from 'framer-motion'

interface StepProgressBarProps {
  currentStep: number
  totalSteps: 5
}

export default function StepProgressBar({ currentStep, totalSteps }: StepProgressBarProps) {
  const progress = currentStep / totalSteps

  return (
    <div className="mb-8">
      <p className="text-sm font-[family-name:var(--font-open-sans)] text-[#666666] mb-2">
        Étape {currentStep} sur {totalSteps}
      </p>
      <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: '#C9A96E', transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
