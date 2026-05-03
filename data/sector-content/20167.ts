import type { SectorContent } from './types'

export const SECTOR_20167: SectorContent = {
  postalCode: '20167',
  zoneTitle: "Mezzavia — quartier d'Ajaccio",
  metaTitle: "Prix immobilier Mezzavia Ajaccio 20167 : marché, estimation DVF",
  metaDescription:
    "Prix immobiliers à Mezzavia, quartier d'Ajaccio (20167, INSEE 2A004) : médianes DVF, profils acheteurs, critères de valeur. Données exclusivement pour Mezzavia — commune d'Ajaccio. Alata exclue.",

  introSummary:
    "Mezzavia est un quartier périurbain de la commune d'Ajaccio, accessible via l'A51 et la route nationale. Le code postal 20167 couvre deux communes distinctes : Mezzavia (Ajaccio, INSEE 2A004) et Alata (commune indépendante) — cette page présente exclusivement les données de Mezzavia, filtrant rigoureusement les transactions d'Alata. Marché dominé par les maisons individuelles et les petits collectifs, avec davantage d'espace, de calme et de verdure qu'en centre-ville, pour des prix au m² généralement inférieurs.",

  positioning: {
    tagline: "Périurbain ajaccien, maisons, jardins, calme, accès A51",
    angle:
      "Marché résidentiel calme en périphérie d'Ajaccio, dominé par les maisons avec terrain, des prix plus accessibles que le centre et une offre villa plus étoffée.",
    questions: [
      {
        question: "Où se situe Mezzavia par rapport au centre d'Ajaccio ?",
        answer:
          "Mezzavia est à environ 8 à 12 km du centre-ville d'Ajaccio, accessible rapidement via l'A51. Quartier résidentiel périurbain, sans densité urbaine, avec un caractère plus campagnard.",
      },
      {
        question: "Quels types de biens trouve-t-on à Mezzavia ?",
        answer:
          "Dominante maisons individuelles avec terrain, quelques petits collectifs récents. L'offre villa avec jardin et garage y est nettement plus présente qu'en centre-ville. Les appartements restent minoritaires dans le parc.",
      },
      {
        question: "Les prix sont-ils différents du reste d'Ajaccio ?",
        answer:
          "Oui. Le prix médian au m² à Mezzavia est généralement inférieur aux secteurs 20000 et 20090, reflet d'un marché moins tendu, plus spacieux et plus éloigné du littoral. Le différentiel est particulièrement net sur les villas.",
      },
      {
        question: "Pourquoi les volumes de transactions sont-ils plus faibles ?",
        answer:
          "Mezzavia est un secteur moins dense que le centre. Moins de biens, moins de rotations. Les médianes DVF sont à interpréter avec prudence sur les petits volumes — un échantillon de moins de 10 ventes impose une lecture large.",
      },
      {
        question: "Quels profils achètent à Mezzavia ?",
        answer:
          "Principalement des familles cherchant plus de surface pour le même budget, des actifs attirés par le calme et l'accès rapide à la rocade, et des retraités cherchant un cadre de vie aéré avec jardin.",
      },
      {
        question: "Y a-t-il des risques particuliers à Mezzavia ?",
        answer:
          "Certaines parcelles sont soumises à un aléa inondation lié aux cours d'eau secondaires. La dépendance à la voiture est totale — à anticiper pour la liquidité à la revente. Vérifier le PLU sur chaque parcelle.",
      },
      {
        question: "Comment distinguer Mezzavia d'Alata pour une estimation ?",
        answer:
          "Le code postal 20167 est partagé entre Mezzavia (commune d'Ajaccio, INSEE 2A004) et Alata (commune indépendante). Notre moteur filtre systématiquement sur la commune Ajaccio et l'INSEE 2A004 pour n'utiliser que les données de Mezzavia.",
      },
    ],
  },

  microSectors: [
    {
      name: "Mezzavia bourg / centre de quartier",
      reading:
        "Secteur le plus dense de Mezzavia, mix maisons mitoyennes et petits collectifs, commerces de proximité, école. Marché résidentiel stable.",
      vigilance:
        "Densité plus forte qu'ailleurs à Mezzavia, stationnement parfois limité près des commerces, état des biens variable selon l'époque de construction.",
    },
    {
      name: "Secteur résidentiel diffus (pavillons isolés)",
      reading:
        "Maisons individuelles avec jardin sur terrain 400-1000 m², calme, vues sur le maquis, garage, espace privatif important.",
      vigilance:
        "Accès voiture obligatoire, desserte transport inexistante, vérifier l'état de la fosse septique et les raccordements réseaux sur les lots les plus isolés.",
    },
    {
      name: "Franges hautes / secteur collinaire",
      reading:
        "Villas avec vues panoramiques sur le golfe d'Ajaccio et les montagnes, terrain souvent en pente, constructions récentes.",
      vigilance:
        "Accès parfois en pente raide, entretien du terrain plus contraignant, prix plus élevés à la vente mais liquidité moindre sur les biens atypiques.",
    },
  ],

  buyerProfiles: [
    {
      profile: "Famille avec enfants en bas âge",
      searchingFor:
        "Maison T4/T5 avec jardin, garage, école primaire à Mezzavia ou Ajaccio, budget limité.",
      argument:
        "Espace, jardin clos pour les enfants, calme, garage, surface habitable maximale pour le budget.",
    },
    {
      profile: "Actif navetteur",
      searchingFor:
        "Maison ou appartement bien placé par rapport à l'A51, accès rapide au centre et à l'aéroport.",
      argument:
        "Temps de trajet maîtrisé, parking facile, calme résidentiel, plus de surface qu'en ville pour le même prix.",
    },
    {
      profile: "Retraité cherchant espace et verdure",
      searchingFor:
        "Maison plain-pied ou de plain-pied accessible, jardin entretenu, calme, pas de copropriété contraignante.",
      argument:
        "Tranquillité, espace extérieur privatif, cadre de vie aéré, charges réduites par rapport à une résidence collective.",
    },
    {
      profile: "Primo-accédant à budget serré",
      searchingFor:
        "Maison T3/T4 ou appartement à prix inférieur au marché ajaccien, quitte à faire des travaux.",
      argument:
        "Prix au m² accessible, possibilité de plus grande surface, cadre de vie agréable hors centre.",
    },
    {
      profile: "Investisseur foncier / terrain à bâtir",
      searchingFor:
        "Terrain constructible en zone AU, projet de construction neuve, potentiel locatif à terme.",
      argument:
        "Prix du foncier inférieur au centre, zone encore constructible selon PLU, cadre péri-urbain recherché.",
    },
    {
      profile: "Second acheteur / agrandissement",
      searchingFor:
        "Maison plus grande après revente d'un appartement en ville, jardin, garage double, cave.",
      argument:
        "Gain d'espace net, environnement plus calme, prix permettant d'absorber la différence de surface.",
    },
  ],

  valuationFactors: [
    { label: "Terrain plat et bien exposé", impact: 'fort', detail: "Prime marquée sur les terrains exploitables facilement — jardin plat orienté sud/ouest est le critère n°1 sur les maisons." },
    { label: "Vue dégagée sur le golfe ou la montagne", impact: 'fort', detail: "Villas en position dominante avec panorama : différentiel notable sur les prix observés DVF." },
    { label: "Garage ou double garage", impact: 'fort', detail: "Indispensable à Mezzavia (voiture obligatoire). Garage fermé valorise de 15 000 à 30 000 € selon la taille." },
    { label: "Construction récente (< 2005) ou rénovée", impact: 'fort', detail: "Meilleur DPE, normes électriques et plomberie conformes. Réduit les incertitudes travaux pour l'acheteur." },
    { label: "Bonne isolation / bon DPE (A à C)", impact: 'moyen', detail: "Critère croissant. Mezzavia a un parc mixte — un DPE B ou C sur une maison est un argument commercial réel." },
    { label: "Piscine (intégrée, pas hors-sol)", impact: 'moyen', detail: "Plus-value réelle sur les villas avec terrain. Moins valorisante si la piscine est ancienne ou nécessite rénovation." },
    { label: "Terrain clos avec portail automatique", impact: 'moyen', detail: "Sécurité et confidentialité appréciées, surtout pour les familles avec enfants." },
    { label: "Aucun vis-à-vis / isolement réel", impact: 'moyen', detail: "Atout fort dans un marché où les acheteurs quittent la ville précisément pour plus d'espace et d'intimité." },
    { label: "Accès direct A51 / rocade (< 5 min)", impact: 'moyen', detail: "Compense la distance au centre. Un accès rapide à la rocade réduit le handicap navette." },
    { label: "Dépendances ou annexes", impact: 'faible', detail: "Cave, cellier, atelier, cabanon de jardin : valorisation modeste mais appréciée en pratique." },
    { label: "Plain-pied (maison de plain-pied)", impact: 'moyen', detail: "Très recherché par les seniors et les familles avec jeunes enfants. Facilite aussi la revente à long terme." },
    { label: "Rénovation cuisine et salle de bain récente", impact: 'moyen', detail: "Même logique qu'ailleurs : élimine le principal poste d'incertitude travaux pour l'acheteur." },
  ],

  discountFactors: [
    { label: "Dépendance totale à la voiture sans alternative", impact: 'fort', detail: "Aucun transport en commun fiable = frein pour acheteurs sans permis, seniors autonomes ou primo-accédants en couple mono-véhicule." },
    { label: "Terrain en forte pente non exploitable", impact: 'fort', detail: "Terrain en pente >20 % : jardin inutilisable, accès difficile, moins de valeur perçue." },
    { label: "Mauvais DPE (F ou G)", impact: 'fort', detail: "Même logique qu'en ville : interdiction locative progressive, financement plus difficile, bassin acheteurs réduit." },
    { label: "Travaux structurels importants (toiture, fondations)", impact: 'fort', detail: "Sur une maison individuelle, les travaux structurels génèrent une décote forte + effet psychologique majeur." },
    { label: "Fosse septique vieillissante ou non aux normes", impact: 'fort', detail: "Diagnostic fosse obligatoire à la vente. Remise aux normes coûteuse (5 000 à 15 000 €) : point de négociation systématique." },
    { label: "Isolation phonique inexistante (voisin proche)", impact: 'moyen', detail: "Paradoxal pour un secteur résidentiel calme — mais les constructions mitoyennes existent. Nuisance surprenante pour des acheteurs venus chercher le calme." },
    { label: "Petit terrain < 200 m²", impact: 'moyen', detail: "En dessous de 200 m² de terrain, l'atout espace-vert s'évapore. Réduit l'intérêt péri-urbain par rapport à un appartement en ville." },
    { label: "Accès par chemin privé sans titre de propriété clair", impact: 'fort', detail: "Servitude de passage non formalisée : risque juridique qui bloque les financements et effraye les acheteurs informés." },
    { label: "Humidité / infiltrations avérées", impact: 'fort', detail: "Sur une maison individuelle avec sous-sol ou terrain argilo-calcaire, l'humidité est un signal d'alarme immédiat." },
    { label: "Aucune vue (encaissé entre hautes clôtures)", impact: 'moyen', detail: "Mezzavia attire les acheteurs pour le cadre et l'espace — un bien sans vue ni dégagement perd cet argument distinctif." },
  ],

  sellerAdvice: [
    "Les volumes DVF à Mezzavia sont plus faibles qu'en centre-ville. Les comparables sont rares — ne pas se baser sur une ou deux ventes atypiques. Utiliser une fenêtre de 3 à 4 ans et valider avec un expert local du secteur.",
    "Mettre en avant chaque élément qui justifie le choix péri-urbain : jardin, calme, vue, espace, garage. Ce sont les raisons pour lesquelles les acheteurs viennent spécifiquement à Mezzavia plutôt qu'en ville.",
    "Faire réaliser le diagnostic fosse septique en amont si le bien est en assainissement individuel. Un diagnostic conforme est un argument commercial — un diagnostic défaillant devient un levier de négociation à la baisse.",
    "Ne pas surestimer le prix en comparant avec des ventes d'Alata : le CP 20167 inclut les deux communes. Les données DVF non filtrées peuvent inclure des transactions d'Alata, faussant le prix de référence. Utiliser exclusivement les comparables Mezzavia / Ajaccio INSEE 2A004.",
    "Préparer un dossier complet : DPE, surface loi Carrez ou surface habitable (maison), plan, dernier avis taxe foncière, titre de propriété avec accès. Le marché est moins liquide — un dossier solide réduit le délai de décision acheteur.",
  ],

  faq: [
    {
      question: "Pourquoi le code postal 20167 concerne-t-il deux communes ?",
      answer:
        "Le code postal 20167 couvre à la fois Mezzavia (quartier de la commune d'Ajaccio, code INSEE 2A004) et Alata (commune indépendante avec son propre code INSEE). Ce site présente exclusivement les données de Mezzavia. Toutes les requêtes DVF sont filtrées sur commune='Ajaccio' et code_insee='2A004' pour exclure Alata.",
    },
    {
      question: "Quel est le prix médian au m² à Mezzavia ?",
      answer:
        "Les médianes DVF actualisées sont affichées en haut de cette page. Les volumes de transactions étant plus faibles qu'en centre-ville, les médianes sont à interpréter avec davantage de prudence. Un expert local peut affiner l'estimation en tenant compte des spécificités de chaque parcelle.",
    },
    {
      question: "Les maisons sont-elles plus nombreuses que les appartements à Mezzavia ?",
      answer:
        "Oui. Le parc de Mezzavia est majoritairement composé de maisons individuelles et de pavillons. Les appartements existent dans les petits collectifs du bourg, mais restent minoritaires dans les transactions DVF.",
    },
    {
      question: "La distance au centre d'Ajaccio pèse-t-elle sur les prix ?",
      answer:
        "Oui, c'est l'un des facteurs qui expliquent des prix médians généralement inférieurs à ceux du 20000 ou du 20090. En contrepartie, les acheteurs obtiennent plus de surface, un terrain et un cadre de vie plus calme pour le même budget.",
    },
    {
      question: "Y a-t-il des risques naturels à connaître à Mezzavia ?",
      answer:
        "Certaines parties du territoire sont soumises à un aléa inondation lié aux cours d'eau secondaires. Il est recommandé de vérifier le Plan de Prévention des Risques d'Inondation (PPRI) auprès de la mairie d'Ajaccio avant tout achat.",
    },
    {
      question: "Combien de temps faut-il pour vendre une maison à Mezzavia ?",
      answer:
        "Le marché de Mezzavia est moins liquide qu'en centre-ville. Un bien correctement positionné peut se vendre en 90 à 180 jours. Les biens surévalués ou avec des problèmes techniques (fosse, toiture) peuvent rester plus d'un an en vente. La qualité du dossier et la présentation jouent un rôle plus important qu'ailleurs.",
    },
  ],
}
