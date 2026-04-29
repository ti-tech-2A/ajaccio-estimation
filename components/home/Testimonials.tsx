'use client'

import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Star } from 'lucide-react'
import { TESTIMONIALS, type Testimonial } from '@/data/site-metadata'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="mb-3 flex gap-0.5" aria-label={`Note : ${rating} sur 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < rating
        return (
          <Star
            key={index}
            size={14}
            className={active ? 'text-[#C9A96E]' : 'text-[#C9A96E]/22'}
            fill={active ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = getInitials(testimonial.author)

  return (
    <article className="w-[370px] flex-shrink-0 rounded-2xl border border-[#E2DBCF] bg-white p-6 shadow-[0_18px_50px_-40px_rgba(15,42,74,0.55)]">
      <p className="text-4xl font-bold leading-none text-[#C9A96E]/18" aria-hidden="true">
        &quot;
      </p>

      <StarRating rating={testimonial.rating} />

      <p className="line-clamp-4 text-sm leading-relaxed text-[#4A5568]">{testimonial.content}</p>

      <div className="mt-5 flex items-center gap-3 border-t border-[#EFE8DD] pt-4">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#08162A] text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold text-[#0F2A4A]">
            {testimonial.author}
          </span>
          <span className="block truncate text-xs text-[#5E6E7E]">
            {testimonial.sector} - {testimonial.postalCode}
          </span>
        </span>
        <span className="ml-auto text-xs font-semibold text-[#C9A96E]">
          {testimonial.propertyType === 'appartement' ? 'Appt.' : 'Villa'}
        </span>
      </div>
    </article>
  )
}

interface MarqueeRowProps {
  testimonials: Testimonial[]
  direction: 'normal' | 'reverse'
  paused: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function MarqueeRow({
  testimonials,
  direction,
  paused,
  onMouseEnter,
  onMouseLeave,
}: MarqueeRowProps) {
  const reduceMotion = useReducedMotion()
  const animationName = direction === 'normal' ? 'marquee' : 'marquee-reverse'
  const repeated = [...testimonials, ...testimonials]

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
    >
      <div
        className="flex w-max gap-5 py-1"
        style={{
          animation: reduceMotion ? 'none' : `${animationName} 48s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {repeated.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [paused, setPaused] = useState(false)
  const firstRow = TESTIMONIALS.slice(0, 4)
  const secondRow = TESTIMONIALS.slice(4, 8)

  return (
    <section className="relative overflow-hidden bg-[#F7F2EA] py-24">
      <div className="mx-auto mb-12 flex max-w-6xl flex-col gap-4 px-6 lg:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C9A96E]">
            Avis vérifiés
          </p>
          <h2
            className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.03] tracking-[-0.03em] text-[#0F2A4A]"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            La confiance du terrain
          </h2>
        </div>
        <p className="text-sm text-[#4A5568] md:text-right">
          8 témoignages clients analytiques
          <br />
          <span className="font-semibold text-[#0F2A4A]">Note moyenne : 4,9 / 5</span>
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <MarqueeRow
          testimonials={firstRow}
          direction="normal"
          paused={paused}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        />
        <MarqueeRow
          testimonials={secondRow}
          direction="reverse"
          paused={paused}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        />
      </div>

      <p className="mt-7 text-center text-xs text-[#5E6E7E]">Survolez ou naviguez au clavier pour mettre en pause</p>
    </section>
  )
}
