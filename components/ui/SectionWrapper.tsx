import React from 'react'

type Background = 'surface' | 'white' | 'primary'
type AsElement = 'section' | 'article' | 'div'

interface SectionWrapperProps {
  as?: AsElement
  background?: Background
  maxWidth?: boolean
  className?: string
  children: React.ReactNode
}

const bgClasses: Record<Background, string> = {
  surface: 'bg-[#FAF5EC]',
  white: 'bg-white',
  primary: 'bg-[#1B4F72]',
}

export function SectionWrapper({
  as: Tag = 'section',
  background = 'surface',
  maxWidth = true,
  className = '',
  children,
}: SectionWrapperProps) {
  return (
    <Tag className={[bgClasses[background], 'py-16 md:py-24', className].join(' ')}>
      {maxWidth ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      ) : (
        children
      )}
    </Tag>
  )
}
