import React from 'react'
import { Lightbulb } from 'lucide-react'

interface SellerAdviceProps {
  advice: string[]
}

export function SellerAdvice({ advice }: SellerAdviceProps) {
  return (
    <section
      className="rounded-2xl bg-gradient-to-br from-[#FAF5EC] to-[#F5ECD7] border border-[#C9A96E]/30 p-6"
      aria-labelledby="seller-advice-title"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="rounded-xl bg-[#C9A96E]/20 p-2 shrink-0" aria-hidden="true">
          <Lightbulb size={18} className="text-[#C9A96E]" />
        </div>
        <div>
          <h2
            id="seller-advice-title"
            className="font-[family-name:var(--font-poppins)] text-lg font-semibold text-[#1B4F72]"
          >
            Conseils d&apos;expert pour bien vendre
          </h2>
          <p className="text-sm text-[#5C5C5C] mt-1 font-[family-name:var(--font-open-sans)]">
            Ce qui fait la différence entre un bien qui se vend au juste prix et un bien qui stagne.
          </p>
        </div>
      </div>

      <ol className="space-y-4">
        {advice.map((item, i) => (
          <li key={i} className="flex gap-3">
            <div
              className="shrink-0 w-7 h-7 rounded-full bg-[#C9A96E] text-white font-[family-name:var(--font-poppins)] font-bold text-sm flex items-center justify-center mt-0.5"
              aria-hidden="true"
            >
              {i + 1}
            </div>
            <p className="text-sm text-[#5C5C5C] leading-relaxed font-[family-name:var(--font-open-sans)]">
              {item}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
