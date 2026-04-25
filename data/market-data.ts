export interface MonthlyPrice {
  month: string
  pricePerSqm: number
}

export interface SegmentData {
  segment: string
  apartments: number
  villas: number
  transactionCount: number
}

export interface DvfTransaction {
  id: string
  date: string
  type: 'appartement' | 'villa'
  surface: number
  price: number
  pricePerSqm: number
  street: string
}

export interface MarketPageData {
  postalCode: string
  zone: string
  apptPriceMedian: number
  villaPriceMedian: number
  priceEvolution12m: string
  transactionCount12m: number
  monthlyPrices: MonthlyPrice[]
  segments: SegmentData[]
  recentTransactions: DvfTransaction[]
}

// ─── 20000 ────────────────────────────────────────────────────────────────────

const monthlyPrices20000: MonthlyPrice[] = [
  { month: 'Jan 2024', pricePerSqm: 3280 },
  { month: 'Fév 2024', pricePerSqm: 3310 },
  { month: 'Mar 2024', pricePerSqm: 3350 },
  { month: 'Avr 2024', pricePerSqm: 3390 },
  { month: 'Mai 2024', pricePerSqm: 3420 },
  { month: 'Jun 2024', pricePerSqm: 3470 },
  { month: 'Jul 2024', pricePerSqm: 3510 },
  { month: 'Aoû 2024', pricePerSqm: 3540 },
  { month: 'Sep 2024', pricePerSqm: 3490 },
  { month: 'Oct 2024', pricePerSqm: 3460 },
  { month: 'Nov 2024', pricePerSqm: 3410 },
  { month: 'Déc 2024', pricePerSqm: 3380 },
  { month: 'Jan 2025', pricePerSqm: 3320 },
  { month: 'Fév 2025', pricePerSqm: 3360 },
  { month: 'Mar 2025', pricePerSqm: 3400 },
  { month: 'Avr 2025', pricePerSqm: 3450 },
  { month: 'Mai 2025', pricePerSqm: 3500 },
  { month: 'Jun 2025', pricePerSqm: 3550 },
  { month: 'Jul 2025', pricePerSqm: 3620 },
  { month: 'Aoû 2025', pricePerSqm: 3680 },
  { month: 'Sep 2025', pricePerSqm: 3640 },
  { month: 'Oct 2025', pricePerSqm: 3590 },
  { month: 'Nov 2025', pricePerSqm: 3520 },
  { month: 'Déc 2025', pricePerSqm: 3480 },
]

const segments20000: SegmentData[] = [
  { segment: 'Studio & T2', apartments: 3100, villas: 0, transactionCount: 38 },
  { segment: 'T3', apartments: 3400, villas: 0, transactionCount: 45 },
  { segment: 'T4', apartments: 3500, villas: 0, transactionCount: 32 },
  { segment: 'T5+', apartments: 3600, villas: 4200, transactionCount: 27 },
]

const transactions20000: DvfTransaction[] = [
  { id: 't20000-1', date: '14/11/2025', type: 'appartement', surface: 68, price: 245000, pricePerSqm: 3603, street: 'Rue Bonaparte' },
  { id: 't20000-2', date: '03/10/2025', type: 'villa', surface: 180, price: 756000, pricePerSqm: 4200, street: 'Route des Sanguinaires' },
  { id: 't20000-3', date: '22/09/2025', type: 'appartement', surface: 28, price: 95000, pricePerSqm: 3393, street: 'Cours Napoléon' },
  { id: 't20000-4', date: '07/08/2025', type: 'appartement', surface: 95, price: 332000, pricePerSqm: 3495, street: 'Rue Fesch' },
  { id: 't20000-5', date: '18/06/2025', type: 'appartement', surface: 42, price: 148000, pricePerSqm: 3524, street: 'Avenue de Paris' },
]

export const MARKET_20000: MarketPageData = {
  postalCode: '20000',
  zone: 'Ajaccio Centre',
  apptPriceMedian: 3400,
  villaPriceMedian: 4200,
  priceEvolution12m: '+3.2%',
  transactionCount12m: 142,
  monthlyPrices: monthlyPrices20000,
  segments: segments20000,
  recentTransactions: transactions20000,
}

// ─── 20090 ────────────────────────────────────────────────────────────────────

const monthlyPrices20090: MonthlyPrice[] = [
  { month: 'Jan 2024', pricePerSqm: 2960 },
  { month: 'Fév 2024', pricePerSqm: 2990 },
  { month: 'Mar 2024', pricePerSqm: 3020 },
  { month: 'Avr 2024', pricePerSqm: 3060 },
  { month: 'Mai 2024', pricePerSqm: 3090 },
  { month: 'Jun 2024', pricePerSqm: 3130 },
  { month: 'Jul 2024', pricePerSqm: 3170 },
  { month: 'Aoû 2024', pricePerSqm: 3210 },
  { month: 'Sep 2024', pricePerSqm: 3180 },
  { month: 'Oct 2024', pricePerSqm: 3140 },
  { month: 'Nov 2024', pricePerSqm: 3100 },
  { month: 'Déc 2024', pricePerSqm: 3060 },
  { month: 'Jan 2025', pricePerSqm: 2990 },
  { month: 'Fév 2025', pricePerSqm: 3030 },
  { month: 'Mar 2025', pricePerSqm: 3070 },
  { month: 'Avr 2025', pricePerSqm: 3100 },
  { month: 'Mai 2025', pricePerSqm: 3140 },
  { month: 'Jun 2025', pricePerSqm: 3180 },
  { month: 'Jul 2025', pricePerSqm: 3230 },
  { month: 'Aoû 2025', pricePerSqm: 3270 },
  { month: 'Sep 2025', pricePerSqm: 3240 },
  { month: 'Oct 2025', pricePerSqm: 3200 },
  { month: 'Nov 2025', pricePerSqm: 3150 },
  { month: 'Déc 2025', pricePerSqm: 3110 },
]

