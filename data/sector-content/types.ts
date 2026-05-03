// Shared types for sector editorial content (per postal code).
// Used by /marche/[cp]/ pages to render SOP sections (intro, micro-secteurs,
// profiles, factors, advice, FAQ).

export type ImpactLevel = 'fort' | 'moyen' | 'faible'

export interface MicroSector {
  name: string
  reading: string
  vigilance: string
}

export interface BuyerProfile {
  profile: string
  searchingFor: string
  argument: string
}

export interface Factor {
  label: string
  impact: ImpactLevel
  detail: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface SectorPositioning {
  tagline: string
  angle: string
  questions: { question: string; answer: string }[]
}

export interface SectorContent {
  postalCode: string
  zoneTitle: string
  metaTitle: string
  metaDescription: string
  introSummary: string
  positioning: SectorPositioning
  microSectors: MicroSector[]
  buyerProfiles: BuyerProfile[]
  valuationFactors: Factor[]
  discountFactors: Factor[]
  sellerAdvice: string[]
  faq: FaqItem[]
}
