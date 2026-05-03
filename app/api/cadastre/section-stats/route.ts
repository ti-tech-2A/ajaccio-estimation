import { gunzipSync } from 'node:zlib'
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, Position } from 'geojson'

export const runtime = 'nodejs'
export const revalidate = 86400

interface SectionStats {
  cadastralBuildings: number
  banAddresses: number | null
  areaHectares: number
  buildingDensityPerHectare: number
  addressDensityPerHectare: number | null
  densityLabel: string
  inhabitants: number | null
}

interface CommuneTotals {
  cadastralBuildings: number
  banAddresses: number | null
  housing: number
  apartments: number
  houses: number
  otherHousing: number
  cadastreSource: string
  cadastreVintage: string
  banAddressSource: string
  banAddressVintage: string
  inseeSource: string
  inseeVintage: string
}

type Point = [number, number]
type BBox = [number, number, number, number]
type PolygonCoordinates = Position[][]

interface SectionGeometry {
  code: string
  bbox: BBox
  areaHectares: number
  polygons: PolygonCoordinates[]
}

interface BanAddressPoint {
  point: Point | null
  parcelSections: string[]
}

const AJACCIO_INSEE = '2A004'
const CADASTRE_BASE_URL = `https://cadastre.data.gouv.fr/bundler/cadastre-etalab/communes/${AJACCIO_INSEE}/geojson`
const BAN_ADDRESSES_URL = 'https://adresse.data.gouv.fr/data/ban/adresses/latest/csv/adresses-2A.csv.gz'
const REFERENCE_LATITUDE_RADIANS = 41.92 * (Math.PI / 180)
const METERS_PER_DEGREE = 111_320

const COMMUNE_TOTALS: CommuneTotals = {
  cadastralBuildings: 14056,
  banAddresses: null,
  housing: 36362,
  apartments: 32311,
  houses: 3932,
  otherHousing: 119,
  cadastreSource: 'Cadastre Etalab, couche batiments, commune 2A004',
  cadastreVintage: 'Cadastre Etalab 2026',
  banAddressSource: 'Base Adresse Nationale, adresses 2A filtre commune 2A004',
  banAddressVintage: 'BAN latest',
  inseeSource: 'INSEE RP2022, LOG T2, commune COM-2A004',
  inseeVintage: 'RP2022',
}

function normalizeSection(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().toUpperCase()
}

function isPolygonCoordinates(value: unknown): value is PolygonCoordinates {
  return Array.isArray(value)
}

function geometryToPolygons(geometry: Geometry | null | undefined): PolygonCoordinates[] {
  if (!geometry) return []

  if (geometry.type === 'Polygon' && isPolygonCoordinates(geometry.coordinates)) {
    return [geometry.coordinates]
  }

  if (geometry.type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) {
    return geometry.coordinates.filter(isPolygonCoordinates)
  }

  return []
}

function emptyBBox(): BBox {
  return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]
}

function includePointInBBox(bbox: BBox, point: Position) {
  const [x, y] = point
  if (typeof x !== 'number' || typeof y !== 'number') return

  bbox[0] = Math.min(bbox[0], x)
  bbox[1] = Math.min(bbox[1], y)
  bbox[2] = Math.max(bbox[2], x)
  bbox[3] = Math.max(bbox[3], y)
}

function polygonBBox(polygons: PolygonCoordinates[]): BBox | null {
  const bbox = emptyBBox()

  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const point of ring) includePointInBBox(bbox, point)
    }
  }

  return Number.isFinite(bbox[0]) ? bbox : null
}

function bboxContainsPoint(bbox: BBox, point: Point): boolean {
  return point[0] >= bbox[0] && point[0] <= bbox[2] && point[1] >= bbox[1] && point[1] <= bbox[3]
}

function projectPoint(point: Position): Point | null {
  const [longitude, latitude] = point
  if (typeof longitude !== 'number' || typeof latitude !== 'number') return null

  return [
    longitude * METERS_PER_DEGREE * Math.cos(REFERENCE_LATITUDE_RADIANS),
    latitude * METERS_PER_DEGREE,
  ]
}

