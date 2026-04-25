import type { SupabaseClient } from '@supabase/supabase-js'
import type { PropertyType } from '@/types/estimation'
import { ESTIMATION_OUTLIER_TRIM } from '@/lib/constants'

// ─── Types internes ──────────────────────────────────────────────────────────

interface DVFRow {
  valeur_fonciere: number
  surface_reelle_bati: number
}

export interface DVFQueryResult {
  priceSqm: number
  count: number      // Trimmé — pour le niveau de précision affiché
  rawCount: number   // Brut (après filtre de cohérence) — pour le seuil de fallback
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const DVF_TYPE_MAP: Record<Exclude<PropertyType, 'terrain'>, string> = {
  appartement: 'Appartement',
  villa:       'Maison',
}

// Fourchette de cohérence des prix/m² pour Ajaccio
const PRICE_SQM_MIN = 800
const PRICE_SQM_MAX = 15_000

// CPs Ajaccio pour le Niveau 3 (tous CPs de la commune)
const ALL_AJACCIO_CPS = ['20000', '20090', '20167'] as const

// ─── Catégories de surface — Appartements ────────────────────────────────────

export type ApartmentCategory = 'studio_t2' | 't3' | 't4' | 't5_plus'

// Bug 2+3 fix : catégorie déterminée par la surface uniquement
// (spec CLAUDE.md : "catégorie de surface" — pas de filtre sur le nombre de pièces)
export function getApartmentCategory(surface: number): ApartmentCategory {
  if (surface <= 50)  return 'studio_t2'
  if (surface <= 75)  return 't3'
  if (surface <= 100) return 't4'
  return 't5_plus'
}

const CATEGORY_SURFACE: Record<ApartmentCategory, { min: number; max: number }> = {
  studio_t2: { min: 0,   max: 50  },
  t3:        { min: 51,  max: 75  },
  t4:        { min: 76,  max: 100 },
  t5_plus:   { min: 101, max: 999 },
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function dateCutoff(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}

function computeMedian(rows: DVFRow[]): DVFQueryResult {
  const prices = rows
    .filter(r => r.surface_reelle_bati > 0 && r.valeur_fonciere > 0)
    .map(r => r.valeur_fonciere / r.surface_reelle_bati)
    .filter(p => p >= PRICE_SQM_MIN && p <= PRICE_SQM_MAX)
    .sort((a, b) => a - b)

  const rawCount = prices.length
  if (rawCount < 2) return { priceSqm: 0, count: 0, rawCount }

  const trimCount = Math.floor(rawCount * ESTIMATION_OUTLIER_TRIM)
  const trimmed = prices.slice(trimCount, rawCount - trimCount)
  if (!trimmed.length) return { priceSqm: 0, count: 0, rawCount: 0 }

  const mid = Math.floor(trimmed.length / 2)
  const median =
    trimmed.length % 2 === 0
      ? (trimmed[mid - 1] + trimmed[mid]) / 2
      : trimmed[mid]

  return { priceSqm: Math.round(median), count: trimmed.length, rawCount }
}

// Applique le filtre CP + filtre obligatoire 20167
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withPostalFilter(query: any, postalCode: string): any {
  query = query.eq('code_postal', postalCode)
  if (postalCode === '20167') {
    query = query.eq('commune', 'Ajaccio').eq('code_insee', '2A004')
  }
  return query
}

// ─── Niveau 1 ────────────────────────────────────────────────────────────────
// Appartement : CP + type + catégorie de surface + 24 mois
// Villa       : CP + type + surface ±35 % + 24 mois

export async function queryLevel1(
  supabase: SupabaseClient,
  postalCode: string,
  propertyType: Exclude<PropertyType, 'terrain'>,
  surface: number
): Promise<DVFQueryResult> {
  const dvfType = DVF_TYPE_MAP[propertyType]

  let q = supabase
    .from('dvf_transactions')
    .select('valeur_fonciere, surface_reelle_bati')
    .eq('type_local', dvfType)
    .gte('date_mutation', dateCutoff(24))
    .gt('valeur_fonciere', 0)
    .gt('surface_reelle_bati', 0)

  q = withPostalFilter(q, postalCode)

  if (propertyType === 'appartement') {
    // Filtre sur la plage de surface de la catégorie — pas sur les pièces (spec "catégorie de surface")
    const cat = getApartmentCategory(surface)
    const s = CATEGORY_SURFACE[cat]
    q = q
      .gte('surface_reelle_bati', s.min)
      .lte('surface_reelle_bati', s.max)
  } else {
    // Villa : surface ±35 % pour ne pas mélanger mas et villa prestige
    q = q
      .gte('surface_reelle_bati', Math.round(surface * 0.65))
      .lte('surface_reelle_bati', Math.round(surface * 1.35))
  }

  const { data, error } = await q
  if (error || !data) return { priceSqm: 0, count: 0, rawCount: 0 }

  return computeMedian(data)
}

// ─── Niveau 2 ────────────────────────────────────────────────────────────────
// CP + type + 36 mois (sans catégorie ni filtre de surface)

export async function queryLevel2(
  supabase: SupabaseClient,
  postalCode: string,
  propertyType: Exclude<PropertyType, 'terrain'>
): Promise<DVFQueryResult> {
  const dvfType = DVF_TYPE_MAP[propertyType]

  let q = supabase
    .from('dvf_transactions')
    .select('valeur_fonciere, surface_reelle_bati')
    .eq('type_local', dvfType)
    .gte('date_mutation', dateCutoff(36))
    .gt('valeur_fonciere', 0)
    .gt('surface_reelle_bati', 0)

  q = withPostalFilter(q, postalCode)

  const { data, error } = await q
  if (error || !data) return { priceSqm: 0, count: 0, rawCount: 0 }

  return computeMedian(data)
}

// ─── Niveau 3 ────────────────────────────────────────────────────────────────
// Tous les CPs ajacciens + type + 48 mois
// Requêtes parallèles pour appliquer correctement le filtre 20167
// Bug 4 fix : filtre de surface ±50 % pour les villas (évite de mélanger toutes tailles)

export async function queryLevel3(
  supabase: SupabaseClient,
  propertyType: Exclude<PropertyType, 'terrain'>,
  surface?: number
): Promise<DVFQueryResult> {
  const dvfType = DVF_TYPE_MAP[propertyType]
  const cutoff = dateCutoff(48)

  const perCpQueries = ALL_AJACCIO_CPS.map(async (cp) => {
    let q = supabase
      .from('dvf_transactions')
      .select('valeur_fonciere, surface_reelle_bati')
      .eq('type_local', dvfType)
      .gte('date_mutation', cutoff)
      .gt('valeur_fonciere', 0)
      .gt('surface_reelle_bati', 0)

    q = withPostalFilter(q, cp)

    if (propertyType === 'villa' && surface) {
      q = q
        .gte('surface_reelle_bati', Math.round(surface * 0.50))
        .lte('surface_reelle_bati', Math.round(surface * 1.50))
    }

    const { data } = await q
    return (data ?? []) as DVFRow[]
  })

  const results = await Promise.all(perCpQueries)
  const allRows = results.flat()

  return computeMedian(allRows)
}
