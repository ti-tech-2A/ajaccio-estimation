import type { Metadata } from 'next'
import { SITE_METADATA } from '@/data/site-metadata'

import Hero from '@/components/home/Hero'
import KpiStrip from '@/components/home/KpiStrip'
import ProblemSection from '@/components/home/ProblemSection'
import HowItWorks from '@/components/home/HowItWorks'
import Differentiators from '@/components/home/Differentiators'
import Testimonials from '@/components/home/Testimonials'
import PhotoGrid from '@/components/home/PhotoGrid'
import Coverage from '@/components/home/Coverage'
import FaqAccordion from '@/components/home/FaqAccordion'
import CtaFinal from '@/components/home/CtaFinal'
import JsonLd from '@/components/home/JsonLd'
import { getHomeKpiPayload } from '@/lib/server/market-signal'

export const revalidate = 86400

export const metadata: Metadata = {
  title: `${SITE_METADATA.tagline} - ${SITE_METADATA.name}`,
  description: SITE_METADATA.description,
  metadataBase: new URL(SITE_METADATA.url),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_METADATA.url,
    title: SITE_METADATA.tagline,
    description: SITE_METADATA.description,
    siteName: SITE_METADATA.name,
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Comment est calculee l'estimation ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Notre moteur analyse les transactions DVF des 24 derniers mois dans votre secteur. Apres nettoyage des valeurs aberrantes, nous calculons la mediane et appliquons des coefficients selon l'etage, l'etat, la vue et les prestations. La fourchette finale integre une marge de plus ou moins 10%.",
      },
    },
    {
      '@type': 'Question',
      name: "L'estimation est-elle gratuite et sans engagement ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, totalement. Vous obtenez une fourchette de prix immediate sans creer de compte.",
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle difference avec les estimateurs nationaux ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Les modeles nationaux distinguent mal les micro-zones ajacciennes. Notre outil est calibre exclusivement sur les 3 codes postaux d'Ajaccio.",
      },
    },
    {
      '@type': 'Question',
      name: "Quelle est la precision de l'estimation automatique ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Avec 10 transactions comparables ou plus, l'ecart moyen constate est de plus ou moins 8% par rapport au prix de vente final.",
      },
    },
    {
      '@type': 'Question',
      name: 'Mezzavia et Alata sont-ils differencies sur le CP 20167 ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Mezzavia, quartier d'Ajaccio, est inclus. Alata, commune independante, est exclue.",
      },
    },
    {
      '@type': 'Question',
      name: 'A quelle frequence les donnees DVF sont-elles mises a jour ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les donnees DVF sont publiees deux fois par an, debut mai et debut novembre.',
      },
    },
  ],
}

export default async function HomePage() {
  const homeKpis = await getHomeKpiPayload()

  return (
    <div className="premium-home">
      <JsonLd data={faqSchema} />
      <main className="relative z-10">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <KpiStrip metrics={homeKpis.metrics} sourceLabel={homeKpis.sourceLabel} />
        <Differentiators />
        <Testimonials />
        <PhotoGrid />
        <Coverage />
        <FaqAccordion />
        <CtaFinal />
      </main>
    </div>
  )
}
