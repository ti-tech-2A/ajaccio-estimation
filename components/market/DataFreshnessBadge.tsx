import React from 'react'
import { DVF_LAST_UPDATE, DVF_LAST_UPDATE_LABEL, DVF_NEXT_UPDATE_LABEL } from '@/lib/constants'

type DataFreshnessBadgeVariant = 'inline' | 'badge'

interface DataFreshnessBadgeProps {
  variant?: DataFreshnessBadgeVariant
  showNextUpdate?: boolean
}

export function DataFreshnessBadge({
  variant = 'inline',
  showNextUpdate = true,
}: DataFreshnessBadgeProps) {
  const content = (
    <>
      Données DVF actualisées au{' '}
      <time dateTime={DVF_LAST_UPDATE}>{DVF_LAST_UPDATE_LABEL}</time>
      {showNextUpdate && (
        <> — prochaine mise à jour : {DVF_NEXT_UPDATE_LABEL}</>
      )}
    </>
  )

  if (variant === 'badge') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6EEF5] text-[#1B4F72] text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]" aria-hidden="true" />
        {content}
      </span>
    )
  }

  return (
    <p className="text-sm text-[#9B9B9B]">
      {content}
    </p>
  )
}
