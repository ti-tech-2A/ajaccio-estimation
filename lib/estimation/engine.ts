import type { SupabaseClient } from '@supabase/supabase-js'
import type { EstimationInput, EstimationResult } from '@/types/estimation'
import { PRECISION_THRESHOLDS, ESTIMATION_MARGIN } from '@/lib/constants'
import { computeCoefficients } from './coefficients'
import { queryLevel1, queryLevel2, queryLevel3 } from './fallback'

// Seuil minimal de comparables avant de passer au niveau supérieur
const MIN_COMPARABLES = 5

// ─── Niveau de précision ─────────────────────────────────────────────────────
// Règle stricte : 9 = 2 points, 10 = 3 points (PRECISION_THRESHOLDS.HIGH = 10)

function computePrecisionLevel(count: number): 0 | 1 | 2 | 3 {
  if (count >= PRECISION_THRESHOLDS.HIGH)   return 3
  if (count >= PRECISION_THRESHOLDS.MEDIUM) return 2
  if (count >= PRECISION_THRESHOLDS.LOW)    return 1
  return 0
}

// ─── Moteur principal ────────────────────────────────────────────────────────

export async function computeEstimation(
  supabase: SupabaseClient,
  input: EstimationInput
): Promise<EstimationResult> {
  const {
    postalCode,
    propertyType,
    surface,
    condition,
    features,
    floor,
    totalFloors,
    yearBuilt,
  } = input

  if (surface <= 0) {
    return { priceLow: 0, priceHigh: 0, priceMedianSqm: 0, comparableCount: 0, precisionLevel: 0, queryLevel: 1 }
  }

  // ── Requêtes DVF avec cascade de fallback ────────────────────────────────

  // Bug 1 fix : rawCount (brut) pour le seuil de fallback,
  // count (trimmé) pour le niveau de précision affiché
  let dvf = await queryLevel1(supabase, postalCode, propertyType, surface)
  let queryLevel: 1 | 2 | 3 = 1

  if (dvf.rawCount < MIN_COMPARABLES) {
    dvf = await queryLevel2(supabase, postalCode, propertyType)
    queryLevel = 2
  }

  if (dvf.rawCount < MIN_COMPARABLES) {
    dvf = await queryLevel3(supabase, propertyType, surface)
    queryLevel = 3
  }

  const precisionLevel = computePrecisionLevel(dvf.count)

  // Données insuffisantes → fourchette impossible, renvoi vers expert
  if (precisionLevel === 0 || dvf.priceSqm === 0) {
    return {
      priceLow: 0,
      priceHigh: 0,
      priceMedianSqm: 0,
      comparableCount: dvf.count,
      precisionLevel: 0,
      queryLevel,
    }
  }

  // ── Application des coefficients ─────────────────────────────────────────

  const { pctAdjustment, fixedAdjustment } = computeCoefficients(
    propertyType,
    condition,
    features,
    floor,
    totalFloors,
    yearBuilt
  )

  // Prix/m² ajusté (coefficients qualitatifs appliqués sur le référentiel DVF)
  const adjustedPriceSqm = Math.round(dvf.priceSqm * (1 + pctAdjustment))

  // Prix de base = prix/m² ajusté × surface
  const basePrice = adjustedPriceSqm * surface

  // Ajout des montants fixes (parking, cave, piscine…)
  const finalPrice = Math.round(basePrice + fixedAdjustment)

  // ── Fourchette ±10 % ─────────────────────────────────────────────────────

  const priceLow  = Math.round(finalPrice * (1 - ESTIMATION_MARGIN))
  const priceHigh = Math.round(finalPrice * (1 + ESTIMATION_MARGIN))

  return {
    priceLow,
    priceHigh,
    priceMedianSqm: adjustedPriceSqm,
    comparableCount: dvf.count,
    precisionLevel,
    queryLevel,
  }
}