const segments20090: SegmentData[] = [
  { segment: 'Studio & T2', apartments: 2900, villas: 0, transactionCount: 34 },
  { segment: 'T3', apartments: 3100, villas: 0, transactionCount: 41 },
  { segment: 'T4', apartments: 3200, villas: 0, transactionCount: 29 },
  { segment: 'T5+', apartments: 3300, villas: 3800, transactionCount: 24 },
]

const transactions20090: DvfTransaction[] = [
  { id: 't20090-1', date: '08/12/2025', type: 'appartement', surface: 28, price: 89000, pricePerSqm: 3178, street: 'Avenue Noël Franchini' },
  { id: 't20090-2', date: '15/10/2025', type: 'appartement', surface: 95, price: 293000, pricePerSqm: 3084, street: 'Rue de la Chapelle' },
  { id: 't20090-3', date: '02/09/2025', type: 'appartement', surface: 72, price: 218000, pricePerSqm: 3028, street: 'Allée des Mimosas' },
  { id: 't20090-4', date: '21/07/2025', type: 'villa', surface: 155, price: 588000, pricePerSqm: 3794, street: 'Chemin de Bodiccione' },
  { id: 't20090-5', date: '14/05/2025', type: 'appartement', surface: 45, price: 137000, pricePerSqm: 3044, street: "Route d'Alata" },
]

export const MARKET_20090: MarketPageData = {
  postalCode: '20090',
  zone: 'Ajaccio Sud',
  apptPriceMedian: 3100,
  villaPriceMedian: 3800,
  priceEvolution12m: '+1.8%',
  transactionCount12m: 128,
  monthlyPrices: monthlyPrices20090,
  segments: segments20090,
  recentTransactions: transactions20090,
}

// ─── 20167 ────────────────────────────────────────────────────────────────────

const monthlyPrices20167: MonthlyPrice[] = [
  { month: 'Jan 2024', pricePerSqm: 2730 },
  { month: 'Fév 2024', pricePerSqm: 2760 },
  { month: 'Mar 2024', pricePerSqm: 2790 },
  { month: 'Avr 2024', pricePerSqm: 2820 },
  { month: 'Mai 2024', pricePerSqm: 2860 },
  { month: 'Jun 2024', pricePerSqm: 2900 },
  { month: 'Jul 2024', pricePerSqm: 2940 },
  { month: 'Aoû 2024', pricePerSqm: 2980 },
  { month: 'Sep 2024', pricePerSqm: 2950 },
  { month: 'Oct 2024', pricePerSqm: 2920 },
  { month: 'Nov 2024', pricePerSqm: 2880 },
  { month: 'Déc 2024', pricePerSqm: 2840 },
  { month: 'Jan 2025', pricePerSqm: 2780 },
  { month: 'Fév 2025', pricePerSqm: 2810 },
  { month: 'Mar 2025', pricePerSqm: 2850 },
  { month: 'Avr 2025', pricePerSqm: 2880 },
  { month: 'Mai 2025', pricePerSqm: 2920 },
  { month: 'Jun 2025', pricePerSqm: 2960 },
  { month: 'Jul 2025', pricePerSqm: 3010 },
  { month: 'Aoû 2025', pricePerSqm: 3050 },
  { month: 'Sep 2025', pricePerSqm: 3020 },
  { month: 'Oct 2025', pricePerSqm: 2990 },
  { month: 'Nov 2025', pricePerSqm: 2950 },
  { month: 'Déc 2025', pricePerSqm: 2910 },
]

const segments20167: SegmentData[] = [
  { segment: 'Studio & T2', apartments: 2700, villas: 0, transactionCount: 10 },
  { segment: 'T3', apartments: 2900, villas: 0, transactionCount: 14 },
  { segment: 'T4', apartments: 3000, villas: 0, transactionCount: 11 },
  { segment: 'T5+', apartments: 3100, villas: 3500, transactionCount: 7 },
]

const transactions20167: DvfTransaction[] = [
  { id: 't20167-1', date: '30/11/2025', type: 'appartement', surface: 72, price: 207000, pricePerSqm: 2875, street: 'Chemin de Mezzavia' },
  { id: 't20167-2', date: '18/10/2025', type: 'villa', surface: 140, price: 490000, pricePerSqm: 3500, street: 'Route de Bastia' },
  { id: 't20167-3', date: '05/09/2025', type: 'appartement', surface: 50, price: 143000, pricePerSqm: 2860, street: 'Impasse des Oliviers' },
  { id: 't20167-4', date: '22/07/2025', type: 'appartement', surface: 88, price: 252000, pricePerSqm: 2864, street: 'Chemin du Moulin' },
  { id: 't20167-5', date: '11/05/2025', type: 'appartement', surface: 32, price: 92000, pricePerSqm: 2875, street: 'Lotissement Les Pins' },
]

export const MARKET_20167: MarketPageData = {
  postalCode: '20167',
  zone: 'Mezzavia',
  apptPriceMedian: 2900,
  villaPriceMedian: 3500,
  priceEvolution12m: '+0.9%',
  transactionCount12m: 42,
  monthlyPrices: monthlyPrices20167,
  segments: segments20167,
  recentTransactions: transactions20167,
}

export const ALL_MARKET_DATA: Record<string, MarketPageData> = {
  '20000': MARKET_20000,
  '20090': MARKET_20090,
  '20167': MARKET_20167,
}
