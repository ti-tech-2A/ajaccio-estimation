import React from 'react'

type PrecisionLevel = 0 | 1 | 2 | 3

interface PrecisionIndicatorProps {
  level: PrecisionLevel
  comparableCount: number
  showLabel?: boolean
}

const DOT_COUNT = 3

function getMessage(level: PrecisionLevel, count: number): string {
  switch (level) {
    case 3:
      return `Estimation fiable — basée sur ${count} transactions récentes dans votre secteur`
    case 2:
      return 'Estimation indicative — références disponibles mais limitées'
    case 1:
      return 'Estimation approximative — expertise terrain recommandée'
    case 0:
      return 'Données insuffisantes — notre expert vous contacte sous 24h'
  }
}

export function PrecisionIndicator({
  level,
  comparableCount,
  showLabel = true,
}: PrecisionIndicatorProps) {
  if (level === 0) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-sm text-[#C0392B] font-medium">
          {getMessage(0, comparableCount)}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5" role="img" aria-label={`Niveau de précision ${level} sur 3`}>
        {Array.from({ length: DOT_COUNT }, (_, i) => {
          const filled = i < level
          return (
            <span
              key={i}
              className={[
                'w-3 h-3 rounded-full border-2 transition-colors',
                filled
                  ? 'bg-[#27AE60] border-[#27AE60]'
                  : 'bg-transparent border-[#9B9B9B]',
              ].join(' ')}
            />
          )
        })}
      </div>
      {showLabel && (
        <p className="text-sm text-[#5C5C5C]">
          {getMessage(level, comparableCount)}
        </p>
      )}
    </div>
  )
}
