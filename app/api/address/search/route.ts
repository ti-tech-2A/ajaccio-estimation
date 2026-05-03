import { COVERED_POSTAL_CODES } from '@/lib/constants'

export const runtime = 'nodejs'

interface GeoPlatformSuggestion {
  x?: number
  y?: number
  city?: string
  zipcode?: string
  street?: string
  fulltext?: string
  kind?: string
}

interface GeoPlatformResponse {
  results?: GeoPlatformSuggestion[]
}

const GEOPLATFORM_COMPLETION_URL = 'https://data.geopf.fr/geocodage/completion/'
const AJACCIO_POSTAL_CODES = new Set<string>(COVERED_POSTAL_CODES)

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function isCoveredPostcode(value: string | null): value is (typeof COVERED_POSTAL_CODES)[number] {
  return value !== null && AJACCIO_POSTAL_CODES.has(value)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') ?? searchParams.get('text') ?? '').trim()
  const requestedPostcode = searchParams.get('postcode')

  if (query.length < 3) {
    return Response.json({ suggestions: [] })
  }

  const params = new URLSearchParams({
    text: query,
    type: 'StreetAddress',
    maximumResponses: '8',
    terr: isCoveredPostcode(requestedPostcode)
      ? requestedPostcode
      : COVERED_POSTAL_CODES.join(','),
  })

  try {
    const response = await fetch(`${GEOPLATFORM_COMPLETION_URL}?${params}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) throw new Error(`GeoPlatform completion HTTP ${response.status}`)

    const payload = (await response.json()) as GeoPlatformResponse
    const suggestions = (payload.results ?? [])
      .filter((suggestion) => {
        const postcode = suggestion.zipcode ?? ''
        const city = suggestion.city ?? ''

        return (
          AJACCIO_POSTAL_CODES.has(postcode) &&
          (!requestedPostcode || postcode === requestedPostcode) &&
          normalize(city) === 'ajaccio' &&
          typeof suggestion.fulltext === 'string'
        )
      })
      .map((suggestion) => ({
        label: suggestion.fulltext ?? '',
        postcode: suggestion.zipcode ?? '',
        city: suggestion.city ?? 'Ajaccio',
        name: suggestion.street ?? suggestion.fulltext ?? '',
        type: suggestion.kind ?? 'address',
        longitude: typeof suggestion.x === 'number' ? suggestion.x : null,
        latitude: typeof suggestion.y === 'number' ? suggestion.y : null,
      }))

    return Response.json(
      { suggestions },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.warn('[api/address/search] BAN autocomplete failed:', error)
    return Response.json(
      { suggestions: [] },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
