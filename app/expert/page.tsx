'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { JsonLd } from '@/components/ui/JsonLd'
import { Badge } from '@/components/ui/Badge'
import { TESTIMONIALS, type Testimonial } from '@/data/site-metadata'
import { fadeUp, staggerContainer } from '@/lib/motion'
import ExpertSection from '@/components/home/ExpertSection'

// ── Schema.org ──────────────────────────────────────────────────────────────
const agentSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: '[Prénom Nom]',
  description: 'Mandataire Safti à Ajaccio depuis 25 ans.',
  areaServed: {
    '@type': 'City',
    name: 'Ajaccio',
    postalCode: ['20000', '20090', '20167'],
  },
  telephone: '+33XXXXXXXXX',
  email: 'contact@ajaccio-estimation.fr',
  url: 'https://ajaccio-estimation.fr/expert',
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return (parts[0][0] ?? '').toUpperCase()
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-2" aria-label={`Note : ${rating} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-[#C9A96E]' : 'text-[#9B9B9B]/30'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  )
}


// ── Testimonial card (wider, full content) ────────────────────────────────────
function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = getInitials(t.author)
  return (
    <div className="bg-white rounded-[16px] shadow-sm p-6 min-w-[380px] flex-shrink-0 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#2E86AB] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1B4F72] font-[family-name:var(--font-poppins)]">
            {t.author}, {t.age} ans
          </p>
          <p className="text-xs text-[#9B9B9B]">
            {t.sector} — {t.postalCode}
          </p>
        </div>
      </div>
      <StarRating rating={t.rating} />
      <p className="text-sm text-[#5C5C5C] italic leading-relaxed font-[family-name:var(--font-open-sans)]">
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="flex items-center gap-2 flex-wrap mt-auto pt-2 border-t border-gray-100">
        <Badge variant={t.propertyType === 'appartement' ? 'apartment' : 'villa'} size="sm">
          {t.propertyType === 'appartement' ? 'Appartement' : 'Villa'}
        </Badge>
        <span className="text-xs text-[#27AE60] font-medium">{t.outcome}</span>
      </div>
    </div>
  )
}

// ── Drag carousel ─────────────────────────────────────────────────────────────
function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const duplicated = [...testimonials, ...testimonials]
  return (
    <motion.div
      className="flex gap-6 cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ right: 0, left: -(duplicated.length / 2) * 400 }}
      whileTap={{ cursor: 'grabbing' }}
    >
      {duplicated.map((t, i) => (
        <TestimonialCard key={`${t.id}-${i}`} t={t} />
      ))}
    </motion.div>
  )
}

// ── Form state & types ────────────────────────────────────────────────────────
interface FormState {
  fullName: string
  phone: string
  slot: string
  days: string[]
  message: string
}

interface FormErrors {
  fullName?: string
  phone?: string
  slot?: string
  days?: string
  message?: string
}

const SLOTS = ['Matin', 'Après-midi', 'Indifférent']
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

const INITIAL_FORM: FormState = {
  fullName: '',
  phone: '',
  slot: '',
  days: [],
  message: '',
}

