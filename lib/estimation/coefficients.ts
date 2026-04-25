import type { PropertyCondition, PropertyType } from '@/types/estimation'
import { COEFFICIENT_CAP } from '@/lib/constants'

// ─── Condition ───────────────────────────────────────────────────────────────
// Référence : 'bon' = 0 (correspond à la majorité des transactions DVF)

export const CONDITION_COEFFICIENTS: Record<PropertyCondition, number> = {
  'neuf':          0.18,
  'tres-bon':      0.07,
  'bon':           0.00,
  'a-rafraichir': -0.08,
  'a-renover':    -0.18,
}

// ─── Appartement — Ajustements en % ─────────────────────────────────────────
// Source : grille d'analyse photo + ajustements Phase 5 de la méthodologie DVF

export const APPARTEMENT_PCT_COEFFICIENTS: Record<string, number> = {
  'Vue mer':              0.15,
  'Vue dégagée':          0.04,
  'Terrasse':             0.06,
  'Balcon':               0.02,
  'Loggia':               0.03,
  'Ascenseur':            0.04,
  'Gardiennage':          0.03,
  'Climatisation':        0.02,
  'Double vitrage':       0.01,
  'DPE A/B':              0.04,
  'Résidence récente':    0.03,
  'DPE F/G':             -0.06,  // Obligation de rénovation énergétique
  'Vis-à-vis direct':    -0.03,
  'Nuisances sonores':   -0.04,
  // Parking box, Place sous-sol, Cave → ajustements fixes ci-dessous
}

// ─── Appartement — Ajustements fixes (€) ────────────────────────────────────
// Valeurs calibrées sur le marché ajaccien (médiane des transactions parkings)

export const APPARTEMENT_FIXED_ADJUSTMENTS: Record<string, number> = {
  'Parking box':    22_000,
  'Place sous-sol': 11_000,
  'Cave':            4_500,
}

// ─── Villa — Ajustements en % ────────────────────────────────────────────────
// Poids plus élevé sur la vue et le terrain (cf. pondération méthodologie Phase 4)

export const VILLA_PCT_COEFFICIENTS: Record<string, number> = {
  'Vue mer panoramique':          0.22,
  'Vue mer partielle':            0.10,
  'Terrain > 2000m²':             0.08,
  'Plain-pied':                   0.03,
  'Accès facile':                 0.03,
  'Domotique':                    0.02,
  'Cuisine équipée haut de gamme': 0.03,
  'DPE A/B':                      0.03,
  // Piscine, Garage double → ajustements fixes ci-dessous
}

// ─── Villa — Ajustements fixes (€) ──────────────────────────────────────────

export const VILLA_FIXED_ADJUSTMENTS: Record<string, number> = {
  'Piscine chauffée':  40_000,
  'Piscine standard':  22_000,
  'Garage double':     18_000,
}

// ─── Étage (appartement uniquement) ─────────────────────────────────────────

export function computeFloorCoefficient(
  floor: number | undefined,
  totalFloors: number | undefined,
  hasElevator: boolean
): number {
  if (floor === undefined || totalFloors === undefined || totalFloors === 0) return 0

  if (floor === 0) return -0.09

  const isLastFloor = floor >= totalFloors
  if (isLastFloor) {
    return hasElevator ? 0.10 : 0.01
  }

  // Pénalité progressive sans ascenseur à partir du 3e étage
  if (!hasElevator && floor >= 3) {
    return Math.max(-0.06, -(floor - 2) * 0.02)
  }

  // Légère progression positive avec la hauteur (lumière, vue partielle)
  return Math.min(0.03, floor * 0.006)
}

// ─── Ancienneté ──────────────────────────────────────────────────────────────
// Complète le critère condition (état de l'unité ≠ âge de l'immeuble)

export function computeAgeCoefficient(yearBuilt: number | undefined): number {
  if (!yearBuilt) return 0
  const age = new Date().getFullYear() - yearBuilt
  if (age <= 5)  return  0.04
  if (age <= 15) return  0.02
  if (age <= 30) return  0.00
  if (age <= 50) return -0.01
  return -0.02
}

// ─── Calcul global ───────────────────────────────────────────────────────────

export interface CoefficientResult {
  pctAdjustment: number    // Ajustement % après plafonnement ±40 %
  fixedAdjustment: number  // Ajustement fixe en €
  rawPct: number           // Total brut avant plafonnement (pour debug/log)
}

export function computeCoefficients(
  propertyType: Exclude<PropertyType, 'terrain'>,
  condition: PropertyCondition,
  features: string[],
  floor?: number,
  totalFloors?: number,
  yearBuilt?: number
): CoefficientResult {
  const pctMap =
    propertyType === 'appartement'
      ? APPARTEMENT_PCT_COEFFICIENTS
      : VILLA_PCT_COEFFICIENTS

  const fixedMap =
    propertyType === 'appartement'
      ? APPARTEMENT_FIXED_ADJUSTMENTS
      : VILLA_FIXED_ADJUSTMENTS

  let totalPct = 0

  totalPct += CONDITION_COEFFICIENTS[condition] ?? 0

  for (const feature of features) {
    totalPct += pctMap[feature] ?? 0
  }

  if (propertyType === 'appartement') {
    const hasElevator = features.includes('Ascenseur')
    totalPct += computeFloorCoefficient(floor, totalFloors, hasElevator)
  }

  totalPct += computeAgeCoefficient(yearBuilt)

  const rawPct = totalPct
  const pctAdjustment = Math.max(-COEFFICIENT_CAP, Math.min(COEFFICIENT_CAP, totalPct))

  let fixedAdjustment = 0
  for (const feature of features) {
    fixedAdjustment += fixedMap[feature] ?? 0
  }

  return { pctAdjustment, fixedAdjustment, rawPct }
}
