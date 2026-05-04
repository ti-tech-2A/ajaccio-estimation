'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { ArticleTeaser } from '@/types/wp'

interface ArticleCardProps {
  article: ArticleTeaser
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
}

const NAMED_COLORS: Record<string, { bg: string; text: string }> = {
  'Marché Immobilier':      { bg: '#C9A96E', text: '#0F2A4A' },
  'Fiscalité & Patrimoine': { bg: '#0F2A4A', text: '#ffffff' },
  'Vendre Intelligemment':  { bg: '#5E6E7E', text: '#ffffff' },
  'Analyses':               { bg: '#EDE8DE', text: '#0F2A4A' },
  'Conseils':               { bg: '#E8EDF4', text: '#0F2A4A' },
}

const FALLBACK_PALETTE = [
  { bg: '#C9A96E', text: '#0F2A4A' },
  { bg: '#0F2A4A', text: '#ffffff' },
  { bg: '#5E6E7E', text: '#ffffff' },
  { bg: '#EDE8DE', text: '#0F2A4A' },
] as const

function categoryColor(name: string): { bg: string; text: string } {
  if (NAMED_COLORS[name]) return NAMED_COLORS[name]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length]
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const color = article.category ? categoryColor(article.category) : null

  return (
    <motion.a
      variants={fadeInUp}
      href={article.link}
      target="_blank"
      rel="noopener"
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-[#EDE8DE] shadow-[0_8px_24px_-12px_rgba(15,42,74,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_rgba(15,42,74,0.28)]"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE8DE]">
        {article.image ? (
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 23vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2A4A] to-[#1a3a5e]" aria-hidden="true" />
        )}
      </div>

      {/* Title + VEC tag below */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <h3
          className="line-clamp-3 text-[#0F2A4A] group-hover:text-[#1a3a5e]"
          style={{
            fontFamily: 'var(--font-poppins)',
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
          }}
        >
          {article.title}
        </h3>

        {color && article.category && (
          <div className="mt-auto flex items-center gap-2">
            <span
              className="rounded px-1.5 py-0.5 font-[family-name:var(--font-poppins)] font-bold"
              style={{
                backgroundColor: color.bg,
                color: color.text,
                fontSize: '9px',
                letterSpacing: '0.06em',
              }}
            >
              VEC
            </span>
            <span
              className="font-[family-name:var(--font-dm-sans)] font-medium"
              style={{
                color: color.bg,
                fontSize: '11px',
                letterSpacing: '0.02em',
              }}
            >
              {article.category}
            </span>
          </div>
        )}
      </div>
    </motion.a>
  )
}
