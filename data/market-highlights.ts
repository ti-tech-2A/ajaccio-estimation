export interface MarketTransaction {
  id: string
  postalCode: '20000' | '20090' | '20167'
  commune: 'Ajaccio'
  propertyType: 'appartement' | 'villa'
  surfaceCategory: string
  surface: number
  rooms: number
  price: number
  pricePerSqm: number
  dateMutation: string
  sector: string
  imageUrl: string
}

export const MARKET_HIGHLIGHTS: MarketTransaction[] = [
  {
    id: 'txn-001',
    postalCode: '20000',
    commune: 'Ajaccio',
    propertyType: 'appartement',
    surfaceCategory: 't3',
    surface: 68,
    rooms: 3,
    price: 245000,
    pricePerSqm: 3603,
    dateMutation: '2025-11-14',
    sector: 'Centre historique / Cours Napoléon',
    imageUrl: 'https://images.unsplash.com/photo-1574170609512-ef0a2c20baf5?w=800&q=80',
  },
  {
    id: 'txn-002',
    postalCode: '20000',
    commune: 'Ajaccio',
    propertyType: 'villa',
    surfaceCategory: 'villa-vue-mer',
    surface: 180,
    rooms: 6,
    price: 780000,
    pricePerSqm: 4333,
    dateMutation: '2025-10-03',
    sector: 'Route des Sanguinaires (Scudo, Barbicaggia)',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  },
  {
    id: 'txn-003',
    postalCode: '20090',
    commune: 'Ajaccio',
    propertyType: 'appartement',
    surfaceCategory: 'studio-t2',
    surface: 28,
    rooms: 1,
    price: 89000,
    pricePerSqm: 3178,
    dateMutation: '2025-12-08',
    sector: 'Aspretto / Campo dell\'Oro',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  },
  {
    id: 'txn-004',
    postalCode: '20090',
    commune: 'Ajaccio',
    propertyType: 'appartement',
    surfaceCategory: 't4',
    surface: 95,
    rooms: 4,
    price: 310000,
    pricePerSqm: 3263,
    dateMutation: '2025-09-22',
    sector: 'La Pietrina / Jardins de l\'Empereur',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  },
  {
    id: 'txn-005',
    postalCode: '20167',
    commune: 'Ajaccio',
    propertyType: 'appartement',
    surfaceCategory: 't3',
    surface: 72,
    rooms: 3,
    price: 220000,
    pricePerSqm: 3055,
    dateMutation: '2025-11-30',
    sector: 'Mezzavia',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  },
]
