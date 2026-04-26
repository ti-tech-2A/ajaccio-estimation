import { JsonLd } from '@/components/ui/JsonLd'
import FaqPageContent from '@/components/faq/FaqPageContent'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quel est le prix au m² à Ajaccio en 2026 ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le prix médian au m² à Ajaccio est de 3 400 € pour un appartement dans le secteur 20000 (centre-ville), 3 100 € dans le 20090 (secteur sud) et 2 900 € à Mezzavia (20167). Pour les villas, les prix varient de 3 500 à 4 200 €/m² selon la vue et les prestations. Ces données sont issues de la base DVF officielle, actualisées au 1er mai 2026.",
      },
    },
    {
      '@type': 'Question',
      name: 'Les prix varient-ils vraiment autant selon les quartiers ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui — à Ajaccio, l'écart entre un appartement route des Sanguinaires et un bien standard en périphérie peut dépasser 40 %. La route des Sanguinaires, le quartier des Étrangers et Trottel affichent des primes de localisation significatives.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment évolue le marché immobilier ajaccien ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sur les 12 derniers mois, les prix ont progressé de +3,2 % dans le 20000, +1,8 % dans le 20090 et +0,9 % à Mezzavia.',
      },
    },
    {
      '@type': 'Question',
      name: "Comment est calculée l'estimation ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Notre moteur analyse les transactions DVF des 24 derniers mois dans votre secteur exact. Après nettoyage des valeurs aberrantes (suppression des 25 % extrêmes), nous calculons la médiane des 50 % centraux. Des coefficients ajustent le prix selon l'étage, l'état, la vue et les prestations, avec un plafond cumulatif de ±40 %. La fourchette finale intègre une marge de ±10 %.",
      },
    },
    {
      '@type': 'Question',
      name: "L'estimation est-elle vraiment gratuite et sans engagement ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, totalement. Vous obtenez une fourchette de prix immédiatement, sans créer de compte, sans donner votre numéro de téléphone au préalable.",
      },
    },
    {
      '@type': 'Question',
      name: "Quelle est la précision de l'estimation automatique ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Avec 10 transactions comparables ou plus, l'écart moyen constaté est de ±8 % par rapport au prix de vente final. Entre 5 et 9 comparables, la précision est estimée à ±12 %.",
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle différence avec MeilleursAgents ou SeLoger ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Ces plateformes utilisent des modèles nationaux calibrés sur de grands volumes. Elles ne distinguent pas Mezzavia de Pietralba, ni la route des Sanguinaires d'un immeuble standard du 20090. Notre outil est calibré exclusivement sur les 3 codes postaux d'Ajaccio.",
      },
    },
    {
      '@type': 'Question',
      name: 'À quelle fréquence les données DVF sont-elles mises à jour ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les données DVF sont publiées deux fois par an par Étalab — début mai et début novembre. Notre base est synchronisée à chaque publication.',
      },
    },
    {
      '@type': 'Question',
      name: 'Les données DVF sont-elles fiables ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "La base DVF est produite par la Direction Générale des Finances Publiques à partir des actes notariés. Elle constitue la référence officielle des transactions immobilières en France.",
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle différence entre Mezzavia (Ajaccio) et Alata sur le code postal 20167 ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le CP 20167 couvre deux communes distinctes : Mezzavia, quartier de la commune d'Ajaccio (INSEE 2A004), inclus dans notre périmètre ; et Alata, commune indépendante exclue. Si votre bien est à Alata, il ne peut pas être estimé via ce site.",
      },
    },
    {
      '@type': 'Question',
      name: 'Pourquoi Porticcio et Bastelicaccia ne sont-ils pas couverts ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Notre périmètre actuel se limite à la commune d'Ajaccio (codes postaux 20000, 20090, 20167 Mezzavia). Porticcio et Bastelicaccia sont des communes indépendantes avec des dynamiques de marché différentes.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment fonctionne la taxe foncière à Ajaccio ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "La taxe foncière est calculée en appliquant le taux communal d'Ajaccio (50,34 % en 2025) à la valeur locative cadastrale (VLC) de votre bien.",
      },
    },
  ],
}

export default function FaqPage() {
  return (
    <>
      <JsonLd schema={faqSchema} />
      <FaqPageContent />
    </>
  )
}
