export interface ExpertInfo {
  name: string
  title: string
  experience: number
  dealsCompleted: number
  phone: string
  email: string
}

export interface AddressInfo {
  city: string
  postalCode: string
  region: string
  country: string
}

export interface CoverageInfo {
  postalCodes: string[]
  commune: string
  note: string
}

export interface DvfUpdates {
  lastUpdate: string
  lastUpdateLabel: string
  nextUpdateLabel: string
  frequency: string
}

export interface MarketStats {
  averagePricePerSqmApartment: number
  averagePricePerSqmVilla: number
  transactionsLast12Months: number
  priceEvolution12m: string
}

export interface HomepageStatus {
  id: string
  label: string
  icon: string
}

export interface NavItem {
  label: string
  href: string
  cta?: boolean
}

export interface Testimonial {
  id: string
  author: string
  age: number
  propertyType: 'appartement' | 'villa'
  sector: string
  postalCode: string
  outcome: string
  rating: 4 | 5
  date: string
  content: string
}

export interface SiteMetadata {
  name: string
  tagline: string
  description: string
  url: string
  expert: ExpertInfo
  address: AddressInfo
  coverage: CoverageInfo
  dvfUpdates: DvfUpdates
  stats: MarketStats
  homepageStatuses: HomepageStatus[]
  navigation: NavItem[]
  testimonials: Testimonial[]
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testi-001',
    author: 'Marie-Claire D.',
    age: 58,
    propertyType: 'appartement',
    sector: 'Centre historique / Cours Napoléon',
    postalCode: '20000',
    outcome: 'Vendu en 6 semaines au prix estimé',
    rating: 5,
    date: '2025-11-20',
    content:
      'J\'avais hérité d\'un T3 en plein centre-ville d\'Ajaccio et je ne savais pas comment le valoriser avant de le mettre en vente pour financer mon achat à Lyon. L\'estimation en ligne était précise, j\'ai obtenu une fourchette réaliste en moins de trois minutes. L\'expert a confirmé l\'évaluation lors d\'une visite rapide. Le bien a trouvé preneur en six semaines, au prix annoncé. Je recommande sans hésitation.',
  },
  {
    id: 'testi-002',
    author: 'Jean-Baptiste F.',
    age: 63,
    propertyType: 'villa',
    sector: 'Route des Sanguinaires (Scudo, Barbicaggia)',
    postalCode: '20000',
    outcome: 'Prix bien supérieur aux estimations nationales',
    rating: 5,
    date: '2025-10-08',
    content:
      'Les grandes plateformes nationales m\'avaient donné une valeur bien en-dessous de la réalité pour ma villa sur la route des Sanguinaires. ajaccio-estimation.fr a pris en compte la vue mer, l\'exposition et les spécificités locales. La fourchette proposée était nettement plus haute, et c\'est finalement à ce niveau-là que la transaction s\'est conclue. La connaissance fine du marché corse fait vraiment la différence.',
  },
  {
    id: 'testi-003',
    author: 'Thomas A.',
    age: 34,
    propertyType: 'appartement',
    sector: 'Aspretto / Campo dell\'Oro',
    postalCode: '20090',
    outcome: 'Investissement locatif confirmé en 48h',
    rating: 5,
    date: '2025-12-15',
    content:
      'Investisseur basé à Paris, je cherchais un studio locatif à Ajaccio sans me déplacer. Les données DVF intégrées à l\'outil m\'ont permis de vérifier les prix réels pratiqués à Aspretto, avec un niveau de granularité que je n\'avais pas trouvé ailleurs. En 48 heures j\'avais toutes les informations pour décider et faire une offre cohérente. Un outil sérieux pour des investisseurs qui veulent des chiffres vérifiables.',
  },
  {
    id: 'testi-004',
    author: 'Isabelle M.',
    age: 49,
    propertyType: 'appartement',
    sector: 'Quartier des Étrangers',
    postalCode: '20000',
    outcome: 'Précision de l\'estimation confirmée par notaire',
    rating: 5,
    date: '2025-09-30',
    content:
      'Notre T4 dans le quartier des Étrangers est un bien atypique avec de belles prestations. Je m\'attendais à une estimation approximative, mais la fourchette proposée tenait compte de l\'étage, de la terrasse et des finitions. Le notaire que nous avons consulté ensuite a donné une valeur quasiment identique. Ça m\'a vraiment surpris pour un outil gratuit disponible en ligne.',
  },
  {
    id: 'testi-005',
    author: 'Nathalie V.',
    age: 31,
    propertyType: 'appartement',
    sector: 'Mezzavia',
    postalCode: '20167',
    outcome: 'Première vente sans stress, accompagnement clair',
    rating: 5,
    date: '2025-11-05',
    content:
      'C\'était ma première vente immobilière, un T2 à Mezzavia reçu en donation. Je ne savais pas par où commencer. Le formulaire m\'a guidée pas à pas et j\'ai obtenu une estimation claire, sans jargon. Aucun engagement, aucune pression. L\'expert m\'a rappelée le lendemain pour préciser quelques points. J\'ai finalement vendu au-dessus de la fourchette basse. Idéal pour quelqu\'un qui découvre le processus.',
  },
  {
    id: 'testi-006',
    author: 'Patrick et Sylvie R.',
    age: 67,
    propertyType: 'villa',
    sector: 'La Pietrina / Jardins de l\'Empereur',
    postalCode: '20090',
    outcome: 'Succession réglée en moins de 3 mois',
    rating: 4,
    date: '2025-08-18',
    content:
      'Nous devions régler la succession de notre mère et vendre sa villa aux Jardins de l\'Empereur rapidement. ajaccio-estimation.fr nous a donné une valeur de référence solide pour fixer un prix dès la mise en vente. Le délai était court et nous ne voulions pas brader. Nous avons conclu en dessous du délai habituel, et au prix de l\'estimation. Une vraie aide dans un contexte déjà difficile.',
  },
  {
    id: 'testi-007',
    author: 'Karim B.',
    age: 45,
    propertyType: 'appartement',
    sector: 'Binda',
    postalCode: '20090',
    outcome: 'Vente 100% à distance, aucun déplacement',
    rating: 5,
    date: '2025-10-22',
    content:
      'Je réside en Île-de-France et je possède un T3 à Binda depuis quinze ans en résidence secondaire. L\'idée de revenir à Ajaccio juste pour des estimations me rebutait. Avec ajaccio-estimation.fr, j\'ai tout fait en ligne. L\'expert m\'a envoyé un rapport complet par email. La vente s\'est ensuite faite via procuration. Zéro déplacement, estimation fiable, transaction réussie. Exactement ce qu\'il me fallait.',
  },
  {
    id: 'testi-008',
    author: 'François-Marie C.',
    age: 72,
    propertyType: 'appartement',
    sector: 'Parc Berthault',
    postalCode: '20000',
    outcome: 'Estimation affinée, grande surface bien valorisée',
    rating: 4,
    date: '2025-07-14',
    content:
      'Notre T5 au Parc Berthault est un grand appartement d\'époque difficile à positionner sur le marché. Les outils généralistes ne savent pas gérer les grandes surfaces. L\'estimation en ligne a tenu compte de la superficie mais aussi de l\'état général et du quartier. L\'expertise terrain a ensuite affiné la fourchette. Nous avons trouvé un acquéreur sérieux rapidement, à un prix que nous estimions juste.',
  },
]

