'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

interface PhotoItem {
  src: string
  alt: string
  label: string
  span?: 'tall' | 'wide' | 'normal'
}

const photos: PhotoItem[] = [
  {
    src: '/ajaccio-aerien.jpg',
    alt: "Vue aérienne d'Ajaccio",
    label: "Ajaccio vue du ciel",
    span: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80',
    alt: 'Villa de luxe avec piscine sur la route des Sanguinaires, Ajaccio',
    label: 'Villas Sanguinaires',
  },
  {
    src: '/photos/angelo-ajaccio.jpg',
    alt: "Téléporté Angelo Ajaccio",
    label: "Téléporté Angelo Ajaccio",
  },
  {
    src: 'https://images.unsplash.com/photo-1598115663737-142f361427c5?auto=format&fit=crop&q=80&w=1200',
    alt: "Ajaccio vieille ville, Corse",
    label: "Ajaccio vieille ville",
    span: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80',
    alt: 'Aspretto et Campo dell\'Oro, quartier résidentiel sud d\'Ajaccio',
    label: 'Aspretto',
  },
]

export default function PhotoGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header — asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 mb-14 items-end">
          <div>
            <p className="text-[#C9A96E] text-sm tracking-[0.15em] uppercase font-semibold mb-3">
              Ajaccio, Corse
            </p>
            <h2
              style={{ fontFamily: 'var(--font-poppins)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#0F2A4A', lineHeight: '1.1' }}
            >
              Un marché unique
              <br />
              en Méditerranée
            </h2>
          </div>
          <p className="text-[#4A5568] font-[family-name:var(--font-dm-sans)] leading-relaxed md:max-w-lg md:ml-auto">
            Contrairement aux marchés continentaux, Ajaccio combine rareté foncière insulaire, dynamique touristique et demande résidentielle locale soutenue — créant un micro-marché à part entière avec ses propres lois d&apos;évaluation.
          </p>
        </div>

        {/* Mosaic grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-3 h-[480px] md:h-[560px]"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {/* Photo 0 — tall left */}
          <motion.div
            className="relative overflow-hidden rounded-2xl row-span-2 group cursor-pointer"
            variants={{ hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }}
          >
            <Image
              src={photos[0].src}
              alt={photos[0].alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A4A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <span
                className="text-white font-[family-name:var(--font-dm-sans)] font-medium"
                style={{ fontSize: '13px' }}
              >
                {photos[0].label}
              </span>
            </div>
          </motion.div>

          {/* Photos 1, 2 — top right */}
          {[photos[1], photos[2]].map((photo) => (
            <motion.div
              key={photo.label}
              className="relative overflow-hidden rounded-2xl group cursor-pointer"
              variants={{ hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A4A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span
                  className="text-white font-[family-name:var(--font-dm-sans)] font-medium"
                  style={{ fontSize: '12px' }}
                >
                  {photo.label}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Photo 3 — wide bottom center */}
          <motion.div
            className="relative overflow-hidden rounded-2xl col-span-1 md:col-span-2 group cursor-pointer"
            variants={{ hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }}
          >
            <Image
              src={photos[3].src}
              alt={photos[3].alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 66vw"
              className="transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A4A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <span
                className="text-white font-[family-name:var(--font-dm-sans)] font-medium"
                style={{ fontSize: '13px' }}
              >
                {photos[3].label}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom tagline */}
        <p className="mt-8 text-center text-[#5E6E7E] text-sm font-[family-name:var(--font-dm-sans)] italic">
          Chaque secteur a ses propres dynamiques de prix — notre outil IA analyse les données par quartier, par rue, par adresse, par résidence.
        </p>
      </div>
    </section>
  )
}
