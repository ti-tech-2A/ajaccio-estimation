import { getSupabaseReadClient } from '@/lib/server/supabase-admin'

export const runtime = 'nodejs'
export const revalidate = 86400

interface SectionStats {
  apartmentBuildings: number
  villas: number
  inhabitants: number | null
}

interface CommuneTotals {
  cadastralBuildings: number
  housing: number
  apartments: number
  houses: number
  otherHousing: number
  cadastreSource: string
  cadastreVintage: string
  inseeSource: string
  inseeVintage: string
}

interface MutableSectionStats {
  apartmentBuildingKeys: Set<string>
  villaKeys: Set<string>
  inhabitants: number | null
}

const AJACCIO_INSEE = '2A004'
const PAGE_SIZE = 1000
const MAX_PAGES = 20

const COMMUNE_TOTALS: CommuneTotals = {
  cadastralBuildings: 14056,
  housing: 36362,
  apartments: 32311,
  houses: 3932,
  otherHousing: 119,
  cadastreSource: 'Cadastre Etalab, couche batiments, commune 2A004',
  cadastreVintage: 'Cadastre Etalab 2026',
  inseeSource: 'INSEE RP2022, LOG T2, commune COM-2A004',
  inseeVintage: 'RP2022',
}

function normalizeSection(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().toUpperCase()
}

function isApartmentType(value: unknown): boolean {
  return typeof value === 'string' && value.trim().toLowerCase().includes('appartement')
}

function isVillaType(value: unknown): boolean {
  if (typeof value !== 'string') return false

  const normalized = value.trim().toLowerCase()
  return normalized.includes('maison') || normalized.includes('villa')
}

function propertyKey(row: Record<string, unknown>, section: string): string {
  const parcelId = typeof row.id_parcelle === 'string' ? row.id_parcelle.trim() : ''
  if (parcelId) return parcelId

  const streetNumber = typeof row.adresse_numero === 'string' ? row.adresse_numero.trim() : ''
  const streetName = typeof row.adresse_nom_voie === 'string' ? row.adresse_nom_voie.trim().toUpperCase() : ''
  return [section, streetNumber, streetName].filter(Boolean).join('|')
}

export async function GET() {
  const supabase = getSupabaseReadClient()
  const communeTotals = COMMUNE_TOTALS

  if (!supabase) {
    return Response.json(
      { source: 'unavailable', stats: {}, communeTotals },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
    )
  }

  const mutableStats: Record<string, MutableSectionStats> = {}

  try {
    for (let page = 0; page < MAX_PAGES; page += 1) {
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error } = await supabase
        .from('v_dvf_cadastre')
        .select('section,type_local,id_parcelle,adresse_numero,adresse_nom_voie')
        .eq('code_commune', AJACCIO_INSEE)
        .range(from, to)

      if (error) {
        throw error
      }

      const rows = Array.isArray(data) ? data : []

      for (const row of rows as Array<Record<string, unknown>>) {
        const section = normalizeSection(row.section)
        if (!section) continue

        const key = propertyKey(row, section)
        if (!key) continue

        mutableStats[section] ??= {
          apartmentBuildingKeys: new Set<string>(),
          villaKeys: new Set<string>(),
          inhabitants: null,
        }

        if (isApartmentType(row.type_local)) {
          mutableStats[section].apartmentBuildingKeys.add(key)
        } else if (isVillaType(row.type_local)) {
          mutableStats[section].villaKeys.add(key)
        }
      }

      if (rows.length < PAGE_SIZE) {
        break
      }
    }

    const stats = Object.fromEntries(
      Object.entries(mutableStats).map(([section, sectionStats]) => [
        section,
        {
          apartmentBuildings: sectionStats.apartmentBuildingKeys.size,
          villas: sectionStats.villaKeys.size,
          inhabitants: sectionStats.inhabitants,
        } satisfies SectionStats,
      ]),
    )

    return Response.json(
      {
        source: 'v_dvf_cadastre',
        method: 'distinct_parcels_by_section_and_type_local',
        populationSource: 'not_available_by_section',
        communeTotals,
        stats,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    )
  } catch (error) {
    console.warn('[api/cadastre/section-stats] failed to aggregate section stats:', error)
    return Response.json(
      { source: 'error', stats: {}, communeTotals },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
    )
  }
}