function ringAreaSquareMeters(ring: Position[]): number {
  let areaTwice = 0

  for (let index = 0, previousIndex = ring.length - 1; index < ring.length; previousIndex = index, index += 1) {
    const current = projectPoint(ring[index])
    const previous = projectPoint(ring[previousIndex])
    if (!current || !previous) continue

    areaTwice += previous[0] * current[1] - current[0] * previous[1]
  }

  return areaTwice / 2
}

function polygonAreaHectares(polygon: PolygonCoordinates): number {
  const [outerRing, ...holes] = polygon
  if (!outerRing) return 0

  const outerArea = Math.abs(ringAreaSquareMeters(outerRing))
  const holesArea = holes.reduce((total, hole) => total + Math.abs(ringAreaSquareMeters(hole)), 0)
  return Math.max(0, outerArea - holesArea) / 10_000
}

function polygonsAreaHectares(polygons: PolygonCoordinates[]): number {
  return polygons.reduce((total, polygon) => total + polygonAreaHectares(polygon), 0)
}

function pointOnSegment(point: Point, start: Position, end: Position): boolean {
  const [px, py] = point
  const [x1, y1] = start
  const [x2, y2] = end

  if ([x1, y1, x2, y2].some((value) => typeof value !== 'number')) return false

  const cross = (py - y1) * (x2 - x1) - (px - x1) * (y2 - y1)
  if (Math.abs(cross) > 1e-10) return false

  const dot = (px - x1) * (px - x2) + (py - y1) * (py - y2)
  return dot <= 1e-10
}

function pointInRing(point: Point, ring: Position[]): boolean {
  let inside = false

  for (let index = 0, previousIndex = ring.length - 1; index < ring.length; previousIndex = index, index += 1) {
    const current = ring[index]
    const previous = ring[previousIndex]

    if (pointOnSegment(point, previous, current)) return true

    const [x1, y1] = current
    const [x2, y2] = previous
    if ([x1, y1, x2, y2].some((value) => typeof value !== 'number')) continue

    const intersects = y1 > point[1] !== y2 > point[1] && point[0] < ((x2 - x1) * (point[1] - y1)) / (y2 - y1) + x1
    if (intersects) inside = !inside
  }

  return inside
}

function pointInPolygon(point: Point, polygon: PolygonCoordinates): boolean {
  const [outerRing, ...holes] = polygon
  if (!outerRing || !pointInRing(point, outerRing)) return false

  return !holes.some((hole) => pointInRing(point, hole))
}

function pointInPolygons(point: Point, polygons: PolygonCoordinates[]): boolean {
  return polygons.some((polygon) => pointInPolygon(point, polygon))
}

function ringCentroid(ring: Position[]): { point: Point; area: number } | null {
  let areaTwice = 0
  let centroidX = 0
  let centroidY = 0
  let fallbackX = 0
  let fallbackY = 0
  let fallbackCount = 0

  for (let index = 0, previousIndex = ring.length - 1; index < ring.length; previousIndex = index, index += 1) {
    const current = ring[index]
    const previous = ring[previousIndex]
    const [x1, y1] = previous
    const [x2, y2] = current

    if ([x1, y1, x2, y2].some((value) => typeof value !== 'number')) continue

    const cross = x1 * y2 - x2 * y1
    areaTwice += cross
    centroidX += (x1 + x2) * cross
    centroidY += (y1 + y2) * cross
    fallbackX += x2
    fallbackY += y2
    fallbackCount += 1
  }

  if (Math.abs(areaTwice) > 1e-12) {
    return {
      point: [centroidX / (3 * areaTwice), centroidY / (3 * areaTwice)],
      area: Math.abs(areaTwice / 2),
    }
  }

  if (fallbackCount === 0) return null

  return {
    point: [fallbackX / fallbackCount, fallbackY / fallbackCount],
    area: 0,
  }
}

function appendPoint(points: Point[], point: Position | Point | null | undefined) {
  if (!point || typeof point[0] !== 'number' || typeof point[1] !== 'number') return

  const candidate: Point = [point[0], point[1]]
  if (!points.some((existing) => existing[0] === candidate[0] && existing[1] === candidate[1])) {
    points.push(candidate)
  }
}

