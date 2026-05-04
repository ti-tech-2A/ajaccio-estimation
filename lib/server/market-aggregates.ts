import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseReadClient } from '@/lib/server/supabase-admin'
import {
  ESTIMATION_OUTLIER_TRIM,
  type CoveredPostalCode,
} from '@/lib/constants'

// ─── Constants ───────────────────────────────────────────────────────────────

const TABLE = 'dvf_sales'

const COL = {
  date: 'date_mutation',
  price: 'valeur_fonciere',
  surface: 'surface_reelle_bati',
  rooms: 'nombre_pieces_principales',
  type: 'type_local',
  postalCode: 'code_postal',
  commune: 'nom_commune',
  communeCode: 'code_commune',
  street: 'adresse_nom_voie',
  number: 'adresse_numero',
  lat: 'latitude',
  lng: 'longitude',
} as const

const PRICE_SQM_MIN = 800
const PRICE_SQM_MAX = 15_000

const MONTH_LABELS_FR = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
]

// ─── Public types ────────────────────────────────────────────────────────────

export interface MarketAggregates {
  postalCode: string
  apartmentMedianSqm: number
  apartmentP25Sqm: number
  apartmentP75Sqm: number
  apartmentCount12m: number
  apartmentCount24m: number
  apartmentCount36m: number
  apartmentCount60m: number
  villaMedianSqm: number
  villaP25Sqm: number
  villaP75Sqm: number
  villaCount12m: number
  villaCount24m: number
  villaCount36m: number
  villaCount60m: number
  evolution12mPct: number
  totalCount12m: number
  totalCount24m: number
  totalCount36m: number
  totalCount60m: number
  latestDate: string | null
  hasLiveData: boolean
}

export type TypologySegment =
  | 'studio_t1'
  | 't2'
  | 't3'
  | 't4_plus'
  | 'maison'

export interface TypologyRow {
  segment: TypologySegment
  label: string
  medianSqm: number
  p25Sqm: number
  p75Sqm: number
  count: number
  surfaceRange: string
}

export interface MarketTypology {
  postalCode: string
  rows: TypologyRow[]
  hasLiveData: boolean
}

export interface MonthlyPoint {
  monthIso: string
  label: string
  medianSqm: number
  count: number
}

export interface MonthlySeries {
  postalCode: string
  series: MonthlyPoint[]
  hasLiveData: boolean
}

export interface YearlyPoint {
  year: number
  medianSqm: number
  count: number
}

export interface YearlySeries {
  postalCode: string
  series: YearlyPoint[]
  hasLiveData: boolean
}

export interface SaleTransaction {
  id: string
  date: string
  type: 'appartement' | 'villa'
  surface: number
  rooms: number | null
  price: number
  pricePerSqm: number
  street: string | null
  number: string | null
  lat: number | null
  lng: number | null
}

export interface RecentTransactions {
  postalCode: string
  rows: SaleTransaction[]
  hasLiveData: boolean
}

// ─── Internal helpers ────────────────────────────────────────────────────────

interface RawRow {
  [COL.price]: number
  [COL.surface]: number
}

function dateCutoff(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}

