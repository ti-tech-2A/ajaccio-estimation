import { computeCoefficients } from '@/lib/estimation/coefficients'
import { computeEstimation } from '@/lib/estimation/engine'
import { getApartmentCategory } from '@/lib/estimation/fallback'
import type { EstimationInput } from '@/types/estimation'

// ─── Mock Supabase fallback queries ──────────────────────────────────────────

jest.mock('@/lib/estimation/fallback', () => {
  const actual = jest.requireActual('@/lib/estimation/fallback')
  return {
    ...actual,
    queryLevel1: jest.fn(),
    queryLevel2: jest.fn(),
    queryLevel3: jest.fn(),
  }
})

import { queryLevel1, queryLevel2, queryLevel3 } from '@/lib/estimation/fallback'

const mockL1 = queryLevel1 as jest.Mock
const mockL2 = queryLevel2 as jest.Mock
const mockL3 = queryLevel3 as jest.Mock

const MOCK_SUPABASE = {} as Parameters<typeof computeEstimation>[0]

beforeEach(() => {
  jest.clearAllMocks()
  mockL1.mockResolvedValue({ priceSqm: 0, count: 0, rawCount: 0 })
  mockL2.mockResolvedValue({ priceSqm: 0, count: 0, rawCount: 0 })
  mockL3.mockResolvedValue({ priceSqm: 0, count: 0, rawCount: 0 })
})

function makeInput(overrides: Partial<EstimationInput> = {}): EstimationInput {
  return {
    postalCode: '20000',
    propertyType: 'appartement',
    surface: 68,
    rooms: 3,
    condition: 'bon',
    features: [],
    ...overrides,
  }
}

// ─── Catégorie de surface ─────────────────────────────────────────────────────

describe('getApartmentCategory', () => {
  it('classe par surface uniquement', () => {
    expect(getApartmentCategory(28)).toBe('studio_t2')
    expect(getApartmentCategory(50)).toBe('studio_t2')
    expect(getApartmentCategory(51)).toBe('t3')
    expect(getApartmentCategory(75)).toBe('t3')
    expect(getApartmentCategory(76)).toBe('t4')
    expect(getApartmentCategory(100)).toBe('t4')
    expect(getApartmentCategory(101)).toBe('t5_plus')
  })
})

// ─── Plafond ±40 % ────────────────────────────────────────────────────────────

describe('computeCoefficients — plafond', () => {
  it('plafonne les ajustements positifs cumulés à +40 %', () => {
    const { pctAdjustment, rawPct } = computeCoefficients(
      'villa',
      'neuf',
      [
        'Vue mer panoramique',
        'Terrain > 2000m²',
        'Plain-pied',
        'Accès facile',
        'Domotique',
        'Cuisine équipée haut de gamme',
        'DPE A/B',
      ],
    )
    expect(rawPct).toBeGreaterThan(0.40)
    expect(pctAdjustment).toBe(0.40)
  })

  it('plafonne les ajustements négatifs cumulés à -40 %', () => {
    const { pctAdjustment, rawPct } = computeCoefficients(
      'appartement',
      'a-renover',
      ['DPE F/G', 'Vis-à-vis direct', 'Nuisances sonores'],
      0,       // RDC
      5,       // immeuble 5 étages
      1950,    // très ancien
    )
    expect(rawPct).toBeLessThan(-0.40)
    expect(pctAdjustment).toBe(-0.40)
  })
})

// ─── Seuil de précision strict ────────────────────────────────────────────────

describe('computeEstimation — niveaux de précision', () => {

  it('9 comparables → 2 points (règle stricte)', async () => {
    mockL1.mockResolvedValue({ priceSqm: 3400, count: 9, rawCount: 12 })
    const result = await computeEstimation(MOCK_SUPABASE, makeInput())
    expect(result.precisionLevel).toBe(2)
  })

  it('10 comparables → 3 points (règle stricte)', async () => {
    mockL1.mockResolvedValue({ priceSqm: 3400, count: 10, rawCount: 14 })
    const result = await computeEstimation(MOCK_SUPABASE, makeInput())
    expect(result.precisionLevel).toBe(3)
  })

  it('4 comparables → 1 point (L1+L2 vides, L3 sparse)', async () => {
    // rawCount < 5 aux niveaux 1 et 2 → escalade jusqu'au L3
    mockL3.mockResolvedValue({ priceSqm: 3100, count: 4, rawCount: 4 })
    const result = await computeEstimation(MOCK_SUPABASE, makeInput())
    expect(result.precisionLevel).toBe(1)
  })

  it('0 comparable → précision 0, pas de fourchette', async () => {
    // Global beforeEach : tous les mocks retournent déjà zéro
    const result = await computeEstimation(MOCK_SUPABASE, makeInput())
    expect(result.precisionLevel).toBe(0)
    expect(result.priceLow).toBe(0)
    expect(result.priceHigh).toBe(0)
  })
})

// ─── Cascade de fallback ──────────────────────────────────────────────────────

describe('computeEstimation — fallback', () => {
  it('reste au niveau 1 si rawCount >= 5', async () => {
    mockL1.mockResolvedValue({ priceSqm: 3400, count: 8, rawCount: 10 })
    mockL2.mockResolvedValue({ priceSqm: 0, count: 0, rawCount: 0 })
    mockL3.mockResolvedValue({ priceSqm: 0, count: 0, rawCount: 0 })
    const result = await computeEstimation(MOCK_SUPABASE, makeInput())
    expect(result.queryLevel).toBe(1)
    expect(mockL2).not.toHaveBeenCalled()
  })

  it('passe au niveau 2 si rawCount < 5 au niveau 1', async () => {
    mockL1.mockResolvedValue({ priceSqm: 0, count: 0, rawCount: 3 })
    mockL2.mockResolvedValue({ priceSqm: 3200, count: 12, rawCount: 16 })
    mockL3.mockResolvedValue({ priceSqm: 0, count: 0, rawCount: 0 })
    const result = await computeEstimation(MOCK_SUPABASE, makeInput())
    expect(result.queryLevel).toBe(2)
  })

  it('passe au niveau 3 si rawCount < 5 aux niveaux 1 et 2', async () => {
    mockL1.mockResolvedValue({ priceSqm: 0, count: 0, rawCount: 2 })
    mockL2.mockResolvedValue({ priceSqm: 0, count: 0, rawCount: 1 })
    mockL3.mockResolvedValue({ priceSqm: 3100, count: 6, rawCount: 9 })
    const result = await computeEstimation(MOCK_SUPABASE, makeInput())
    expect(result.queryLevel).toBe(3)
  })
})

// ─── Calcul de la fourchette ──────────────────────────────────────────────────

describe('computeEstimation — fourchette', () => {
  beforeEach(() => {
    mockL1.mockResolvedValue({ priceSqm: 3400, count: 15, rawCount: 20 })
  })

  it('priceHigh > priceLow', async () => {
    const result = await computeEstimation(MOCK_SUPABASE, makeInput())
    expect(result.priceHigh).toBeGreaterThan(result.priceLow)
  })

  it('fourchette ±10 % autour du prix final', async () => {
    const result = await computeEstimation(MOCK_SUPABASE, makeInput({ surface: 68, condition: 'bon', features: [] }))
    const median = result.priceMedianSqm * 68
    expect(result.priceLow).toBeCloseTo(median * 0.90, -2)
    expect(result.priceHigh).toBeCloseTo(median * 1.10, -2)
  })
})