function mapSlotToApi(slot: string): 'morning' | 'afternoon' | 'any' {
  if (slot === 'Matin') return 'morning'
  if (slot.includes('Apr')) return 'afternoon'
  return 'any'
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ExpertPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submittedData, setSubmittedData] = useState<FormState | null>(null)



  const testiRef = useRef(null)
  const testiInView = useInView(testiRef, { once: true, amount: 0.2 })

  const formRef = useRef(null)
  const formInView = useInView(formRef, { once: true, amount: 0.15 })

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Le nom est requis.'
    if (!form.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis.'
    } else if (!/^(\+33|0)[67]\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro mobile invalide (ex: 06 XX XX XX XX).'
    }
    if (!form.slot) newErrors.slot = 'Veuillez choisir un créneau.'
    if (form.days.length === 0) newErrors.days = 'Veuillez sélectionner au moins un jour.'
    if (form.message.length > 500) newErrors.message = 'Message limité à 500 caractères.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName,
          phone: form.phone,
          message: form.message,
          source_page: '/expert',
          preferred_time_slot: mapSlotToApi(form.slot),
          preferred_days: form.days,
        }),
      })

      if (!response.ok) {
        throw new Error('api_error')
      }

      setSubmittedData({ ...form })
      setSubmitted(true)
    } catch {
      setSubmitError('Impossible d\'envoyer votre demande pour le moment. Merci de reessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM)
    setErrors({})
    setSubmitError(null)
    setSubmittedData(null)
    setSubmitted(false)
  }

  function toggleDay(day: string) {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }))
  }

  return (
    <>
      <JsonLd schema={agentSchema} />

      <ExpertSection />

      {/* ── Section 4 — Témoignages ── */}
      <section className="py-20 bg-[#FAF5EC] overflow-hidden" ref={testiRef}>
        <div className="max-w-5xl mx-auto px-6 mb-10">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={testiInView ? 'visible' : 'hidden'}
            className="font-[family-name:var(--font-poppins)] font-bold text-2xl md:text-3xl text-[#1B4F72] mb-2"
          >
            Témoignages détaillés
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={testiInView ? 'visible' : 'hidden'}
            className="text-[#9B9B9B] text-sm"
          >
            Glissez pour voir plus
          </motion.p>
        </div>
        <div className="pl-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] overflow-hidden">
          <TestimonialCarousel testimonials={TESTIMONIALS.slice(0, 5)} />
        </div>
      </section>

      {/* ── Section 5 — CTA ── */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-poppins)] font-bold text-2xl text-[#1B4F72] mb-4">
            Commencez par une estimation gratuite
          </h2>
          <p className="font-[family-name:var(--font-open-sans)] text-[#5C5C5C] mb-8">
            En 3 minutes, obtenez une fourchette basée sur les données DVF de votre secteur
            exact — sans engagement.
          </p>
          <Link href="/estimer" tabIndex={-1}>
            <Button variant="prestige" size="lg">
              Estimer mon bien gratuitement
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Section 6 — Formulaire de rappel ── */}
      <section id="contact-form" className="py-20 bg-[#FAF5EC]" ref={formRef}>
        <div className="max-w-xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={formInView ? 'visible' : 'hidden'}
          >
            <h2 className="font-[family-name:var(--font-poppins)] font-bold text-2xl text-[#1B4F72] mb-2">
              Demander un rappel téléphonique
            </h2>
            <p className="font-[family-name:var(--font-open-sans)] text-[#5C5C5C] mb-8 text-sm">
              L&apos;expert vous rappelle sous 24h au créneau de votre choix.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {submitted && submittedData ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100"
              >
                <CheckCircle size={64} className="text-[#27AE60] mx-auto mb-4" />
                <h3 className="font-[family-name:var(--font-poppins)] font-bold text-xl text-[#1B4F72] mb-2">
                  Votre demande a été transmise.
                </h3>
                <p className="font-[family-name:var(--font-open-sans)] text-[#5C5C5C] mb-6">
                  Notre expert vous rappelle sous 24h.
                </p>
                <div className="text-left bg-[#FAF5EC] rounded-xl p-4 mb-6 text-sm space-y-2">
                  <p>
                    <span className="text-[#9B9B9B]">Nom :</span>{' '}
                    <span className="text-[#1B4F72] font-medium">{submittedData.fullName}</span>
                  </p>
                  <p>
                    <span className="text-[#9B9B9B]">Téléphone :</span>{' '}
                    <span className="text-[#1B4F72] font-medium">{submittedData.phone}</span>
                  </p>
                  <p>
                    <span className="text-[#9B9B9B]">Créneau :</span>{' '}
                    <span className="text-[#1B4F72] font-medium">{submittedData.slot}</span>
                  </p>
                  <p>
                    <span className="text-[#9B9B9B]">Jours :</span>{' '}
                    <span className="text-[#1B4F72] font-medium">
                      {submittedData.days.join(', ')}
                    </span>
                  </p>
                  {submittedData.message && (
                    <p>
                      <span className="text-[#9B9B9B]">Message :</span>{' '}
                      <span className="text-[#1B4F72] font-medium">{submittedData.message}</span>
                    </p>
                  )}
                </div>
                <Button variant="outline" onClick={resetForm}>
                  Nouvelle demande
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Nom */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-[#1B4F72] font-[family-name:var(--font-poppins)] mb-1.5"
                  >
                    Nom complet <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    className={[
                      'w-full rounded-lg border px-4 py-2.5 text-sm text-[#5C5C5C] outline-none transition-colors',
                      'focus:ring-2 focus:ring-[#2E86AB]/30 focus:border-[#2E86AB]',
                      errors.fullName ? 'border-[#C0392B]' : 'border-gray-200',
                    ].join(' ')}
                    placeholder="Marie Dupont"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-[#C0392B] mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-[#1B4F72] font-[family-name:var(--font-poppins)] mb-1.5"
                  >
                    Téléphone mobile <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className={[
                      'w-full rounded-lg border px-4 py-2.5 text-sm text-[#5C5C5C] outline-none transition-colors',
                      'focus:ring-2 focus:ring-[#2E86AB]/30 focus:border-[#2E86AB]',
                      errors.phone ? 'border-[#C0392B]' : 'border-gray-200',
                    ].join(' ')}
                    placeholder="06 XX XX XX XX"
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#C0392B] mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Créneau */}
                <div>
                  <p className="block text-sm font-semibold text-[#1B4F72] font-[family-name:var(--font-poppins)] mb-2">
                    Créneau préféré <span className="text-[#C0392B]">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, slot }))}
                        className={[
                          'rounded-full px-4 py-1.5 text-sm border transition-colors cursor-pointer',
                          form.slot === slot
                            ? 'bg-[#1B4F72] text-white border-[#1B4F72]'
                            : 'bg-white text-[#5C5C5C] border-gray-200 hover:border-[#2E86AB]',
                        ].join(' ')}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {errors.slot && (
                    <p className="text-xs text-[#C0392B] mt-1">{errors.slot}</p>
                  )}
                </div>

                {/* Jours */}
                <div>
                  <p className="block text-sm font-semibold text-[#1B4F72] font-[family-name:var(--font-poppins)] mb-2">
                    Jours préférés <span className="text-[#C0392B]">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={[
                          'rounded-full px-4 py-1.5 text-sm border transition-colors cursor-pointer',
                          form.days.includes(day)
                            ? 'bg-[#1B4F72] text-white border-[#1B4F72]'
                            : 'bg-white text-[#5C5C5C] border-gray-200 hover:border-[#2E86AB]',
                        ].join(' ')}
                        aria-pressed={form.days.includes(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  {errors.days && (
                    <p className="text-xs text-[#C0392B] mt-1">{errors.days}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-[#1B4F72] font-[family-name:var(--font-poppins)] mb-1.5"
                  >
                    Message{' '}
                    <span className="text-[#9B9B9B] font-normal">(facultatif)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    maxLength={500}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className={[
                      'w-full rounded-lg border px-4 py-2.5 text-sm text-[#5C5C5C] outline-none transition-colors resize-none',
                      'focus:ring-2 focus:ring-[#2E86AB]/30 focus:border-[#2E86AB]',
                      errors.message ? 'border-[#C0392B]' : 'border-gray-200',
                    ].join(' ')}
                    placeholder="Précisez votre situation si vous le souhaitez..."
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.message ? (
                      <p className="text-xs text-[#C0392B]">{errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <span
                      className={[
                        'text-xs',
                        form.message.length > 480 ? 'text-[#C0392B]' : 'text-[#9B9B9B]',
                      ].join(' ')}
                    >
                      {form.message.length}/500
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isLoading}
                >
                  Envoyer ma demande de rappel
                </Button>
                {submitError && (
                  <p className="text-xs text-[#C0392B] text-center">{submitError}</p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
