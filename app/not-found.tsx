/* eslint-disable react/no-unescaped-entities */

'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1B4F72] flex flex-col items-center justify-center text-center px-4">
      {/* SVG silhouette of a gulf — simple decorative shape in #C9A96E */}
      <svg width="300" height="80" viewBox="0 0 300 80" className="mb-8 opacity-40" aria-hidden="true">
        <path
          d="M0,60 Q30,20 60,40 Q90,60 120,30 Q150,10 180,35 Q210,55 240,25 Q270,5 300,30 L300,80 L0,80 Z"
          fill="#C9A96E"
        />
      </svg>

      {/* Animated 404 */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="font-[family-name:var(--font-poppins)] font-bold text-white"
        style={{ fontSize: 'clamp(80px, 20vw, 180px)' }}
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-white/80 text-xl font-[family-name:var(--font-open-sans)] mb-10 max-w-md"
      >
        Cette page n'existe pas sur notre territoire.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Link href="/">
          <Button variant="prestige" size="lg">Accueil</Button>
        </Link>
        <Link href="/estimer">
          <Button
            variant="outline"
            size="lg"
            className="!border-white !text-white hover:!bg-white/20"
          >
            Estimer mon bien
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
