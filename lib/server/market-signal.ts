import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseReadClient } from '@/lib/server/supabase-admin'

type MetricSource = 'supabase-live' | 'fallback-local'

export interface HomeKpiMetric {
  end: number
  suffix: string
  label: string
  sublabel: string
  decimals?: number
  hint?: string
}

export interface HomeKpiPayload {
  metrics: HomeKpiMetric[]
  sourceLabel: string
}

interface DvfSourceVariant {
  table: string
  dateColumn: string
  priceColumn: string
  localTypeColumn?: string
  surfaceColumn?: string
  postalCodeColumn?: string
  communeCodeColumn?: string
  communeColumn?: string
  departmentColumn?: string
}

interface DvfComputedMetrics {
  corsicaSalesStoredCount: number
  ajaccioSalesCount12m: number
  ajaccioSalesVolume12mEuros: number
  ajaccioAvgPricePerSqmApartment: number
  ajaccioAvgPricePerSqmVilla: number
  ajaccioApartmentCount12m: number
  ajaccioVillaCount12m: number
  ajaccioParcellCount12m: number
}

type QueryMethodHost<T> = {
  in?: (column: string, values: string[]) => T
  eq?: (column: string, value: string) => T
  ilike?: (column: string, value: string) => T
  like?: (column: string, value: string) => T
  or?: (filter: string) => T
  gte?: (column: string, value: string) => T
}

const AJACCIO_POSTAL_CODES = ['20000', '20090', '20167']
const AJACCIO_INSEE = '2A004'
const PAGE_SIZE = 1000
const MAX_PAGES_FOR_EXACT_MEDIAN = 500

const SOURCE_VARIANTS: DvfSourceVariant[] = [
  {
    table: 'dvf_transactions',
    dateColumn: 'date_mutation',
    priceColumn: 'valeur_fonciere',
    localTypeColumn: 'type_local',
    surfaceColumn: 'surface_reelle_bati',
    postalCodeColumn: 'postal_code',
    communeCodeColumn: 'code_insee',
    communeColumn: 'commune',
    departmentColumn: 'code_departement',
  },
  {
    table: 'dvf_transactions',
    dateColumn: 'date_mutation',
    priceColumn: 'valeur_fonciere',
    localTypeColumn: 'type_local',
    surfaceColumn: 'surface_reelle_bati',
    postalCodeColumn: 'code_postal',
    communeCodeColumn: 'code_insee',
    communeColumn: 'commune',
    departmentColumn: 'departement',
  },
  {
    table: 'dvf_transactions',
    dateColumn: 'date_mutation',
    priceColumn: 'prix',
    localTypeColumn: 'type_local',
    surfaceColumn: 'surface_reelle_bati',
    postalCodeColumn: 'code_postal',
    communeCodeColumn: 'code_insee',
    communeColumn: 'commune',
    departmentColumn: 'departement',
  },
  {
    table: 'dvf_transactions',
    dateColumn: 'date',
    priceColumn: 'price',
    localTypeColumn: 'type_local',
    surfaceColumn: 'surface',
    postalCodeColumn: 'postal_code',
    communeCodeColumn: 'code_insee',
    communeColumn: 'commune',
    departmentColumn: 'department',
  },
  {
    table: 'dvf_sales',
    dateColumn: 'date_mutation',
    priceColumn: 'valeur_fonciere',
    localTypeColumn: 'type_local',
    surfaceColumn: 'surface_reelle_bati',
    communeCodeColumn: 'code_commune',
    communeColumn: 'nom_commune',
  },
  {
    table: 'v_dvf_metier',
    dateColumn: 'date_mutation',
    priceColumn: 'prix',
    localTypeColumn: 'type_local',
    surfaceColumn: 'surface_bati',
    communeCodeColumn: 'code_commune',
    communeColumn: 'commune',
  },
  {
    table: 'v_dvf_cadastre',
    dateColumn: 'date_mutation',
    priceColumn: 'prix',
    localTypeColumn: 'type_local',
    surfaceColumn: 'surface_reelle_bati',
    communeCodeColumn: 'code_commune',
    communeColumn: 'commune',
  },
  {
    table: 'v_dvf_cadastre_dpe',
    dateColumn: 'date_mutation',
    priceColumn: 'prix',
    localTypeColumn: 'type_local',
    surfaceColumn: 'surface_reelle_bati',
    communeCodeColumn: 'code_commune',
    communeColumn: 'commune',
  },
]

function toPositiveNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : 0
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/[^\d.,-]/g, '').replace(',', '.')
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  }

  return 0
}

function isApartmentType(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }

  return value.trim().toLowerCase().includes('appartement')
}

function isVillaType(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }

  return value.trim().toLowerCase().includes('maison')
}

function isParcelleType(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }

  const v = value.trim().toLowerCase()
  return v.includes('terrain') || v.includes('parcelle')
}

function computeAveragePricePerSqm(totalPrice: number, totalSurface: number): number {
  if (totalPrice <= 0 || totalSurface <= 0) {
    return 0
  }

  return totalPrice / totalSurface
}

function applyAjaccioFilter<T>(query: T, source: DvfSourceVariant): T | null {
  let scoped = query
  let applied = false
  const host = query as unknown as QueryMethodHost<T>

  if (source.postalCodeColumn && typeof host.in === 'function') {
    scoped = host.in.call(scoped, source.postalCodeColumn, AJACCIO_POSTAL_CODES)
    applied = true
  }

  if (source.communeCodeColumn && typeof host.eq === 'function') {
    scoped = host.eq.call(scoped, source.communeCodeColumn, AJACCIO_INSEE)
    applied = true
  } else if (source.communeColumn && typeof host.ilike === 'function') {
    scoped = host.ilike.call(scoped, source.communeColumn, '%ajaccio%')
    applied = true
  }

  return applied ? scoped : null
}

function applyCorsicaFilter<T>(query: T, source: DvfSourceVariant): T | null {
  let scoped = query
  const host = query as unknown as QueryMethodHost<T>

  if (source.communeCodeColumn && typeof host.or === 'function') {
    scoped = host.or.call(
      scoped,
      `${source.communeCodeColumn}.like.2A%,${source.communeCodeColumn}.like.2B%`,
    )
    return scoped
  }

  if (source.departmentColumn && typeof host.in === 'function') {
    scoped = host.in.call(scoped, source.departmentColumn, ['2A', '2B', '2a', '2b'])
    return scoped
  }

  if (source.postalCodeColumn && typeof host.like === 'function') {
    scoped = host.like.call(scoped, source.postalCodeColumn, '20%')
    return scoped
  }

  return null
}

async function fetchCorsicaStoredCount(
  client: SupabaseClient,
  source: DvfSourceVariant,
): Promise<number | null> {
  try {
    const query = client.from(source.table).select('*', {
      count: 'exact',
      head: true,
    })

    const filteredQuery = applyCorsicaFilter(query, source)
    if (!filteredQuery) {
      return null
    }

    const { count, error } = await filteredQuery
    if (error || typeof count !== 'number') {
      return null
    }

    return count
  } catch {
    return null
  }
}

async function fetchAjaccioCount(
  client: SupabaseClient,
  source: DvfSourceVariant,
  cutoffIso: string,
): Promise<number | null> {
  try {
    const query = client.from(source.table).select('*', {
      count: 'exact',
      head: true,
    })

    const filteredQuery = applyAjaccioFilter(query, source)
    if (!filteredQuery) {
      return null
    }

    let scopedQuery = filteredQuery
    const host = scopedQuery as unknown as QueryMethodHost<typeof scopedQuery>
    if (typeof host.gte === 'function') {
      scopedQuery = host.gte.call(scopedQuery, source.dateColumn, cutoffIso)
    }

    const { count, error } = await scopedQuery
    if (error || typeof count !== 'number') {
      return null
    }

    return count
  } catch {
    return null
  }
}

