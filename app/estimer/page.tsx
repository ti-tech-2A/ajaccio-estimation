'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import StepProgressBar from '@/components/estimation/StepProgressBar'
import Step1PropertyType from '@/components/estimation/Step1PropertyType'
import Step2Location from '@/components/estimation/Step2Location'
import Step3Characteristics from '@/components/estimation/Step3Characteristics'
import Step4Features from '@/components/estimation/Step4Features'
import Step5Contact from '@/components/estimation/Step5Contact'
import EstimationResult from '@/components/estimation/EstimationResult'
import type { WizardFormData, EstimationResult as EstimationResultType } from '@/types/estimation'

const SESSION_KEY = 'estimation_wizard_data'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(\+33|0)[67]\d{8}$/

interface StepErrors {
  [key: string]: string
}

function WizardContent() {
  const searchParams = useSearchParams()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<WizardFormData>>(() => {
    // Pre-fill from URL params
    const type = searchParams.get('type')
    const cp = searchParams.get('cp')
    const initial: Partial<WizardFormData> = {}
    if (type === 'appartement' || type === 'villa' || type === 'terrain') {
      initial.propertyType = type
    }
    if (cp === '20000' || cp === '20090' || cp === '20167') {
      initial.postalCode = cp
    }
    initial.features = []
    initial.address = ''
    initial.commune = ''
    initial.surface = 10
    initial.rooms = 1
    initial.bedrooms = 0
    initial.fullName = ''
    initial.email = ''
    initial.phone = ''
    initial.yearBuilt = 1990
    initial.gdprConsent = false
    return initial
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<EstimationResultType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stepErrors, setStepErrors] = useState<StepErrors>({})
  const [showCallbackForm, setShowCallbackForm] = useState(false)
  const [callbackData, setCallbackData] = useState({ name: '', phone: '', message: '' })
  const [callbackSubmitted, setCallbackSubmitted] = useState(false)
  const [callbackLoading, setCallbackLoading] = useState(false)

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WizardFormData>
        setFormData((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // Silently ignore
    }
  }, [])

  // Persist to sessionStorage on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(formData))
    } catch {
      // Silently ignore
    }
  }, [formData])

  function updateField(field: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for updated field
    if (stepErrors[field]) {
      setStepErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function validateStep(step: number): boolean {
    const errors: StepErrors = {}

    if (step === 1) {
      if (!formData.propertyType) {
        errors.propertyType = 'Veuillez sélectionner un type de bien.'
      }
    }

    if (step === 2) {
      if (!formData.postalCode) {
        errors.postalCode = 'Le code postal est requis.'
      }
    }

    if (step === 3) {
      if (!formData.surface || formData.surface < 10) {
        errors.surface = 'La surface doit être d\'au moins 10 m².'
      }
      if (formData.propertyType !== 'terrain') {
        if (!formData.rooms || formData.rooms < 1) {
          errors.rooms = 'Le nombre de pièces doit être d\'au moins 1.'
        }
      }
    }

    if (step === 4) {
      if (formData.propertyType !== 'terrain' && !formData.condition) {
        errors.condition = 'Veuillez sélectionner l\'état du bien.'
      }
    }

    if (step === 5) {
      if (!formData.fullName?.trim()) {
        errors.fullName = 'Le nom complet est requis.'
      }
      if (!formData.email || !EMAIL_REGEX.test(formData.email)) {
        errors.email = 'Veuillez entrer une adresse email valide.'
      }
      if (!formData.phone || !PHONE_REGEX.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = 'Numéro invalide. Format attendu : 06XXXXXXXX ou +336XXXXXXXX'
      }
      if (!formData.gdprConsent) {
        errors.gdprConsent = 'Vous devez accepter les conditions pour continuer.'
      }
    }

    setStepErrors(errors)
    return Object.keys(errors).length === 0
  }

  function nextStep() {
    if (!validateStep(currentStep)) return
    setCurrentStep((s) => Math.min(s + 1, 5))
  }

  function prevStep() {
    setCurrentStep((s) => Math.max(s - 1, 1))
    setStepErrors({})
  }

  async function handleSubmit() {
    if (!validateStep(5)) return

    setIsLoading(true)
    setError(null)

    try {
      const [res] = await Promise.all([
        fetch('/api/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }),
        new Promise<void>((resolve) => setTimeout(resolve, 1500)),
      ])

      if (!res.ok) throw new Error('API error')

      const data = (await res.json()) as EstimationResultType
      setResult(data)
      setShowCallbackForm(data.precisionLevel === 0)
      setCallbackSubmitted(false)
      // Clear session data after successful estimation
      try { sessionStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCallbackSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCallbackLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: callbackData.name,
          phone: callbackData.phone,
          message: callbackData.message,
          source_page: '/estimer',
        }),
      })
      setCallbackSubmitted(true)
    } catch {
      // Silently handle — show success anyway (optimistic)
      setCallbackSubmitted(true)
    } finally {
      setCallbackLoading(false)
    }
  }

  const stepContent = [
    <Step1PropertyType
      key="step1"
      value={formData.propertyType}
      onChange={(v) => updateField('propertyType', v)}
    />,
    <Step2Location
      key="step2"
      value={{ address: formData.address ?? '', postalCode: formData.postalCode ?? '' }}
      onChange={(field, val) => updateField(field, val)}
      errors={stepErrors}
    />,
    <Step3Characteristics
      key="step3"
      value={formData}
      onChange={(field, val) => updateField(field, val)}
      propertyType={formData.propertyType ?? 'appartement'}
    />,
    <Step4Features
      key="step4"
      condition={formData.condition}
      features={formData.features ?? []}
      propertyType={formData.propertyType ?? 'appartement'}
      onConditionChange={(c) => updateField('condition', c)}
      onFeaturesChange={(f) => updateField('features', f)}
    />,
    <Step5Contact
      key="step5"
      value={{
        fullName: formData.fullName ?? '',
        email: formData.email ?? '',
        phone: formData.phone ?? '',
        gdprConsent: formData.gdprConsent ?? false,
      }}
      onChange={(field, val) => updateField(field, val)}
      errors={stepErrors}
    />,
  ]

  return (
    <main
      className="min-h-screen bg-[#FAF5EC] font-[family-name:var(--font-open-sans)]"
      style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
    >
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        {!result && (
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-poppins)] font-bold text-[#1B4F72] mb-3">
              Estimez votre bien à Ajaccio
            </h1>
            <p className="text-[#5C5C5C]">
              Gratuit, immédiat, sans engagement
            </p>
          </div>
        )}

        {/* White card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <EstimationResult
                  result={result}
                  postalCode={formData.postalCode ?? '20000'}
                  onRequestCallback={() => setShowCallbackForm(true)}
                />

                {/* Callback accordion */}
                <AnimatePresence>
                  {showCallbackForm && (
                    <motion.div
                      key="callback"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-8 pt-8 border-t border-gray-100">
                        <AnimatePresence mode="wait">
                          {callbackSubmitted ? (
                            <motion.div
                              key="success"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-6"
                            >
                              <div className="w-12 h-12 rounded-full bg-[#27AE60]/10 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-[#27AE60]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-lg mb-1">
                                Demande envoyée !
                              </p>
                              <p className="text-sm text-[#9B9B9B]">
                                Notre expert vous recontactera dans les 24h.
                              </p>
                            </motion.div>
                          ) : (
                            <motion.form
                              key="form"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              onSubmit={handleCallbackSubmit}
                              className="space-y-4"
                            >
                              <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-[#1B4F72] text-lg">
                                Être rappelé par notre expert
                              </h3>
                              <div>
                                <label className="block text-sm font-semibold text-[#1B4F72] mb-1">
                                  Votre nom
                                </label>
                                <input
                                  type="text"
                                  value={callbackData.name}
                                  onChange={(e) => setCallbackData((p) => ({ ...p, name: e.target.value }))}
                                  placeholder="Jean Dupont"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:ring-offset-1 text-[#5C5C5C]"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-[#1B4F72] mb-1">
                                  Votre téléphone
                                </label>
                                <input
                                  type="tel"
                                  value={callbackData.phone}
                                  onChange={(e) => setCallbackData((p) => ({ ...p, phone: e.target.value }))}
                                  placeholder="+33 6 XX XX XX XX"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:ring-offset-1 text-[#5C5C5C]"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-[#1B4F72] mb-1">
                                  Message{' '}
                                  <span className="text-[#9B9B9B] font-normal">(optionnel)</span>
                                </label>
                                <textarea
                                  value={callbackData.message}
                                  onChange={(e) => setCallbackData((p) => ({ ...p, message: e.target.value }))}
                                  placeholder="Précisez votre demande..."
                                  rows={3}
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:ring-offset-1 text-[#5C5C5C] resize-none"
                                />
                              </div>
                              <Button variant="prestige" type="submit" loading={callbackLoading}>
                                Envoyer ma demande
                              </Button>
                            </motion.form>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StepProgressBar currentStep={currentStep} totalSteps={5} />

                {/* Step content with transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stepContent[currentStep - 1]}
                  </motion.div>
                </AnimatePresence>

                {/* Step 1 validation hint */}
                {currentStep === 1 && stepErrors.propertyType && (
                  <p className="text-xs text-[#C0392B] mt-4" role="alert">
                    {stepErrors.propertyType}
                  </p>
                )}

                {/* Step 4 validation hint */}
                {currentStep === 4 && stepErrors.condition && (
                  <p className="text-xs text-[#C0392B] mt-4" role="alert">
                    {stepErrors.condition}
                  </p>
                )}

                {/* Error display */}
                {error && (
                  <div
                    role="alert"
                    className="mt-4 p-4 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/20 flex items-center justify-between gap-3"
                  >
                    <p className="text-sm text-[#C0392B] font-[family-name:var(--font-open-sans)]">
                      {error}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setError(null); handleSubmit() }}
                      className="text-[#C0392B] hover:bg-[#C0392B]/10 shrink-0"
                    >
                      Réessayer
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
                  {currentStep > 1 ? (
                    <Button variant="ghost" onClick={prevStep}>
                      ← Retour
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 5 ? (
                    <Button variant="primary" onClick={nextStep}>
                      Suivant →
                    </Button>
                  ) : (
                    <Button
                      variant="prestige"
                      loading={isLoading}
                      onClick={handleSubmit}
                    >
                      Obtenir mon estimation
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust signal */}
        {!result && (
          <p className="text-center text-xs text-[#9B9B9B] mt-6 font-[family-name:var(--font-open-sans)]">
            Aucun engagement · Estimation 100% gratuite · Données DVF officielles
          </p>
        )}
      </div>
    </main>
  )
}

export default function EstimerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2E86AB] border-t-transparent" />
        </div>
      }
    >
      <WizardContent />
    </Suspense>
  )
}
