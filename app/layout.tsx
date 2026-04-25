import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Estimation immobilière Ajaccio — ajaccio-estimation.fr',
  description: "Estimation immobilière gratuite à Ajaccio. Données DVF réelles, expert local 25 ans d'expérience. Résultat instantané.",
  metadataBase: new URL('https://ajaccio-estimation.fr'),
}

import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="overflow-x-hidden">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