async function fetchAjaccioLatestDate(
  client: SupabaseClient,
  source: DvfSourceVariant,
): Promise<string | null> {
  try {
    const query = client
      .from(source.table)
      .select(source.dateColumn)
      .order(source.dateColumn, { ascending: false })
      .limit(1)

    const filteredQuery = applyAjaccioFilter(query, source)
    if (!filteredQuery) {
      return null
    }

    const { data, error } = await filteredQuery
    if (error || !Array.isArray(data) || data.length === 0) {
      return null
    }

    const row = data[0] as unknown as Record<string, unknown>
    const rawDate = row[source.dateColumn]
    return typeof rawDate === 'string' && rawDate.trim().length > 0 ? rawDate : null
  } catch {
    return null
  }
}

function toRollingCutoffIso(latestDateRaw: string): string | null {
  const latestDate = new Date(latestDateRaw)
  if (Number.isNaN(latestDate.getTime())) {
    return null
  }

  latestDate.setFullYear(latestDate.getFullYear() - 1)
  return latestDate.toISOString().slice(0, 10)
}

async function fetchAjaccioRows(
  client: SupabaseClient,
  source: DvfSourceVariant,
  expectedCount: number,
  cutoffIso: string,
): Promise<Record<string, unknown>[] | null> {
  if (expectedCount <= 0) {
    return []
  }

  const totalPages = Math.ceil(expectedCount / PAGE_SIZE)
  if (totalPages > MAX_PAGES_FOR_EXACT_MEDIAN) {
    return null
  }

  const collected: Record<string, unknown>[] = []

  try {
    for (let page = 0; page < totalPages; page += 1) {
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const selectColumns = [source.priceColumn, source.dateColumn]
      if (source.localTypeColumn) {
        selectColumns.push(source.localTypeColumn)
      }
      if (source.surfaceColumn) {
        selectColumns.push(source.surfaceColumn)
      }

      const query = client.from(source.table).select(selectColumns.join(',')).range(from, to)

      let filteredQuery = applyAjaccioFilter(query, source)
      if (!filteredQuery) {
        return null
      }

      const host = filteredQuery as unknown as QueryMethodHost<typeof filteredQuery>
      if (typeof host.gte === 'function') {
        filteredQuery = host.gte.call(filteredQuery, source.dateColumn, cutoffIso)
      }

      const { data, error } = await filteredQuery
      if (error) {
        return null
      }

      const rows = (Array.isArray(data) ? data : []) as unknown as Record<string, unknown>[]
      collected.push(...rows)

      if (rows.length < PAGE_SIZE) {
        break
      }
    }
  } catch {
    return null
  }

  return collected
}

function computeFallbackMetrics(): DvfComputedMetrics {
  return {
    corsicaSalesStoredCount: 0,
    ajaccioSalesCount12m: 0,
    ajaccioSalesVolume12mEuros: 0,
    ajaccioAvgPricePerSqmApartment: 0,
    ajaccioAvgPricePerSqmVilla: 0,
    ajaccioApartmentCount12m: 0,
    ajaccioVillaCount12m: 0,
    ajaccioParcellCount12m: 0,
  }
}

