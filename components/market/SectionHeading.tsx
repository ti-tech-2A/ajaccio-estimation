import React from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'primary' | 'gold'
  id?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'primary',
  id,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  const eyebrowColor = tone === 'gold' ? 'text-[#C9A96E]' : 'text-[#2E86AB]'
  const accentBg = tone === 'gold' ? 'bg-[#C9A96E]' : 'bg-[#2E86AB]'

  return (
    <div className={`flex flex-col gap-3 ${alignClass} max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 ${align === 'center' ? 'mx-auto' : ''}`}
        >
          <span
            className={`inline-block w-8 h-0.5 ${accentBg} rounded-full`}
            aria-hidden="true"
          />
          <span
            className={`text-xs font-semibold uppercase tracking-[0.15em] ${eyebrowColor}`}
          >
            {eyebrow}
          </span>
          <span
            className={`inline-block w-8 h-0.5 ${accentBg} rounded-full ${align === 'center' ? '' : 'hidden'}`}
            aria-hidden="true"
          />
        </div>
      )}
      <h2
        id={id}
        className="font-[family-name:var(--font-poppins)] text-2xl md:text-[28px] font-bold text-[#1B4F72] leading-tight tracking-tight"
      >
        {title}
      </h2>
      {description && (
        <p className="text-[15px] leading-relaxed text-[#5C5C5C] font-[family-name:var(--font-open-sans)]">
          {description}
        </p>
      )}
    </div>
  )
}
