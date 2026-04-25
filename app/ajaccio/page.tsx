import type { Metadata } from 'next'
import { JsonLd } from '@/components/ui/JsonLd'
import AjaccioPageContent from '@/components/ajaccio/AjaccioPageContent'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Ajaccio — Marché immobilier, démographie et urbanisme',
  description:
    "Tout sur le marché immobilier d'Ajaccio : prix au m², démographie, PLU, profil des acheteurs et vendeurs. Données DVF officielles.",
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: 'https://ajaccio-estimation.fr',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Ajaccio',
      item: 'https://ajaccio-estimation.fr/ajaccio',
    },
  ],
}

export default function AjaccioPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <AjaccioPageContent />
    </>
  )
}
