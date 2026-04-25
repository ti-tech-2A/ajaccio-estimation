'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'Vue globale', href: '/marche' },
  { label: '20000 — Centre', href: '/marche/20000' },
  { label: '20090 — Sud', href: '/marche/20090' },
  { label: '20167 — Mezzavia', href: '/marche/20167' },
]

export function MarketTabs() {
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-[57px] z-30 bg-white border-b border-gray-100 shadow-sm"
      aria-label="Navigation marché"
    >
      <div className="max-w-5xl mx-auto px-4 overflow-x-auto flex gap-0 whitespace-nowrap">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                'inline-block px-4 py-3.5 text-sm font-medium transition-colors duration-150 border-b-2',
                isActive
                  ? 'border-[#2E86AB] text-[#2E86AB] font-semibold'
                  : 'border-transparent text-[#9B9B9B] hover:text-[#1B4F72]',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
