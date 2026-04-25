/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link'

export const metadata = {
  title: 'Mentions légales — ajaccio-estimation.fr',
}

const tocItems = [
  { id: 'editeur', label: 'Éditeur du site' },
  { id: 'hebergement', label: 'Hébergement' },
  { id: 'propriete', label: 'Propriété intellectuelle' },
  { id: 'donnees', label: 'Données personnelles' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'responsabilite', label: 'Limitation de responsabilité' },
]

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#FAF5EC]">
      {/* Hero band */}
      <section className="bg-[#1B4F72] pt-32 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-poppins)] text-white">
            Mentions légales
          </h1>
        </div>
      </section>

      <div className="max-w-[960px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-[80px]">
              <p className="text-xs font-semibold text-[#9B9B9B] uppercase tracking-wider mb-3 font-[family-name:var(--font-open-sans)]">
                Sommaire
              </p>
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-[#5C5C5C] hover:text-[#2E86AB] transition-colors font-[family-name:var(--font-open-sans)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <div className="font-[family-name:var(--font-open-sans)] text-[#5C5C5C] space-y-12">
            <section id="editeur">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Éditeur du site
              </h2>
              <dl className="space-y-2 text-[17px] leading-relaxed">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[#1B4F72] min-w-[120px]">Nom :</dt>
                  <dd>[Prénom Nom]</dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[#1B4F72] min-w-[120px]">SIRET :</dt>
                  <dd>XXX XXX XXX XXXXX</dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[#1B4F72] min-w-[120px]">Adresse :</dt>
                  <dd>Ajaccio (20000), Corse-du-Sud</dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[#1B4F72] min-w-[120px]">Email :</dt>
                  <dd>
                    <a href="mailto:contact@ajaccio-estimation.fr" className="text-[#2E86AB] hover:underline">
                      contact@ajaccio-estimation.fr
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[#1B4F72] min-w-[120px]">Téléphone :</dt>
                  <dd>+33 X XX XX XX XX</dd>
                </div>
              </dl>
            </section>

            <hr className="border-gray-200" />

            <section id="hebergement">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Hébergement
              </h2>
              <p className="text-[17px] leading-relaxed">
                Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA
              </p>
              <p className="text-[17px] leading-relaxed mt-2">
                Site :{' '}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2E86AB] hover:underline"
                >
                  https://vercel.com
                </a>
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="propriete">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Propriété intellectuelle
              </h2>
              <p className="text-[17px] leading-relaxed">
                L'ensemble du contenu de ce site (textes, images, graphiques, données) est protégé par le droit d'auteur.
                Toute reproduction sans autorisation écrite est interdite.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="donnees">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Données personnelles
              </h2>
              <p className="text-[17px] leading-relaxed">
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
              </p>
              <p className="text-[17px] leading-relaxed mt-3">
                Contact :{' '}
                <a href="mailto:contact@ajaccio-estimation.fr" className="text-[#2E86AB] hover:underline">
                  contact@ajaccio-estimation.fr
                </a>
              </p>
              <p className="text-[17px] leading-relaxed mt-3">
                Pour en savoir plus, consultez notre{' '}
                <Link href="/politique-confidentialite" className="text-[#2E86AB] hover:underline">
                  politique de confidentialité
                </Link>
                .
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="cookies">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Cookies
              </h2>
              <p className="text-[17px] leading-relaxed">
                Ce site utilise des cookies analytiques (Google Analytics 4) avec votre consentement préalable.
                Vous pouvez retirer votre consentement à tout moment.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="responsabilite">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Limitation de responsabilité
              </h2>
              <p className="text-[17px] leading-relaxed">
                Les estimations fournies sont indicatives et ne constituent pas une expertise immobilière au sens légal.
                Les données DVF sont fournies à titre informatif. ajaccio-estimation.fr décline toute responsabilité
                quant à l'utilisation de ces données pour des décisions d'investissement.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