function buildingCandidatePoints(geometry: Geometry | null | undefined): Point[] {
  const polygons = geometryToPolygons(geometry)
  const points: Point[] = []
  let best: { point: Point; area: number; polygon: PolygonCoordinates } | null = null

  for (const polygon of polygons) {
    const centroid = polygon[0] ? ringCentroid(polygon[0]) : null
    if (!centroid) continue
    if (!best || centroid.area > best.area) best = { ...centroid, polygon }
  }

  if (best) {
    appendPoint(points, best.point)
    appendPoint(points, best.polygon[0]?.[0])
    appendPoint(points, best.polygon[0]?.[Math.floor((best.polygon[0]?.length ?? 1) / 2)])
  }

  for (const polygon of polygons) {
    appendPoint(points, polygon[0]?.[0])
  }

  return points
}

function sectionCode(feature: Feature<Geometry, GeoJsonProperties>): string {
  return normalizeSection(feature.properties?.section ?? feature.properties?.code)
}

function densityLabel(density: number): string {
  if (density >= 35) return 'Tissu tres dense'
  if (density >= 18) return 'Tissu dense'
  if (density >= 8) return 'Densite moderee'
  if (density >= 2) return 'Tissu diffus'
  return 'Tres peu bati'
}

async function fetchCadastreLayer(layer: 'sections' | 'batiments'): Promise<FeatureCollection<Geometry, GeoJsonProperties>> {
  const response = await fetch(`${CADASTRE_BASE_URL}/${layer}`, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Cadastre ${layer} HTTP ${response.status}`)
  }

  return response.json() as Promise<FeatureCollection<Geometry, GeoJsonProperties>>
}

function splitCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (quoted && nextChar === '"') {
        current += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (char === ';' && !quoted) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }

  values.push(current)
  return values
}

function numberFromCsv(value: string | undefined): number | null {
  if (!value) return null

  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

// Matches Ajaccio parcel IDs regardless of dept-code variant (2A004 or legacy 20004)
// and whether the 3-char commune prefix (000) is present or absent.
// Examples matched: 2A004000BI0001 · 20004000BI0001 · 2A004BI0001 · 20004BI0001
const AJACCIO_PARCEL_RE = /^(?:2A|20)004(?:\d{3})?([A-Z]{1,2})\d/i

function parcelSections(value: string | undefined): string[] {
  if (!value) return []

  const sections = new Set<string>()

  for (const parcel of value.split('|')) {
    const normalized = parcel.trim().toUpperCase()
    const match = AJACCIO_PARCEL_RE.exec(normalized)
    if (!match?.[1]) continue

    const rawSection = match[1]
    sections.add(rawSection)
    sections.add(rawSection.replace(/^0/, ''))
  }

  return [...sections]
}

async function fetchBanAddresses(): Promise<BanAddressPoint[]> {
  const response = await fetch(BAN_ADDRESSES_URL, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`BAN addresses HTTP ${response.status}`)
  }

  const compressed = Buffer.from(await response.arrayBuffer())
  const csv = gunzipSync(compressed).toString('utf8')
  const [headerLine, ...rows] = csv.split(/\r?\n/)
  if (!headerLine) return []

  const headers = splitCsvLine(headerLine)
  const indexes = {
    codeInsee: headers.indexOf('code_insee'),
    longitude: headers.indexOf('lon'),
    latitude: headers.indexOf('lat'),
    parcels: headers.indexOf('cad_parcelles'),
  }

  if (indexes.codeInsee < 0 || indexes.longitude < 0 || indexes.latitude < 0) {
    throw new Error('BAN addresses missing required columns')
  }

  const addresses: BanAddressPoint[] = []

  for (const row of rows) {
    if (!row) continue

    const fields = splitCsvLine(row)
    if (fields[indexes.codeInsee] !== AJACCIO_INSEE) continue

    const longitude = numberFromCsv(fields[indexes.longitude])
    const latitude = numberFromCsv(fields[indexes.latitude])

    addresses.push({
      point: longitude !== null && latitude !== null ? [longitude, latitude] : null,
      parcelSections: indexes.parcels >= 0 ? parcelSections(fields[indexes.parcels]) : [],
    })
  }

  return addresses
}

function buildSectionGeometries(sectionFeatures: Array<Feature<Geometry, GeoJsonProperties>>): SectionGeometry[] {
  return sectionFeatures.flatMap((feature) => {
    const code = sectionCode(feature)
    const polygons = geometryToPolygons(feature.geometry)
    const bbox = polygonBBox(polygons)

    if (!code || !bbox || polygons.length === 0) return []

    return [{ code, bbox, areaHectares: polygonsAreaHectares(polygons), polygons }]
  })
}

function countBuildingsBySection(
  buildings: Array<Feature<Geometry, GeoJsonProperties>>,
  sections: SectionGeometry[],
): Record<string, SectionStats> {
  const stats = Object.fromEntries(
    sections.map((section) => [
      section.code,
      {
        cadastralBuildings: 0,
        banAddresses: null,
        areaHectares: Math.round(section.areaHectares * 10) / 10,
        buildingDensityPerHectare: 0,
        addressDensityPerHectare: null,
        densityLabel: 'Tres peu bati',
        inhabitants: null,
      } satisfies SectionStats,
    ]),
  )

  for (const building of buildings) {
    const section = buildingCandidatePoints(building.geometry)
      .map((point) => sections.find((candidate) => bboxContainsPoint(candidate.bbox, point) && pointInPolygons(point, candidate.polygons)))
      .find(Boolean)
    if (!section) continue

    stats[section.code].cadastralBuildings += 1
  }

  for (const section of sections) {
    const sectionStats = stats[section.code]
    const density = section.areaHectares > 0 ? sectionStats.cadastralBuildings / section.areaHectares : 0
    sectionStats.buildingDensityPerHectare = Math.round(density * 10) / 10
    sectionStats.densityLabel = densityLabel(density)
  }

  return stats
}

function countAddressesBySection(
  stats: Record<string, SectionStats>,
  addresses: BanAddressPoint[],
  sections: SectionGeometry[],
): number {
  const sectionsByCode = new Map(sections.map((section) => [section.code, section]))

  for (const section of sections) {
    stats[section.code].banAddresses = 0
    stats[section.code].addressDensityPerHectare = 0
  }

  let assignedAddresses = 0

  for (const address of addresses) {
    let section = address.parcelSections
      .map((sectionCode) => sectionsByCode.get(sectionCode))
      .find(Boolean)

    if (!section && address.point) {
      section = sections.find((candidate) => (
        bboxContainsPoint(candidate.bbox, address.point as Point) &&
        pointInPolygons(address.point as Point, candidate.polygons)
      ))
    }

    if (!section) continue

    stats[section.code].banAddresses = (stats[section.code].banAddresses ?? 0) + 1
    assignedAddresses += 1
  }

  for (const section of sections) {
    const sectionStats = stats[section.code]
    const density = section.areaHectares > 0
      ? (sectionStats.banAddresses ?? 0) / section.areaHectares
      : 0

    sectionStats.addressDensityPerHectare = Math.round(density * 10) / 10
  }

  return assignedAddresses
}

export async function GET() {
  try {
    const [sectionsCollection, buildingsCollection, banAddresses] = await Promise.all([
      fetchCadastreLayer('sections'),
      fetchCadastreLayer('batiments'),
      fetchBanAddresses().catch((error) => {
        console.warn('[api/cadastre/section-stats] failed to load BAN addresses:', error)
        return null
      }),
    ])
    const sectionGeometries = buildSectionGeometries(sectionsCollection.features)
    const stats = countBuildingsBySection(buildingsCollection.features, sectionGeometries)
    const assignedAddresses = banAddresses
      ? countAddressesBySection(stats, banAddresses, sectionGeometries)
      : null
    const communeTotals = {
      ...COMMUNE_TOTALS,
      banAddresses: assignedAddresses,
    }

    return Response.json(
      {
        source: 'cadastre-etalab',
        method: 'building_centroid_and_ban_address_section_aggregation',
        populationSource: 'not_available_by_section',
        communeTotals,
        stats,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    )
  } catch (error) {
    console.warn('[api/cadastre/section-stats] failed to aggregate section stats:', error)
    return Response.json(
      { source: 'error', stats: {}, communeTotals: COMMUNE_TOTALS },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
    )
  }
}