export const SITE_METADATA: SiteMetadata = {
  name: 'ajaccio-estimation.fr',
  tagline: 'Estimez votre bien à Ajaccio en 3 minutes',
  description:
    "Estimation immobilière gratuite à Ajaccio. Données DVF réelles, expert local 25 ans d'expérience. Résultat instantané.",
  url: 'https://ajaccio-estimation.fr',
  expert: {
    name: '[Prénom Nom]',
    title: 'Expert immobilier à Ajaccio',
    experience: 25,
    dealsCompleted: 147,
    phone: '+33 X XX XX XX XX',
    email: 'contact@ajaccio-estimation.fr',
  },
  address: {
    city: 'Ajaccio',
    postalCode: '20000',
    region: 'Corse-du-Sud',
    country: 'France',
  },
  coverage: {
    postalCodes: ['20000', '20090', '20167'],
    commune: 'Ajaccio',
    note: 'Le CP 20167 couvre Mezzavia (Ajaccio) uniquement. Alata est exclu.',
  },
  dvfUpdates: {
    lastUpdate: '2026-05-01',
    lastUpdateLabel: '1er mai 2026',
    nextUpdateLabel: 'novembre 2026',
    frequency: 'Deux fois par an — début mai et début novembre',
  },
  stats: {
    averagePricePerSqmApartment: 3200,
    averagePricePerSqmVilla: 4100,
    transactionsLast12Months: 312,
    priceEvolution12m: '+2.4%',
  },
  homepageStatuses: [
    { id: 'data', label: 'Données DVF vérifiées', icon: 'CheckCircle' },
    { id: 'instant', label: 'Résultat en 3 minutes', icon: 'Zap' },
    { id: 'free', label: 'Estimation gratuite', icon: 'Gift' },
    { id: 'independent', label: 'Mandataire Safti', icon: 'Shield' },
  ],
  navigation: [
    { label: 'Estimer mon bien', href: '/estimer', cta: true },
    { label: 'Marché', href: '/marche' },
    { label: 'Ajaccio 20000', href: '/marche/20000' },
    { label: 'Ajaccio 20090', href: '/marche/20090' },
    { label: 'Mezzavia 20167', href: '/marche/20167' },
    { label: 'Expert', href: '/expert' },
    { label: 'FAQ', href: '/faq' },
  ],
  testimonials: TESTIMONIALS,
}
