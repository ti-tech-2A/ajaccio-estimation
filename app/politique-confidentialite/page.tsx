/* eslint-disable react/no-unescaped-entities */

export const metadata = {
  title: 'Politique de confidentialité — ajaccio-estimation.fr',
}

const tocItems = [
  { id: 'collecte', label: 'Données collectées' },
  { id: 'utilisation', label: 'Utilisation des données' },
  { id: 'conservation', label: 'Durée de conservation' },
  { id: 'droits', label: 'Vos droits (RGPD)' },
  { id: 'cookies', label: 'Cookies et traceurs' },
  { id: 'contact', label: 'Contact DPO' },
]

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#FAF5EC]">
      {/* Hero band */}
      <section className="bg-[#1B4F72] pt-32 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-poppins)] text-white">
            Politique de confidentialité
          </h1>
        </div>
      </section>

      <div className="max-w-[960px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-[100px]">
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
            <section id="collecte">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Données collectées
              </h2>
              <ul className="text-[17px] leading-relaxed space-y-3 list-none">
                <li className="flex gap-3">
                  <span className="text-[#C9A96E] mt-1 shrink-0">—</span>
                  <span>
                    <strong className="text-[#1B4F72]">Formulaire d'estimation :</strong>{' '}
                    nom, email, téléphone, caractéristiques du bien
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#C9A96E] mt-1 shrink-0">—</span>
                  <span>
                    <strong className="text-[#1B4F72]">Formulaire de contact :</strong>{' '}
                    nom, téléphone, créneaux souhaités, message
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#C9A96E] mt-1 shrink-0">—</span>
                  <span>
                    <strong className="text-[#1B4F72]">Analytics :</strong>{' '}
                    données de navigation anonymisées (Google Analytics 4, consentement mode v2)
                  </span>
                </li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section id="utilisation">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Utilisation des données
              </h2>
              <p className="text-[17px] leading-relaxed mb-4">
                Vos données sont utilisées exclusivement pour :
              </p>
              <ul className="text-[17px] leading-relaxed space-y-3 list-none mb-4">
                <li className="flex gap-3">
                  <span className="text-[#C9A96E] mt-1 shrink-0">—</span>
                  <span>Vous transmettre votre estimation immobilière</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#C9A96E] mt-1 shrink-0">—</span>
                  <span>Vous recontacter si vous en faites la demande</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#C9A96E] mt-1 shrink-0">—</span>
                  <span>Améliorer les performances du site (analytics agrégés)</span>
                </li>
              </ul>
              <p className="text-[17px] leading-relaxed font-semibold text-[#1B4F72]">
                Vos données ne sont jamais revendues ni cédées à des tiers.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="conservation">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Durée de conservation
              </h2>
              <ul className="text-[17px] leading-relaxed space-y-3 list-none">
                <li className="flex gap-3">
                  <span className="text-[#C9A96E] mt-1 shrink-0">—</span>
                  <span>
                    <strong className="text-[#1B4F72]">Leads :</strong>{' '}
                    3 ans à compter du dernier contact
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#C9A96E] mt-1 shrink-0">—</span>
                  <span>
                    <strong className="text-[#1B4F72]">Analytics :</strong>{' '}
                    14 mois (paramétrage GA4)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#C9A96E] mt-1 shrink-0">—</span>
                  <span>
                    <strong className="text-[#1B4F72]">Cookies :</strong>{' '}
                    13 mois maximum
                  </span>
                </li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section id="droits">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Vos droits (RGPD)
              </h2>
              <p className="text-[17px] leading-relaxed mb-3">
                Vous disposez des droits suivants : accès, rectification, suppression, portabilité, opposition.
              </p>
              <p className="text-[17px] leading-relaxed mt-2">
                Pour exercer ces droits :{' '}
                <a href="mailto:contact@ajaccio-estimation.fr" className="text-[#2E86AB] hover:underline">
                  contact@ajaccio-estimation.fr
                </a>
              </p>
              <p className="text-[17px] leading-relaxed mt-2">
                Délai de réponse : 30 jours.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="cookies">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Cookies et traceurs
              </h2>
              <p className="text-[17px] leading-relaxed">
                Ce site utilise des cookies analytiques (GA4) uniquement avec votre consentement préalable
                (consent mode v2). Aucun cookie publicitaire n'est utilisé.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="contact">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-[#1B4F72] mb-4">
                Contact DPO
              </h2>
              <p className="text-[17px] leading-relaxed">
                Pour toute question relative à vos données :{' '}
                <a href="mailto:contact@ajaccio-estimation.fr" className="text-[#2E86AB] hover:underline">
                  contact@ajaccio-estimation.fr
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
