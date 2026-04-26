export type SectorPriority = 'mvp' | 'v2' | 'v3'

export interface Sector {
  id: string
  postalCode: '20000' | '20090' | '20167'
  label: string
  description: string
  commune: 'Ajaccio'
  codeInsee: '2A004'
  requiresCommuneFilter: boolean
  priority: SectorPriority
}

export const SECTORS: Sector[] = [
  // ─── 20000 — Ajaccio ────────────────────────────────────────────────────────
  {
    id: '20000-centre-historique',
    postalCode: '20000',
    label: 'Centre historique / Cours Napoléon',
    description: 'Zone commerçante, vie de ville, tissu urbain dense',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20000-quartier-etrangers',
    postalCode: '20000',
    label: 'Quartier des Étrangers',
    description: 'Villas, standing élevé, résidences de caractère',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20000-trottel',
    postalCode: '20000',
    label: 'Trottel',
    description: 'Quartier résidentiel en hauteur',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20000-parc-berthault',
    postalCode: '20000',
    label: 'Parc Berthault',
    description: 'Résidences arborées, cadre verdoyant',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20000-terre-sacree',
    postalCode: '20000',
    label: 'Terre Sacrée',
    description: 'Quartier résidentiel calme, proximité mer',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20000-sanguinaires',
    postalCode: '20000',
    label: 'Route des Sanguinaires (Scudo, Barbicaggia)',
    description: 'Bord de mer, villas haut de gamme, vues panoramiques',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },

  // ─── 20090 — Ajaccio ────────────────────────────────────────────────────────
  {
    id: '20090-aspretto',
    postalCode: '20090',
    label: 'Aspretto / Campo dell\'Oro',
    description: 'Appartements récents, marché dynamique, proximité aéroport',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20090-pietralba',
    postalCode: '20090',
    label: 'Pietralba',
    description: 'Quartier résidentiel, dynamique et familial',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20090-bodiccione',
    postalCode: '20090',
    label: 'Bodiccione',
    description: 'Quartier résidentiel en développement',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20090-octroi',
    postalCode: '20090',
    label: 'Octroi',
    description: 'Entrée sud de la ville, mixte résidentiel/commercial',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20090-les-cannes-les-salines',
    postalCode: '20090',
    label: 'Les Cannes - Les Salines',
    description: 'Quartier résidentiel établi, desserte aisée',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20090-binda',
    postalCode: '20090',
    label: 'Binda',
    description: 'Secteur résidentiel, nombreuses résidences',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20090-saint-joseph',
    postalCode: '20090',
    label: 'Saint-Joseph',
    description: 'Quartier calme, habitat pavillonnaire et collectif',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20090-candia',
    postalCode: '20090',
    label: 'Candia',
    description: 'Résidentiel, proche commerces et services',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20090-saint-jean',
    postalCode: '20090',
    label: 'Saint-Jean',
    description: 'Secteur résidentiel et tertiaire',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },
  {
    id: '20090-pietrina',
    postalCode: '20090',
    label: 'La Pietrina / Jardins de l\'Empereur',
    description: 'Grand ensemble résidentiel, nombreux appartements',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    requiresCommuneFilter: false,
    priority: 'mvp',
  },

  // ─── 20167 — Mezzavia ───────────────────────────────────────────────────────
  {
    id: '20167-mezzavia',
    postalCode: '20167',
    label: 'Mezzavia',
    description: 'Quartier d\'Ajaccio uniquement — Alata (commune voisine) exclue',
    commune: 'Ajaccio',
    codeInsee: '2A004',
    // CRITICAL: CP 20167 also covers Alata (different commune). Always filter by
    // commune = 'Ajaccio' AND code_insee = '2A004' in Supabase queries.
    requiresCommuneFilter: true,
    priority: 'mvp',
  },
]

export function getSectorsByPostalCode(postalCode: string): Sector[] {
  return SECTORS.filter((s) => s.postalCode === postalCode)
}
