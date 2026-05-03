import type { SectorContent } from './types'

export const SECTOR_20000: SectorContent = {
  postalCode: '20000',
  zoneTitle: 'Ajaccio centre — cours Napoléon, vieille ville, littoral',
  metaTitle: 'Prix immobilier Ajaccio 20000 : marché, quartiers, estimation',
  metaDescription:
    "Prix immobiliers à Ajaccio 20000 : médianes DVF par typologie, quartiers du centre-ville, profils acheteurs et critères qui influencent la valeur d'un appartement ou d'une villa.",

  introSummary:
    "Le code postal 20000 regroupe le cœur historique d'Ajaccio : centre-ville, cours Napoléon, vieille ville, quartier des Étrangers, Trottel, Parc Berthault, Casone, Terre Sacrée et littoral des Sanguinaires. Marché urbain et patrimonial, fortement sensible à l'adresse, à l'étage, à la présence d'un ascenseur, à l'extérieur et à la proximité immédiate de la mer ou des commerces. Les écarts de valeur entre deux appartements de surface comparable peuvent dépasser 30 % selon ces critères.",

  positioning: {
    tagline: 'Centre-ville, littoral, patrimoine, vie à pied, adresse, rareté',
    angle:
      "Marché le plus urbain et patrimonial d'Ajaccio, sensible à l'adresse, à l'étage, à l'ascenseur, à la proximité du centre-ville et de la mer.",
    questions: [
      {
        question: 'Où se situe ce secteur dans Ajaccio ?',
        answer:
          "Le 20000 couvre le centre historique et son extension ouest jusqu'à la route des Sanguinaires. Centre dense au nord du port, quartiers résidentiels littoraux à l'ouest.",
      },
      {
        question: 'Quels types de biens y sont présents ?',
        answer:
          "Une nette dominante d'appartements anciens (T2, T3) en centre, immeubles haussmanniens et bourgeois cours Napoléon, résidences récentes à Trottel, villas et appartements de standing route des Sanguinaires.",
      },
      {
        question: 'Quels prix observe-t-on réellement ?',
        answer:
          "Forte hétérogénéité : un T3 cours Napoléon sans ascenseur ne se vend pas au même prix qu'un T3 rénové avec terrasse vue mer aux Sanguinaires. La fourchette observée sur DVF dépasse souvent 1 500 €/m² entre le bas et le haut du marché.",
      },
      {
        question: 'Pourquoi les prix varient-ils fortement ?',
        answer:
          "Six critères pèsent lourd : adresse exacte, étage et ascenseur, vue mer, terrasse exploitable, état intérieur, qualité de la copropriété. Deux biens identiques sur le papier peuvent afficher 25 % d'écart selon ces facteurs.",
      },
      {
        question: 'Comment vendre correctement dans ce secteur ?',
        answer:
          "Comparer à des ventes réellement comparables (même rue ou rue voisine, même typologie, même état), ne pas se fier au prix moyen au m² du CP, soigner photos et DPE, anticiper les charges de copropriété demandées par les acheteurs.",
      },
      {
        question: 'Le secteur est-il recherché par des familles ou des investisseurs ?',
        answer:
          "Mix : actifs et primo-accédants pour les T2/T3 du centre, familles aisées pour les T4+ et villas littorales, investisseurs locatifs sur les studios et T2 proches université / hôpital, retraités sur les biens avec ascenseur et vue.",
      },
      {
        question: 'Le stationnement et l\'extérieur sont-ils des sujets ?',
        answer:
          "Oui, fortement. Stationnement très tendu en centre dense (Bonaparte, Fesch, Cardinal Fesch). Une place de parking ou un garage peut valoriser un bien de 15 000 à 30 000 €. Une terrasse exploitable est un fort différenciateur.",
      },
    ],
  },

  microSectors: [
    {
      name: 'Centre-ville / cours Napoléon',
      reading:
        "Cœur commerçant, immeubles bourgeois et haussmanniens, T2/T3 anciens, vie à pied complète. Forte demande locative.",
      vigilance:
        "Étages élevés sans ascenseur, charges de copropriété parfois lourdes, stationnement très tendu, bruit nocturne sur certaines rues.",
    },
    {
      name: 'Vieille ville / quartier génois',
      reading:
        "Patrimoine, ruelles piétonnes, cachet, T1/T2 atypiques. Recherché par investisseurs courte durée et amoureux du centre historique.",
      vigilance:
        "Immeubles anciens, parties communes hétérogènes, surface Carrez parfois pénalisante, DPE souvent faible.",
    },
    {
      name: 'Quartier des Étrangers / Trottel',
      reading:
        "Résidences plus récentes, copropriétés organisées, T3/T4 avec balcons, parking fréquent, proximité bord de mer et écoles.",
      vigilance:
        "Charges variables selon la résidence, vis-à-vis sur certaines rues, écart de prix important entre programmes.",
    },
    {
      name: 'Parc Berthault / Casone',
      reading:
        "Résidentiel calme, immeubles années 70-90, T3/T4 familiaux, proche centre à pied, vue dégagée sur certains lots.",
      vigilance:
        "Hétérogénéité des résidences, ascenseurs parfois vieillissants, état intérieur très variable.",
    },
    {
      name: 'Terre Sacrée / Saint-François',
      reading:
        "Petites copropriétés ou maisons mitoyennes, ambiance village, calme, parking plus simple qu'au centre dense.",
      vigilance:
        "Quelques rues étroites, accès véhicule à valider, état des constructions inégal.",
    },
    {
      name: 'Route des Sanguinaires (Scudo, Barbicaggia)',
      reading:
        "Littoral premium, villas et appartements vue mer, terrasses, résidences sécurisées, marché secondaire et résidence principale haut de gamme.",
      vigilance:
        "Prix très tirés vers le haut, attention aux logiques de saisonnalité et aux charges de copropriété élevées sur les résidences avec piscine.",
    },
  ],

  buyerProfiles: [
    {
      profile: 'Primo-accédant / actif local',
      searchingFor:
        'T2 ou T3 abordable, proche transports et commerces, mensualité maîtrisée.',
      argument:
        "Mensualité, sécurité du quartier, charges raisonnables, bon DPE.",
    },
    {
      profile: 'Famille',
      searchingFor:
        "T4+, école à pied, stationnement, ascenseur, balcon ou terrasse.",
      argument:
        "Confort quotidien : configuration des pièces, lumière, espaces de rangement, école et services à proximité.",
    },
    {
      profile: 'Investisseur locatif',
      searchingFor:
        'Studio ou T2 bien placé, demande locative forte (étudiants, jeunes actifs, courte durée).',
      argument:
        "Rendement net, stabilité de la demande, charges et DPE, potentiel courte durée selon réglementation.",
    },
    {
      profile: 'Résidence secondaire',
      searchingFor:
        'Vue mer ou terrasse exploitable, proximité plage et restaurants, peu de travaux.',
      argument:
        "Usage plaisir : vue, exposition, terrasse, qualité de la résidence, simplicité d'entretien.",
    },
    {
      profile: 'Retraité / senior',
      searchingFor:
        'Ascenseur, calme relatif, commerces et médecins à pied, copropriété entretenue.',
      argument:
        "Confort et accessibilité : ascenseur, plain-pied, charges prévisibles, services à proximité immédiate.",
    },
    {
      profile: 'Acquéreur patrimonial',
      searchingFor:
        'Adresse rare, vue mer panoramique, prestations haut de gamme, villa ou appartement de prestige.',
      argument:
        "Rareté, vue, qualité architecturale, prestations, valorisation à long terme.",
    },
  ],

  valuationFactors: [
    { label: 'Vue mer dégagée', impact: 'fort', detail: 'Différentiel de prix significatif, surtout aux Sanguinaires et sur les hauteurs de Trottel.' },
    { label: 'Terrasse exploitable', impact: 'fort', detail: "Espace extérieur >8 m² avec usage réel : repas, salon. Critère devenu prioritaire pour les acheteurs depuis 2020." },
    { label: 'Balcon profond ou loggia', impact: 'moyen', detail: 'Améliore lumière et usage, valorisation moindre mais réelle.' },
    { label: 'Ascenseur dès le 2e étage', impact: 'fort', detail: 'Critère décisif pour seniors, familles et revente. Son absence pénalise lourdement les étages hauts.' },
    { label: 'Place de parking ou garage', impact: 'fort', detail: "Très valorisé en centre dense. Une place sécurisée vaut souvent 15 000 à 30 000 € à Ajaccio 20000." },
    { label: 'Dernier étage avec ascenseur', impact: 'moyen', detail: 'Calme, lumière, vue : combinaison appréciée si ascenseur présent.' },
    { label: 'Rénovation récente (-5 ans)', impact: 'moyen', detail: "Réduit l'incertitude pour l'acheteur sur les travaux à prévoir, fluidifie la vente." },
    { label: 'Climatisation réversible', impact: 'moyen', detail: "Avantage local fort, surtout sur les biens orientés sud ou ouest." },
    { label: 'Bon DPE (A à C)', impact: 'moyen', detail: 'Devient un critère discriminant : rassure les acheteurs, ouvre tous les financements.' },
    { label: 'Copropriété entretenue', impact: 'moyen', detail: 'Façades ravalées, parties communes propres, ascenseur récent : réduit la perception de risque.' },
    { label: 'Faibles charges de copropriété', impact: 'moyen', detail: 'Une charge mensuelle <40 €/m²/an est un argument commercial direct.' },
    { label: 'Adresse identifiable / prestigieuse', impact: 'fort', detail: "Cours Napoléon, route des Sanguinaires, front de mer : adresses qui se vendent par leur nom." },
  ],

  discountFactors: [
    { label: 'Étage élevé sans ascenseur', impact: 'fort', detail: "Au-delà du 2e étage, frein massif : familles et seniors écartent le bien." },
    { label: 'Aucun extérieur (ni balcon ni terrasse)', impact: 'fort', detail: 'Critère devenu rédhibitoire pour beaucoup d\'acheteurs sur le centre.' },
    { label: 'Stationnement impossible à proximité', impact: 'fort', detail: 'Frein fréquent sur les rues étroites du centre dense.' },
    { label: 'Travaux lourds nécessaires (>20 % du prix)', impact: 'fort', detail: 'Décote importante car les acheteurs majorent le coût psychologique.' },
    { label: 'Mauvais DPE (F ou G)', impact: 'fort', detail: 'Frein croissant : interdiction progressive de location, financement plus difficile.' },
    { label: 'Vis-à-vis direct ou rue étroite', impact: 'moyen', detail: 'Décote modérée à forte selon la distance et la perte de luminosité.' },
    { label: 'Bruit (route, bars, école)', impact: 'moyen', detail: 'Affecte surtout les biens recherchés en résidence principale ou secondaire.' },
    { label: 'Copropriété dégradée', impact: 'fort', detail: 'Procès-verbaux d\'AG défavorables, travaux votés non provisionnés : prudence acheteur.' },
    { label: 'Charges très élevées', impact: 'moyen', detail: 'Au-delà de 60 €/m²/an, devient un point de négociation systématique.' },
    { label: 'Distribution peu fonctionnelle', impact: 'moyen', detail: 'Cuisine fermée, couloirs perdus, pièces aveugles : perte de valeur perçue.' },
  ],

  sellerAdvice: [
    "Comparer à des ventes réellement comparables : même rue ou rue voisine, même typologie, surface proche, état similaire, présence ou non d'un extérieur, étage et ascenseur. Sur Ajaccio 20000, deux biens identiques sur le papier peuvent valoir 20 à 30 % de moins selon ces critères.",
    "Vérifier la cohérence du prix avec le rythme de vente : un appartement positionné 10 % au-dessus du marché reste en vitrine 6 à 12 mois, négocie ensuite -10 % et finit au prix du marché initial — perte sèche : le temps.",
    "Préparer en amont DPE, surface Carrez, dernier procès-verbal d'assemblée générale, montant exact des charges, taxe foncière. Un dossier complet rassure et accélère la décision.",
    "Soigner les photos : luminosité, angles larges, mise en valeur de l'extérieur, vue, hauteur sous plafond. C'est le premier filtre acheteur.",
    "Rester ouvert à une négociation modérée mais documentée : un acheteur sérieux fait toujours une proposition. Préparer ses arguments avant la mise en vente.",
  ],

  faq: [
    {
      question: 'Quel est le prix médian au m² à Ajaccio 20000 ?',
      answer:
        "Le prix médian au m² varie selon la typologie et l'année. Les médianes DVF actualisées sont affichées en haut de cette page. Sur 12 mois glissants, l'écart entre P25 et P75 reste significatif : votre bien peut se situer en bas, milieu ou haut de fourchette selon adresse, étage, ascenseur et état.",
    },
    {
      question: 'Quels sont les quartiers les plus chers du 20000 ?',
      answer:
        "Route des Sanguinaires (Scudo, Barbicaggia) pour les biens vue mer, vieille ville pour les rares biens rénovés, certains programmes récents de Trottel ou du quartier des Étrangers. À l'inverse, certaines rues étroites du centre sans ascenseur ni extérieur restent plus accessibles.",
    },
    {
      question: 'Combien valent un parking ou un garage à Ajaccio 20000 ?',
      answer:
        "Une place de parking sécurisée se valorise généralement entre 15 000 et 30 000 € selon le secteur (plus chère au centre dense). Un garage fermé peut dépasser 35 000 € sur les adresses les plus tendues.",
    },
    {
      question: 'Le DPE influence-t-il vraiment le prix de vente à Ajaccio 20000 ?',
      answer:
        "Oui. Un DPE F ou G impose la réalisation d'un audit énergétique, restreint la location et réduit le bassin d'acheteurs. À surface et adresse égales, l'écart entre un bon et un mauvais DPE peut atteindre 5 à 10 % du prix.",
    },
    {
      question: 'Faut-il rénover avant de vendre dans le 20000 ?',
      answer:
        "Tout dépend de l'ampleur. Les rafraîchissements (peinture, sols, salle de bain) sont souvent rentables. À l'inverse, une rénovation complète n'est pas systématiquement amortie : un acheteur préfère parfois acheter à rénover et faire à son goût. À discuter avec un expert local avant décision.",
    },
    {
      question: 'Combien de temps faut-il pour vendre un appartement à Ajaccio 20000 ?',
      answer:
        "Avec un prix correctement positionné dès la mise en vente, comptez 60 à 120 jours en moyenne. Les biens surévalués peuvent rester 6 à 12 mois et finir vendus en dessous du prix initialement raisonnable.",
    },
  ],
}
