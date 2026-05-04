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

// 4 color pairs from site palette, consistent per category name
const CATEGORY_PALETTE = [
  { bg: '#FBF5E9', text: '#9A7A3E' }, // gold warm
  { bg: '#E8EDF4', text: '#0F2A4A' }, // navy
  { bg: '#E8F4EE', text: '#1A8754' }, // green
  { bg: '#EDE8DE', text: '#5E6E7E' }, // beige-gray
] as const

function categoryColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length]
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <motion.a
      variants={fadeInUp}
      href={article.link}
      target="_blank"
      rel="noopener"
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-[#EDE8DE] shadow-[0_8px_24px_-12px_rgba(15,42,74,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_rgba(15,42,74,0.28)]"
    >
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

      <div className="flex flex-1 flex-col gap-3 p-5">
        {article.category && (() => {
          const { bg, text } = categoryColor(article.category)
          return (
            <span
              className="self-start rounded-full px-2.5 py-0.5 font-[family-name:var(--font-dm-sans)] font-semibold"
              style={{ backgroundColor: bg, color: text, fontSize: '11px', letterSpacing: '0.03em' }}
            >
              {article.category}
            </span>
          )
        })()}
        <h3
          className="line-clamp-3 text-[#0F2A4A] group-hover:text-[#1a3a5e]"
          style={{
            fontFamily: 'var(--font-poppins)',
            fontSize: '1.0625rem',
            fontWeight: 600,
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
          }}
        >
          {article.title}
        </h3>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1A8754] text-white"
            style={{ fontFamily: 'var(--font-poppins)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.02em' }}
            aria-hidden="true"
          >
            VEC
          </span>
          <span
            className="text-[#4A5568] font-[family-name:var(--font-dm-sans)] font-medium"
            style={{ fontSize: '12px' }}
          >
            Vendre En Corse
          </span>
        </div>
      </div>
    </motion.a>
  )
}