async function tryComputeSupabaseMetrics(): Promise<DvfComputedMetrics | null> {
  const client = getSupabaseReadClient()
  if (!client) {
    return null
  }

  for (const source of SOURCE_VARIANTS) {
    const corsicaSalesStoredCount = await fetchCorsicaStoredCount(client, source)
    if (!corsicaSalesStoredCount || corsicaSalesStoredCount <= 0) {
      continue
    }

    const latestDateRaw = await fetchAjaccioLatestDate(client, source)
    if (!latestDateRaw) {
      continue
    }

    const cutoffIso = toRollingCutoffIso(latestDateRaw)
    if (!cutoffIso) {
      continue
    }

    const ajaccioSalesCount12m = await fetchAjaccioCount(client, source, cutoffIso)
    if (!ajaccioSalesCount12m || ajaccioSalesCount12m <= 0) {
      continue
    }

    const rows = await fetchAjaccioRows(client, source, ajaccioSalesCount12m, cutoffIso)
    if (!rows || rows.length === 0) {
      continue
    }

    const allPrices12m: number[] = []
    let ajaccioSalesVolume12mEuros = 0
    let apartmentTotalPrice = 0
    let apartmentTotalSurface = 0
    let villaTotalPrice = 0
    let villaTotalSurface = 0
    let ajaccioApartmentCount12m = 0
    let ajaccioVillaCount12m = 0
    let ajaccioParcellCount12m = 0

    for (const row of rows) {
      const price = toPositiveNumber(row[source.priceColumn])

      if (price <= 0) {
        continue
      }

      allPrices12m.push(price)
      ajaccioSalesVolume12mEuros += price

      const typeValue = source.localTypeColumn ? row[source.localTypeColumn] : undefined

      if (isParcelleType(typeValue)) {
        ajaccioParcellCount12m += 1
        continue
      }

      const surface = source.surfaceColumn ? toPositiveNumber(row[source.surfaceColumn]) : 0

      if (isApartmentType(typeValue)) {
        ajaccioApartmentCount12m += 1
        if (surface > 0) {
          apartmentTotalPrice += price
          apartmentTotalSurface += surface
        }
      } else if (isVillaType(typeValue)) {
        ajaccioVillaCount12m += 1
        if (surface > 0) {
          villaTotalPrice += price
          villaTotalSurface += surface
        }
      }
    }

    if (allPrices12m.length === 0) {
      continue
    }

    const ajaccioAvgPricePerSqmApartment = computeAveragePricePerSqm(
      apartmentTotalPrice,
      apartmentTotalSurface,
    )
    const ajaccioAvgPricePerSqmVilla = computeAveragePricePerSqm(
      villaTotalPrice,
      villaTotalSurface,
    )

    return {
      corsicaSalesStoredCount,
      ajaccioSalesCount12m,
      ajaccioSalesVolume12mEuros,
      ajaccioAvgPricePerSqmApartment,
      ajaccioAvgPricePerSqmVilla,
      ajaccioApartmentCount12m,
      ajaccioVillaCount12m,
      ajaccioParcellCount12m,
    }
  }

  return null
}

function toKpiPayload(metrics: DvfComputedMetrics, source: MetricSource): HomeKpiPayload {
  const volumeInMillions = metrics.ajaccioSalesVolume12mEuros / 1_000_000
  const volumeDecimals = volumeInMillions >= 100 ? 0 : 1

  return {
    metrics: [
      {
        end: metrics.corsicaSalesStoredCount,
        suffix: metrics.corsicaSalesStoredCount > 0 ? '+' : '',
        label: 'REFERENCES CORSE',
        sublabel: 'Ventes stockees (2A + 2B)',
      },
      {
        end: metrics.ajaccioSalesCount12m,
        suffix: '',
        label: 'VENTES 12 MOIS',
        sublabel: 'Tous types (appt, villas, terrains, garages, locaux…)',
        hint: 'Total toutes catégories DVF : appartements, villas, terrains, garages, locaux commerciaux, dépendances, etc. sur les codes postaux 20000, 20090 et 20167.',
      },
      {
        end: volumeInMillions,
        decimals: volumeDecimals,
        suffix: 'M\u20AC',
        label: 'VOLUME 12 MOIS',
        sublabel: 'Somme des ventes recentes',
      },
      {
        end: metrics.ajaccioApartmentCount12m,
        suffix: '',
        label: 'APPARTEMENTS VENDUS',
        sublabel: '12 derniers mois courant',
      },
      {
        end: metrics.ajaccioVillaCount12m,
        suffix: '',
        label: 'VILLAS VENDUES',
        sublabel: '12 derniers mois courant',
      },
      {
        end: metrics.ajaccioParcellCount12m,
        suffix: '',
        label: 'PARCELLES CONSTRUCTIBLES',
        sublabel: '12 derniers mois courant',
      },
    ],
    sourceLabel:
      source === 'supabase-live'
        ? 'Source: Supabase live (Corse 2A+2B et Ajaccio 20000/20090/20167).'
        : 'Source: aucune donnee live (variables Supabase manquantes ou requetes en erreur).',
  }
}

export async function getHomeKpiPayload(): Promise<HomeKpiPayload> {
  try {
    const supabaseMetrics = await tryComputeSupabaseMetrics()
    if (supabaseMetrics) {
      return toKpiPayload(supabaseMetrics, 'supabase-live')
    }
  } catch {
    // Keep homepage resilient even if live source fails unexpectedly.
  }

  return toKpiPayload(computeFallbackMetrics(), 'fallback-local')
}
