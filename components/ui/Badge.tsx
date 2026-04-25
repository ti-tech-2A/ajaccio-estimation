import React from 'react'

export type BadgeVariant = 'apartment' | 'villa' | 'prestige' | 'up' | 'down' | 'neutral'
export type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  apartment: {
    bg: 'bg-[#D6EEF5]',
    text: 'text-[#1B4F72]',
    dot: 'bg-[#2E86AB]',
  },
  villa: {
    bg: 'bg-[#A3B18A]/30',
    text: 'text-[#4A5C3F]',
    dot: 'bg-[#6B7F55]',
  },
  prestige: {
    bg: 'bg-[#F5ECD7]',
    text: 'text-[#C9A96E]',
    dot: 'bg-[#C9A96E]',
  },
  up: {
    bg: 'bg-[#27AE60]/15',
    text: 'text-[#1e8449]',
    dot: 'bg-[#27AE60]',
  },
  down: {
    bg: 'bg-[#C0392B]/15',
    text: 'text-[#C0392B]',
    dot: 'bg-[#C0392B]',
  },
  neutral: {
    bg: 'bg-[#9B9B9B]/20',
    text: 'text-[#5C5C5C]',
    dot: 'bg-[#9B9B9B]',
  },
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  const { bg, text, dot: dotColor } = variantClasses[variant]

  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        bg,
        text,
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          className={['rounded-full shrink-0', dotColor, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'].join(' ')}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