function dateCutoffYear(year: number, end = false): string {
  return end ? `${year}-12-31` : `${year}-01-01`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withPostalFilter(query: any, cp: string): any {
  let q = query.eq(COL.postalCode, cp)
  if (cp === '20167') {
    q = q.eq(COL.commune, 'Ajaccio').eq(COL.communeCode, '2A004')
  }
  return q
}

function median(sortedAsc: number[]): number {
  const n = sortedAsc.length
  if (!n) return 0
  const mid = Math.floor(n / 2)
  return n % 2 === 0 ? (sortedAsc[mid - 1] + sortedAsc[mid]) / 2 : sortedAsc[mid]
}

function quantile(sortedAsc: number[], q: number): number {
  if (!sortedAsc.length) return 0
  const idx = (sortedAsc.length - 1) * q
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return Math.round(sortedAsc[lo])
  return Math.round(sortedAsc[lo] + (sortedAsc[hi] - sortedAsc[lo]) * (idx - lo))
}

function toPriceSqmsFiltered(rows: RawRow[]): number[] {
  return rows
    .map((r) => {
      const s = Number(r[COL.surface])
      const p = Number(r[COL.price])
      return s > 0 && p > 0 ? p / s : 0
    })
    .filter((p) => p >= PRICE_SQM_MIN && p <= PRICE_SQM_MAX)
    .sort((a, b) => a - b)
}

function trimQuartiles(sortedAsc: number[]): number[] {
  const n = sortedAsc.length
  if (n < 4) return sortedAsc
  const trim = Math.floor(n * ESTIMATION_OUTLIER_TRIM)
  return sortedAsc.slice(trim, n - trim)
}

// Cap explicit (Supabase default = 1000) — un CP sur 5 ans n'excède jamais 50k.
const MAX_ROWS = 49_999

async function fetchPriceSqmBucket(
  client: SupabaseClient,
  cp: string,
  type: 'Appartement' | 'Maison',
  months: number,
): Promise<{ raw: number[]; trimmed: number[] }> {
  let q = client
    .from(TABLE)
    .select(`${COL.price}, ${COL.surface}`)
    .eq(COL.type, type)
    .gte(COL.date, dateCutoff(months))
    .gt(COL.price, 0)
    .gt(COL.surface, 0)
  q = withPostalFilter(q, cp)
  const { data, error } = await q.range(0, MAX_ROWS)
  if (error || !data) return { raw: [], trimmed: [] }
  const sorted = toPriceSqmsFiltered(data as unknown as RawRow[])
  return { raw: sorted, trimmed: trimQuartiles(sorted) }
}

async function fetchPriceSqmRange(
  client: SupabaseClient,
  cp: string,
  type: 'Appartement' | 'Maison',
  startIso: string,
  endIso: string,
): Promise<number[]> {
  let q = client
    .from(TABLE)
    .select(`${COL.price}, ${COL.surface}`)
    .eq(COL.type, type)
    .gte(COL.date, startIso)
    .lt(COL.date, endIso)
    .gt(COL.price, 0)
    .gt(COL.surface, 0)
  q = withPostalFilter(q, cp)
  const { data } = await q.range(0, MAX_ROWS)
  if (!data) return []
  return toPriceSqmsFiltered(data as unknown as RawRow[])
}

async function fetchLatestDate(
  client: SupabaseClient,
  cp: string,
): Promise<string | null> {
  try {
    let q = client
      .from(TABLE)
      .select(COL.date)
      .order(COL.date, { ascending: false })
      .limit(1)
    q = withPostalFilter(q, cp)
    const { data } = await q
    if (!Array.isArray(data) || !data.length) return null
    const raw = (data[0] as Record<string, unknown>)[COL.date]
    return typeof raw === 'string' ? raw : null
  } catch {
    return null
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getMarketAggregates(
  cp: CoveredPostalCode,
): Promise<MarketAggregates> {
  const empty: MarketAggregates = {
    postalCode: cp,
    apartmentMedianSqm: 0,
    apartmentP25Sqm: 0,
    apartmentP75Sqm: 0,
    apartmentCount12m: 0,
    apartmentCount24m: 0,
    apartmentCount36m: 0,
    apartmentCount60m: 0,
    villaMedianSqm: 0,
    villaP25Sqm: 0,
    villaP75Sqm: 0,
    villaCount12m: 0,
    villaCount24m: 0,
    villaCount36m: 0,
    villaCount60m: 0,
    evolution12mPct: 0,
    totalCount12m: 0,
    totalCount24m: 0,
    totalCount36m: 0,
    totalCount60m: 0,
    latestDate: null,
    hasLiveData: false,
  }

  const client = getSupabaseReadClient()
  if (!client) return empty

  try {
    const [
      appt12,
      appt24,
      appt36,
      appt60,
      villa12,
      villa24,
      villa36,
      villa60,
      apptPrevYear,
      latestDate,
    ] = await Promise.all([
      fetchPriceSqmBucket(client, cp, 'Appartement', 12),
      fetchPriceSqmBucket(client, cp, 'Appartement', 24),
      fetchPriceSqmBucket(client, cp, 'Appartement', 36),
      fetchPriceSqmBucket(client, cp, 'Appartement', 60),
      fetchPriceSqmBucket(client, cp, 'Maison', 12),
      fetchPriceSqmBucket(client, cp, 'Maison', 24),
      fetchPriceSqmBucket(client, cp, 'Maison', 36),
      fetchPriceSqmBucket(client, cp, 'Maison', 60),
      fetchPriceSqmRange(client, cp, 'Appartement', dateCutoff(24), dateCutoff(12)),
      fetchLatestDate(client, cp),
    ])

    const apptMedian = median(appt12.trimmed)
    const villaMedian = median(villa12.trimmed)
    const prevMedian = median(trimQuartiles(apptPrevYear))

    return {
      postalCode: cp,
      apartmentMedianSqm: Math.round(apptMedian),
      apartmentP25Sqm: quantile(appt12.trimmed, 0.25),
      apartmentP75Sqm: quantile(appt12.trimmed, 0.75),
      apartmentCount12m: appt12.trimmed.length,
      apartmentCount24m: appt24.trimmed.length,
      apartmentCount36m: appt36.trimmed.length,
      apartmentCount60m: appt60.trimmed.length,
      villaMedianSqm: Math.round(villaMedian),
      villaP25Sqm: quantile(villa12.trimmed, 0.25),
      villaP75Sqm: quantile(villa12.trimmed, 0.75),
      villaCount12m: villa12.trimmed.length,
      villaCount24m: villa24.trimmed.length,
      villaCount36m: villa36.trimmed.length,
      villaCount60m: villa60.trimmed.length,
      evolution12mPct:
        prevMedian > 0
          ? Math.round(((apptMedian - prevMedian) / prevMedian) * 1000) / 10
          : 0,
      totalCount12m: appt12.trimmed.length + villa12.trimmed.length,
      totalCount24m: appt24.trimmed.length + villa24.trimmed.length,
      totalCount36m: appt36.trimmed.length + villa36.trimmed.length,
      totalCount60m: appt60.trimmed.length + villa60.trimmed.length,
      latestDate,
      hasLiveData: appt12.trimmed.length + villa12.trimmed.length > 0,
    }
  } catch {
    return empty
  }
}

// ─── Typology breakdown ──────────────────────────────────────────────────────

interface RawTypoRow {
  [COL.price]: number
  [COL.surface]: number
  [COL.rooms]?: number | null
  [COL.type]: string
}

const SURFACE_BUCKETS: Record<TypologySegment, { min: number; max: number; label: string; range: string }> = {
  studio_t1: { min: 0,   max: 30,  label: 'Studio / T1', range: '≤ 30 m²' },
  t2:        { min: 31,  max: 50,  label: 'T2',          range: '31-50 m²' },
  t3:        { min: 51,  max: 75,  label: 'T3',          range: '51-75 m²' },
  t4_plus:   { min: 76,  max: 999, label: 'T4 et +',     range: '≥ 76 m²' },
  maison:    { min: 0,   max: 9999, label: 'Maison / Villa', range: 'toutes surfaces' },
}

export async function getMarketTypology(
  cp: CoveredPostalCode,
): Promise<MarketTypology> {
  const client = getSupabaseReadClient()
  const empty: MarketTypology = { postalCode: cp, rows: [], hasLiveData: false }
  if (!client) return empty

  try {
    let qApt = client
      .from(TABLE)
      .select(`${COL.price}, ${COL.surface}, ${COL.rooms}, ${COL.type}`)
      .eq(COL.type, 'Appartement')
      .gte(COL.date, dateCutoff(60))
      .gt(COL.price, 0)
      .gt(COL.surface, 0)
    qApt = withPostalFilter(qApt, cp)

    let qHouse = client
      .from(TABLE)
      .select(`${COL.price}, ${COL.surface}, ${COL.type}`)
      .eq(COL.type, 'Maison')
      .gte(COL.date, dateCutoff(60))
      .gt(COL.price, 0)
      .gt(COL.surface, 0)
    qHouse = withPostalFilter(qHouse, cp)

    const [apartmentsRes, housesRes] = await Promise.all([
      qApt.range(0, MAX_ROWS),
      qHouse.range(0, MAX_ROWS),
    ])

    const apartments = (apartmentsRes.data ?? []) as unknown as RawTypoRow[]
    const houses = (housesRes.data ?? []) as unknown as RawTypoRow[]

    const buckets: Record<TypologySegment, number[]> = {
      studio_t1: [], t2: [], t3: [], t4_plus: [], maison: [],
    }

    for (const r of apartments) {
      const surface = Number(r[COL.surface])
      const price = Number(r[COL.price])
      if (!(surface > 0) || !(price > 0)) continue
      const sqm = price / surface
      if (sqm < PRICE_SQM_MIN || sqm > PRICE_SQM_MAX) continue

      let seg: TypologySegment = 't4_plus'
      if (surface <= 30) seg = 'studio_t1'
      else if (surface <= 50) seg = 't2'
      else if (surface <= 75) seg = 't3'
      buckets[seg].push(sqm)
    }

    for (const r of houses) {
      const surface = Number(r[COL.surface])
      const price = Number(r[COL.price])
      if (!(surface > 0) || !(price > 0)) continue
      const sqm = price / surface
      if (sqm < PRICE_SQM_MIN || sqm > PRICE_SQM_MAX) continue
      buckets.maison.push(sqm)
    }

    const rows: TypologyRow[] = (Object.keys(SURFACE_BUCKETS) as TypologySegment[])
      .map((seg) => {
        const sorted = buckets[seg].sort((a, b) => a - b)
        const trimmed = trimQuartiles(sorted)
        const cfg = SURFACE_BUCKETS[seg]
        return {
          segment: seg,
          label: cfg.label,
          medianSqm: Math.round(median(trimmed)),
          p25Sqm: quantile(trimmed, 0.25),
          p75Sqm: quantile(trimmed, 0.75),
          count: trimmed.length,
          surfaceRange: cfg.range,
        }
      })

    const totalCount = rows.reduce((s, r) => s + r.count, 0)

    return { postalCode: cp, rows, hasLiveData: totalCount > 0 }
  } catch {
    return empty
  }
}

// ─── Monthly evolution series (24 months) ────────────────────────────────────

export async function getMonthlySeries(
  cp: CoveredPostalCode,
  months = 24,
): Promise<MonthlySeries> {
  const empty: MonthlySeries = { postalCode: cp, series: [], hasLiveData: false }
  const client = getSupabaseReadClient()
  if (!client) return empty

  try {
    let q = client
      .from(TABLE)
      .select(`${COL.price}, ${COL.surface}, ${COL.date}`)
      .eq(COL.type, 'Appartement')
      .gte(COL.date, dateCutoff(months))
      .gt(COL.price, 0)
      .gt(COL.surface, 0)
    q = withPostalFilter(q, cp)
    const { data } = await q.range(0, MAX_ROWS)
    if (!data) return empty

    const byMonth = new Map<string, number[]>()
    for (const row of data as unknown as Array<RawRow & { [k: string]: unknown }>) {
      const surface = Number(row[COL.surface])
      const price = Number(row[COL.price])
      if (!(surface > 0) || !(price > 0)) continue
      const sqm = price / surface
      if (sqm < PRICE_SQM_MIN || sqm > PRICE_SQM_MAX) continue
      const dateRaw = String(row[COL.date])
      const monthIso = dateRaw.slice(0, 7) // YYYY-MM
      if (monthIso.length !== 7) continue
      let arr = byMonth.get(monthIso)
      if (!arr) {
        arr = []
        byMonth.set(monthIso, arr)
      }
      arr.push(sqm)
    }

    // Build full series for the window — fill empty months with 0 count
    const series: MonthlyPoint[] = []
    const now = new Date()
    for (let i = months - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const arr = (byMonth.get(monthIso) ?? []).sort((a, b) => a - b)
      const med = median(arr)
      series.push({
        monthIso,
        label: `${MONTH_LABELS_FR[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
        medianSqm: Math.round(med),
        count: arr.length,
      })
    }

    const totalCount = series.reduce((s, p) => s + p.count, 0)
    return { postalCode: cp, series, hasLiveData: totalCount > 0 }
  } catch {
    return empty
  }
}

// ─── Yearly evolution (5 years) ──────────────────────────────────────────────

export async function getYearlySeries(
  cp: CoveredPostalCode,
  years = 6,
): Promise<YearlySeries> {
  const empty: YearlySeries = { postalCode: cp, series: [], hasLiveData: false }
  const client = getSupabaseReadClient()
  if (!client) return empty

  try {
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - years + 1

    let q = client
      .from(TABLE)
      .select(`${COL.price}, ${COL.surface}, ${COL.date}`)
      .eq(COL.type, 'Appartement')
      .gte(COL.date, dateCutoffYear(startYear))
      .lt(COL.date, dateCutoffYear(currentYear + 1))
      .gt(COL.price, 0)
      .gt(COL.surface, 0)
    q = withPostalFilter(q, cp)
    const { data } = await q.range(0, MAX_ROWS)
    if (!data) return empty

    const byYear = new Map<number, number[]>()
    for (const row of data as unknown as Array<RawRow & { [k: string]: unknown }>) {
      const surface = Number(row[COL.surface])
      const price = Number(row[COL.price])
      if (!(surface > 0) || !(price > 0)) continue
      const sqm = price / surface
      if (sqm < PRICE_SQM_MIN || sqm > PRICE_SQM_MAX) continue
      const year = Number(String(row[COL.date]).slice(0, 4))
      if (!Number.isFinite(year)) continue
      let arr = byYear.get(year)
      if (!arr) {
        arr = []
        byYear.set(year, arr)
      }
      arr.push(sqm)
    }

    const series: YearlyPoint[] = []
    for (let y = startYear; y <= currentYear; y += 1) {
      const arr = (byYear.get(y) ?? []).sort((a, b) => a - b)
      const trimmed = trimQuartiles(arr)
      series.push({
        year: y,
        medianSqm: Math.round(median(trimmed)),
        count: trimmed.length,
      })
    }

    const totalCount = series.reduce((s, p) => s + p.count, 0)
    return { postalCode: cp, series, hasLiveData: totalCount > 0 }
  } catch {
    return empty
  }
}

// ─── Recent transactions ─────────────────────────────────────────────────────

export async function getRecentTransactions(
  cp: CoveredPostalCode,
  limit = 30,
): Promise<RecentTransactions> {
  const empty: RecentTransactions = { postalCode: cp, rows: [], hasLiveData: false }
  const client = getSupabaseReadClient()
  if (!client) return empty

  try {
    let q = client
      .from(TABLE)
      .select(
        `id, ${COL.date}, ${COL.type}, ${COL.surface}, ${COL.price}, ${COL.rooms}, ${COL.street}, ${COL.number}, ${COL.lat}, ${COL.lng}`,
      )
      .in(COL.type, ['Appartement', 'Maison'])
      .gte(COL.date, dateCutoff(24))
      .gt(COL.price, 0)
      .gt(COL.surface, 0)
      .order(COL.date, { ascending: false })
      .limit(limit * 3)
    q = withPostalFilter(q, cp)

    const { data, error } = await q
    if (error || !data) return empty

    const rows: SaleTransaction[] = []
    for (const r of data as unknown as Array<Record<string, unknown>>) {
      const surface = Number(r[COL.surface])
      const price = Number(r[COL.price])
      if (!(surface > 0) || !(price > 0)) continue
      const sqm = price / surface
      if (sqm < PRICE_SQM_MIN || sqm > PRICE_SQM_MAX) continue
      const typeRaw = String(r[COL.type] ?? '').toLowerCase()
      const type: SaleTransaction['type'] = typeRaw.includes('maison')
        ? 'villa'
        : 'appartement'
      const lat = r[COL.lat] != null ? Number(r[COL.lat]) : null
      const lng = r[COL.lng] != null ? Number(r[COL.lng]) : null
      rows.push({
        id: String(r.id ?? `${r[COL.date]}-${rows.length}`),
        date: String(r[COL.date]),
        type,
        surface,
        rooms: r[COL.rooms] != null ? Number(r[COL.rooms]) : null,
        price,
        pricePerSqm: Math.round(sqm),
        street: r[COL.street] != null ? String(r[COL.street]).trim() : null,
        number: r[COL.number] != null ? String(r[COL.number]).trim() : null,
        lat: Number.isFinite(lat) ? lat : null,
        lng: Number.isFinite(lng) ? lng : null,
      })
      if (rows.length >= limit) break
    }

    return { postalCode: cp, rows, hasLiveData: rows.length > 0 }
  } catch {
    return empty
  }
}

// ─── Bulk loader ─────────────────────────────────────────────────────────────

export interface MarketPagePayload {
  aggregates: MarketAggregates
  typology: MarketTypology
  monthly: MonthlySeries
  yearly: YearlySeries
  transactions: RecentTransactions
}

export async function getMarketPageData(
  cp: CoveredPostalCode,
): Promise<MarketPagePayload> {
  const [aggregates, typology, monthly, yearly, transactions] = await Promise.all([
    getMarketAggregates(cp),
    getMarketTypology(cp),
    getMonthlySeries(cp, 24),
    getYearlySeries(cp, 6),
    getRecentTransactions(cp, 30),
  ])
  return { aggregates, typology, monthly, yearly, transactions }
}
