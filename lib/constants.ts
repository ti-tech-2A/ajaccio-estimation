export const COVERED_POSTAL_CODES = ['20000', '20090', '20167'] as const
export type CoveredPostalCode = typeof COVERED_POSTAL_CODES[number]

export const DVF_LAST_UPDATE = '2026-05-01'
export const DVF_LAST_UPDATE_LABEL = '1er mai 2026'
export const DVF_NEXT_UPDATE_LABEL = 'novembre 2026'

export const PRECISION_THRESHOLDS = {
  HIGH: 10,    // ≥ 10 → 3 points verts
  MEDIUM: 5,   // 5 à 9 → 2 points verts
  LOW: 2,      // 2 à 4 → 1 point vert
  // < 2 → niveau insuffisant
} as const

export const ESTIMATION_OUTLIER_TRIM = 0.25  // Suppression des 25% extrêmes
export const ESTIMATION_MARGIN = 0.10        // Fourchette ±10%
export const COEFFICIENT_CAP = 0.40         // Plafond cumulatif ±40%

export const RATE_LIMIT = {
  estimate: { max: 10, windowSeconds: 60 },
  leads: { max: 10, windowSeconds: 60 },
} as const
