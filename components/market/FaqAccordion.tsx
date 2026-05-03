'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'
import type { FaqItem } from '@/data/sector-content/types'

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-[#FAF5EC] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E86AB] focus-visible:ring-inset"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
            >
              <HelpCircle
                size={18}
                className="shrink-0 text-[#2E86AB] mt-0.5"
                aria-hidden="true"
              />
              <span className="flex-1 font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-sm leading-snug">
                {item.question}
              </span>
              <span className="shrink-0 text-[#2E86AB] mt-0.5" aria-hidden="true">
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pl-12 text-sm text-[#5C5C5C] leading-relaxed font-[family-name:var(--font-open-sans)]">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
