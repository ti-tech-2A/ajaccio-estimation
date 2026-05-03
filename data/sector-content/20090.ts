import type { SectorContent } from './types'

export const SECTOR_20090: SectorContent = {
  postalCode: '20090',
  zoneTitle: 'Ajaccio sud — Aspretto, Les Cannes, Pietrina, Saint-Joseph',
  metaTitle: 'Prix immobilier Ajaccio 20090 : marché, quartiers, estimation',
  metaDescription:
    "Prix immobiliers à Ajaccio 20090 : médianes DVF par typologie, quartiers sud (Aspretto, Campo dell'Oro, Les Cannes, Saint-Joseph, Pietrina), profils acheteurs et critères de valeur.",

  introSummary:
    "Le code postal 20090 regroupe la façade sud d'Ajaccio : Aspretto et Campo dell'Oro en bord de mer, Bodiccione, l'Octroi, Les Cannes - Les Salines, Binda, Saint-Joseph, Candia, Saint-Jean et La Pietrina / Jardins de l'Empereur. Marché résidentiel plus récent que le 20000, dominé par les appartements des années 1980-2000, les maisons individuelles en secteur péri-urbain et quelques opérations neuves. Proximité de l'aéroport, de la rocade et du littoral : des atouts forts pour les actifs, les familles et les résidences secondaires.",

  positioning: {
    tagline: 'Résidentiel, mer accessible, familles, actifs, neuf disponible',
    angle:
      "Marché de la périphérie sud ajaccienne, plus abordable que le 20000 en centre dense, avec une dominante résidentielle récente, une offre villa plus présente et un accès direct aux plages.",
    questions: [
      {
        question: 'Où se situe ce secteur dans Ajaccio ?',
        answer:
          "Le 20090 occupe la façade sud de la commune : du port de plaisance d'Aspretto jusqu'à La Pietrina, en longeant la baie de Ricanto. Accès direct à la rocade, à l'aéroport et aux plages.",
      },
      {
        question: 'Quels types de biens y sont présents ?',
        answer:
          "Mix résidentiel : appartements en résidences des années 1980-2000, quelques opérations récentes (BBC, loggia), maisons individuelles à Saint-Joseph et Saint-Jean, et villas plus spacieuses en frange périurbaine.",
      },
      {
        question: 'Quels prix observe-t-on réellement ?',
        answer:
          "Le 20090 affiche en général une médiane légèrement inférieure au centre 20000, avec une offre villa plus étoffée. Les biens vue mer à Aspretto ou Les Salines tirent les prix vers le haut ; les secteurs de Binda ou Saint-Jean restent plus accessibles.",
      },
      {
        question: 'Pourquoi les prix varient-ils fortement ?',
        answer:
          "La proximité de la mer (Aspretto, Salines), l'état de la résidence, la présence d'un parking et d'un extérieur, ainsi que l'accès à la rocade sont les principaux déterminants. Un bien bien exposé à Aspretto peut valoir 30 % de plus qu'un appartement équivalent en intérieur de quartier.",
      },
      {
        question: 'Comment vendre correctement dans ce secteur ?',
        answer:
          "Comparer aux ventes DVF dans le même sous-quartier et la même fourchette de surface. Ne pas utiliser la médiane globale du CP : l'hétérogénéité entre Aspretto et Binda est forte. Valoriser tout élément extérieur, stationnement et proximité de la plage.",
      },
      {
        question: 'Le secteur est-il recherché par des familles ou des investisseurs ?',
        answer:
          "Principalement des familles primo-accédantes et des actifs qui cherchent plus de surface pour leur budget. Investisseurs présents sur les T2/T3 proches des plages pour la location saisonnière. Résidences secondaires actives à Aspretto et aux Cannes.",
      },
      {
        question: "La proximité de l'aéroport est-elle un problème ?",
        answer:
          "Couloir de bruit limité aux abords immédiats de l'aéroport. Pour la plupart des adresses du 20090, le bruit est peu perçu. En revanche, la facilité d'accès (15 min Ajaccio centre, 5 min aéroport) est un atout réel pour les actifs et les propriétaires de résidences secondaires.",
      },
    ],
  },

  microSectors: [
    {
      name: "Aspretto / Campo dell'Oro",
      reading:
        "Bord de mer, résidences avec vue, port de plaisance à pied, plages de Ricanto accessibles. Marché premium pour le 20090.",
      vigilance:
        "Proximité aéroport à vérifier selon l'adresse exacte, charges de copropriété parfois élevées sur les résidences avec piscine ou gardien.",
    },
    {
      name: 'Bodiccione',
      reading:
        "Quartier résidentiel intermédiaire, bien desservi par la rocade, mix appartements et petites maisons, prix plus abordables.",
      vigilance:
        "Hétérogénéité de l'offre, certaines rues en pente, état des copropriétés variable selon le programme.",
    },
    {
      name: "L'Octroi",
      reading:
        "Secteur de transition entre centre et sud, immeubles années 1970-2000, bonne desserte, demande locative soutenue.",
      vigilance:
        "Copropriétés souvent vieillissantes, DPE fréquemment en D-E sur le parc ancien.",
    },
    {
      name: 'Les Cannes – Les Salines',
      reading:
        "Littoral avec accès plage, résidences touristiques et résidentielles, demande secondaire forte, vue mer sur les étages hauts.",
      vigilance:
        "Marché saisonnier : attention à l'estimation sur un marché de résidences secondaires, ventes concentrées sur certaines périodes.",
    },
    {
      name: 'Binda / Saint-Joseph / Candia',
      reading:
        "Secteur plus intérieur, maisons individuelles, jardins, tranquillité, prix au m² parmi les plus abordables du 20090.",
      vigilance:
        "Accès voiture indispensable, services et commerces moins immédiats, impact sur liquidité à la revente.",
    },
    {
      name: "Saint-Jean / La Pietrina / Jardins de l'Empereur",
      reading:
        "Quartier résidentiel familial, pavillons et petits collectifs, espaces verts, crèches et écoles à proximité.",
      vigilance:
        "Marché plus étroit, moins de transactions — les médianes DVF sont à interpréter avec prudence sur les volumes faibles.",
    },
  ],

  buyerProfiles: [
    {
      profile: 'Famille primo-accédante',
      searchingFor:
        "T3/T4 avec parking, école à proximité, budget maîtrisé, plus de surface qu'au 20000.",
      argument:
        "Surface habitable, configuration, parking, école et commerces de proximité, charges prévisibles.",
    },
    {
      profile: 'Actif en mobilité',
      searchingFor:
        "T2/T3 bien situé par rapport à la rocade, accès aéroport rapide, parking, résidence en bon état.",
      argument:
        "Accessibilité, stationnement, état général, charges maîtrisées.",
    },
    {
      profile: 'Résidence secondaire littorale',
      searchingFor:
        "Appartement à Aspretto, Salines ou Cannes, vue mer ou accès plage direct, terrasse.",
      argument:
        "Vue mer, terrasse, qualité de la résidence, proximité plage, facilité de gestion à distance.",
    },
    {
      profile: 'Investisseur locatif',
      searchingFor:
        "T2/T3 proche plage pour saisonniers, ou T2 proche zone économique pour locatif long terme.",
      argument:
        "Rendement brut, taux d'occupation estival, charges, réglementation courte durée, DPE.",
    },
    {
      profile: 'Retraité actif',
      searchingFor:
        "Appartement ou petite maison de plain-pied, calme, jardin ou terrasse, commerces accessibles.",
      argument:
        "Accessibilité, calme, extérieur privatif, charges prévisibles, proximité soins.",
    },
    {
      profile: 'Acquéreur de maison individuelle',
      searchingFor:
        "Villa ou maison avec jardin à Saint-Joseph, Saint-Jean ou Pietrina, garage, 100–200 m².",
      argument:
        "Espace, jardin, garage, indépendance, tranquillité, bonne connexion routière.",
    },
  ],

  valuationFactors: [
    { label: 'Vue mer ou accès direct plage', impact: 'fort', detail: "Prime significative sur Aspretto, Les Salines et Les Cannes. Un appartement avec vue mer peut valoir 20 à 30 % de plus qu'un bien comparable sans vue." },
    { label: 'Terrasse ou loggia exploitable', impact: 'fort', detail: "Critère devenu prioritaire. Surface extérieure ≥8 m² avec usage réel valorise nettement, surtout dans les résidences récentes." },
    { label: 'Parking privatif ou garage', impact: 'fort', detail: "Très recherché : évite la contrainte du stationnement public et facilite la revente. Valorise de 12 000 à 25 000 € selon le secteur." },
    { label: 'Résidence BBC / récente (< 2010)', impact: 'moyen', detail: "Meilleur DPE, charges souvent mieux gérées, copropriété plus jeune. Argument commercial direct auprès des acheteurs à financement." },
    { label: 'Ascenseur (≥2e étage)', impact: 'fort', detail: "Critère discriminant dès le 2e étage, essentiel pour toucher familles et seniors." },
    { label: 'Jardin ou terrain privatif', impact: 'fort', detail: "Forte demande sur les maisons avec jardin clos. Surface et exposition sont les premiers critères regardés." },
    { label: 'Rénovation récente (< 5 ans)', impact: 'moyen', detail: "Rassure sur l'absence de travaux immédiats. Cuisine et salle de bain refaites = argument commercial concret." },
    { label: 'Climatisation réversible', impact: 'moyen', detail: "Confort été indispensable dans le 20090. Biens exposés sud/ouest l'apprécient particulièrement." },
    { label: 'Bon DPE (A à C)', impact: 'moyen', detail: "Ouvre tous les financements, rassure sur les charges futures. Devient discriminant à mesure que les DPE F/G sont interdits à la location." },
    { label: 'Calme et absence de nuisance sonore', impact: 'moyen', detail: "Atout réel dans les quartiers les plus exposés à la rocade ou aux couloirs de circulation." },
    { label: 'Résidence bien entretenue', impact: 'moyen', detail: "Façades, parties communes, espaces verts : un bâti entretenu réduit la perception de risque acheteur." },
    { label: 'Proximité plage pédestre', impact: 'fort', detail: "Accès plage < 5 min à pied = levier fort sur Aspretto et Les Cannes. Argument massif pour résidences secondaires." },
  ],

  discountFactors: [
    { label: 'Couloir de bruit aéroport', impact: 'fort', detail: "Biens sous les trajectoires d'approche : décote réelle, obligation de déclaration en compromis." },
    { label: 'Aucun extérieur (ni balcon ni terrasse)', impact: 'fort', detail: "Critère rédhibitoire croissant, surtout sur le marché résidence secondaire et familles." },
    { label: 'Copropriété dégradée ou travaux votés', impact: 'fort', detail: "Procès-verbaux défavorables, ravalement ou toiture à refaire : frein et point de négociation systématique." },
    { label: 'Mauvais DPE (F ou G)', impact: 'fort', detail: "Interdit locatif progressif, financement plus difficile, bassin acheteurs réduit." },
    { label: 'Accès voiture uniquement (sans transports)', impact: 'moyen', detail: "Secteurs de Binda et Saint-Jean plus exposés. Pénalise les profils sans voiture ou les acheteurs qui prévoient une revente." },
    { label: 'Rez-de-chaussée sur rue passante', impact: 'moyen', detail: "Bruit, sécurité, humidité : triple frein à corriger dans le prix." },
    { label: 'Étage élevé sans ascenseur', impact: 'fort', detail: "Même logique que le 20000 : frein massif dès le 3e étage sans ascenseur." },
    { label: 'Travaux lourds nécessaires', impact: 'fort', detail: "Décote sur la valeur de marché + effet psychologique pour l'acheteur." },
    { label: 'Charges de copropriété élevées', impact: 'moyen', detail: "Résidences avec gardien, piscine ou ascenseur vétuste : charges >60 €/m²/an à anticiper dans la négociation." },
    { label: 'Vis-à-vis proche ou luminosité limitée', impact: 'moyen', detail: "Résidences denses des années 1980 : certains appartements pâtissent d'un vis-à-vis serré." },
  ],

  sellerAdvice: [
    "Comparer à des ventes DVF dans le même sous-quartier, pas sur l'ensemble du CP. L'écart de médiane entre Aspretto et Binda peut dépasser 1 000 €/m² — une comparaison trop large fausse le positionnement.",
    "Mettre en avant chaque atout extérieur : terrasse, loggia, jardin, vue. Dans le 20090, l'extérieur est souvent le premier élément mentionné par les acheteurs dans leur recherche.",
    "Anticiper la question du parking dès la mise en annonce. Si une place est incluse, la mentionner en premier plan — c'est un critère de filtre prioritaire sur les portails.",
    "Préparer le DPE avant la mise en vente : un DPE D ou E déjà connu rassure plus qu'un DPE inconnu. S'il est F ou G, envisager une estimation du coût de rénovation pour informer les acheteurs.",
    "Ne pas surévaluer sur la base de ventes de la période COVID (2020-2021) : les médianes DVF sur 12 mois glissants sont plus représentatives de la réalité actuelle du marché.",
  ],

  faq: [
    {
      question: 'Quel est le prix médian au m² à Ajaccio 20090 ?',
      answer:
        "Les médianes DVF actualisées sont affichées en haut de cette page. Le 20090 présente en général une médiane légèrement inférieure au 20000 centre-ville, avec une plus grande part de villas et un marché résidentiel moins dense. L'écart intra-CP entre Aspretto et les secteurs intérieurs peut dépasser 30 %.",
    },
    {
      question: 'Quel secteur du 20090 est le plus cher ?',
      answer:
        "Aspretto et les bords des Cannes-Salines, pour les biens vue mer et accès plage. Les résidences récentes bien entretenues avec terrasse et parking y atteignent les prix les plus élevés du CP.",
    },
    {
      question: 'Les maisons sont-elles plus nombreuses dans le 20090 que dans le 20000 ?',
      answer:
        "Oui. Le 20090 compte proportionnellement plus de maisons individuelles, notamment à Saint-Joseph, Saint-Jean et La Pietrina. Le marché villa y est plus étoffé et les volumes DVF sur ce segment suffisent pour des estimations fiables.",
    },
    {
      question: "La proximité de l'aéroport pèse-t-elle sur les prix ?",
      answer:
        "Seulement sur les adresses directement sous les couloirs de bruit. Pour la majorité des biens du 20090, la contrainte aéroport est inexistante ou très faible. En revanche, l'accessibilité rapide (A51, rocade) est un atout réel souvent valorisé par les acheteurs.",
    },
    {
      question: 'Y a-t-il du neuf disponible dans le 20090 ?',
      answer:
        "Des opérations en VEFA ont été commercialisées ces dernières années dans le secteur. L'offre neuve reste limitée par le foncier, mais des programmes BBC existent. Ces biens n'apparaissent dans les DVF qu'à la livraison et à la première revente.",
    },
    {
      question: 'Combien de temps faut-il pour vendre dans le 20090 ?',
      answer:
        "Avec un prix correctement positionné, comptez 60 à 150 jours en moyenne selon le type de bien. Les maisons avec jardin et les appartements vue mer se vendent plus vite. Les biens en étage sans ascenseur ou sans extérieur peuvent dépasser 6 mois de commercialisation.",
    },
  ],
}
