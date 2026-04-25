export type PropertyType = 'appartement' | 'villa'

export interface PropertyCategory {
  id: string
  label: string
  description: string
  propertyType: PropertyType
  icon: string
  priceRangeLabel: string
}

export const PROPERTY_CATEGORIES: PropertyCategory[] = [
  // ─── Appartements ───────────────────────────────────────────────────────────
  {
    id: 'studio-t2',
    label: 'Studio & T2',
    description: '≤ 2 pièces, jusqu\'à 50 m²',
    propertyType: 'appartement',
    icon: 'Building2',
    priceRangeLabel: '2 800 – 3 500 €/m²',
  },
  {
    id: 't3',
    label: 'T3',
    description: '3 pièces, 51 à 75 m²',
    propertyType: 'appartement',
    icon: 'Building2',
    priceRangeLabel: '3 000 – 3 800 €/m²',
  },
  {
    id: 't4',
    label: 'T4',
    description: '4 pièces, 76 à 100 m²',
    propertyType: 'appartement',
    icon: 'Building2',
    priceRangeLabel: '3 000 – 3 800 €/m²',
  },
  {
    id: 't5-plus',
    label: 'T5+',
    description: '≥ 5 pièces, plus de 100 m²',
    propertyType: 'appartement',
    icon: 'Building2',
    priceRangeLabel: '3 000 – 4 000 €/m²',
  },
  {
    id: 'appartement-prestige',
    label: 'Appartement de prestige',
    description: 'Tout type, prestations haut de gamme',
    propertyType: 'appartement',
    icon: 'Star',
    priceRangeLabel: '4 500 – 7 000 €/m²',
  },

  // ─── Villas / Maisons ───────────────────────────────────────────────────────
  {
    id: 'villa-vue-mer',
    label: 'Villa avec vue mer',
    description: 'Vue sur mer, dégagée ou frontale',
    propertyType: 'villa',
    icon: 'Home',
    priceRangeLabel: '4 000 – 6 500 €/m²',
  },
  {
    id: 'villa-sans-vue',
    label: 'Villa sans vue',
    description: 'Villa en secteur résidentiel, sans vue mer',
    propertyType: 'villa',
    icon: 'Home',
    priceRangeLabel: '2 800 – 4 000 €/m²',
  },
  {
    id: 'maison-village',
    label: 'Maison de village',
    description: 'Maison mitoyenne ou de bourg',
    propertyType: 'villa',
    icon: 'HomeIcon',
    priceRangeLabel: '2 000 – 3 200 €/m²',
  },
  {
    id: 'villa-prestige',
    label: 'Villa de prestige',
    description: 'Grande villa avec piscine, vue exceptionnelle',
    propertyType: 'villa',
    icon: 'Star',
    priceRangeLabel: '5 500 – 9 000 €/m²',
  },
]

export const APARTMENT_CATEGORIES = PROPERTY_CATEGORIES.filter(
  (c) => c.propertyType === 'appartement'
)

export const VILLA_CATEGORIES = PROPERTY_CATEGORIES.filter(
  (c) => c.propertyType === 'villa'
)
