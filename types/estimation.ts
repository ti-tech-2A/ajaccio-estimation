export type PropertyType = 'appartement' | 'villa' | 'terrain'

export type PropertyCondition =
  | 'neuf'
  | 'tres-bon'
  | 'bon'
  | 'a-rafraichir'
  | 'a-renover'

export interface WizardFormData {
  // Step 1
  propertyType: PropertyType
  // Step 2
  address: string
  postalCode: '20000' | '20090' | '20167'
  commune: string
  // Step 3
  surface: number
  rooms: number
  bedrooms: number
  floor?: number
  totalFloors?: number
  landSurface?: number
  yearBuilt?: number
  // Step 4
  condition: PropertyCondition
  features: string[]
  // Step 5
  fullName: string
  email: string
  phone: string
  gdprConsent: boolean
}

export interface EstimationInput {
  postalCode: string
  propertyType: Exclude<PropertyType, 'terrain'>
  surface: number
  rooms: number
  condition: PropertyCondition
  features: string[]
  floor?: number
  totalFloors?: number
  yearBuilt?: number
}

export interface EstimationResult {
  priceLow: number
  priceHigh: number
  priceMedianSqm: number
  comparableCount: number
  precisionLevel: 0 | 1 | 2 | 3
  queryLevel: 1 | 2 | 3
}
