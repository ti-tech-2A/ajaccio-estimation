'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'Données DVF actualisées au 1er mai 2026 — Prix au m² par secteur',
  'Estimation gratuite en 3 minutes — Sans engagement, résultat immédiat',
  'Mandataire Safti à Ajaccio depuis 25 ans — 300+ biens estimés',
]

const STORAGE_KEY = 'announcement_bar_dismissed'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      setVisible(true)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!visible) return

    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MESSAGES.length)
        setFading(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [visible])

  const handleDismiss = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (!mounted) return null

  return (
    <div
      className={[
        'fixed top-0 left-0 right-0 z-50 overflow-hidden',
        'transition-all duration-300',
        visible ? 'h-9' : 'h-0',
      ].join(' ')}
      style={{ backgroundColor: '#0F2A4A' }}
    >
      <div className="h-9 flex items-center justify-center px-10 relative">
        <p
          className="text-white text-center transition-opacity duration-300"
          style={{
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            opacity: fading ? 0 : 1,
          }}
        >
          {MESSAGES[currentIndex]}
        </p>
        <button
          onClick={handleDismiss}
          aria-label="Fermer la barre d'annonce"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-150"
          style={{ fontSize: '16px', lineHeight: 1 }}
        >
          ×
        </button>
      </div>
    </div>
  )
}
