'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, animate } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { MARKET_HIGHLIGHTS } from '@/data/market-highlights'
import type { DvfTransaction } from '@/data/market-data'

const CARD_WIDTH = 288 + 16 // w-72 = 288px + gap-4 = 16px

const highlightImagesByPostalCode: Record<string, string> = {
  '20000': 'https://images.unsplash.com/photo-1574170609512-ef0a2c20baf5?w=800&q=80',
  '20090': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  '20167': 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
}

function getImageForTransaction(t: DvfTransaction, postalCode: string): string {
  const highlight = MARKET_HIGHLIGHTS.find(
    (h) => h.postalCode === postalCode && h.propertyType === t.type
  )
  return highlight?.imageUrl ?? highlightImagesByPostalCode[postalCode] ?? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
}

interface TransactionCardProps {
  transaction: DvfTransaction
  postalCode: string
  index: number
}

function TransactionCard({ transaction: t, postalCode, index }: TransactionCardProps) {
  const imageUrl = getImageForTransaction(t, postalCode)

  return (
    <div
      key={index}
      className="w-72 flex-shrink-0 bg-white rounded-xl shadow-sm p-4 select-none"
    >
      <div className="relative w-full h-36 rounded-lg overflow-hidden mb-3">
        <Image
          src={imageUrl}
          alt={`${t.type} ${t.surface} m² — ${t.street}`}
          fill
          loading="lazy"
          className="object-cover"
          sizes="288px"
        />
      </div>
      <div className="flex gap-2 mb-2">
        <Badge variant="neutral" size="sm">{postalCode}</Badge>
        <Badge variant={t.type === 'appartement' ? 'apartment' : 'villa'} size="sm">
          {t.type === 'appartement' ? 'Appartement' : 'Villa'}
        </Badge>
      </div>
      <p className="text-xs text-[#9B9B9B] mb-1">{t.street}</p>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-[#5C5C5C]">{t.surface} m²</span>
        <span className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72]">
          {t.price.toLocaleString('fr-FR')} €
        </span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-[#9B9B9B]">{t.date}</span>
        <span className="text-xs text-[#9B9B9B]">
          {t.pricePerSqm.toLocaleString('fr-FR')} €/m²
        </span>
      </div>
    </div>
  )
}

interface TransactionsCarouselProps {
  transactions: DvfTransaction[]
  postalCode: string
}

export function TransactionsCarousel({ transactions, postalCode }: TransactionsCarouselProps) {
  const items = [...transactions, ...transactions]
  const dragX = useMotionValue(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const maxDrag = -CARD_WIDTH * transactions.length

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      const current = dragX.get()
      const next = current - CARD_WIDTH
      if (next <= maxDrag) {
        animate(dragX, 0, { duration: 0.4, ease: 'easeInOut' })
      } else {
        animate(dragX, next, { duration: 0.6, ease: 'easeInOut' })
      }
    }, 4000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, dragX, maxDrag])

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: maxDrag, right: 0 }}
        className="flex gap-4 pb-2"
        style={{ x: dragX }}
      >
        {items.map((t, i) => (
          <TransactionCard
            key={`${t.id}-${i}`}
            transaction={t}
            postalCode={postalCode}
            index={i}
          />
        ))}
      </motion.div>
    </div>
  )
}
