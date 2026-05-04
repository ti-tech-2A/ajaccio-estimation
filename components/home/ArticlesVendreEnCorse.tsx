import { getAjaccioArticles } from '@/lib/server/wp-articles'
import ArticlesGrid from './ArticlesGrid'

const VEC_HOMEPAGE = 'https://vendreencorse.com/'

export default async function ArticlesVendreEnCorse() {
  const articles = await getAjaccioArticles(4)
  if (articles.length === 0) return null

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: article.link,
      name: article.title,
    })),
  }

  return (
    <section className="bg-white py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-[#C9A96E] text-sm tracking-[0.15em] uppercase font-semibold mb-3">
            Lectures recommandées
          </p>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2
              style={{
                fontFamily: 'var(--font-poppins)',
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: '#0F2A4A',
                lineHeight: 1.2,
              }}
            >
              À lire aussi sur le marché immobilier ajaccien
            </h2>
            <a
              href={VEC_HOMEPAGE}
              target="_blank"
              rel="noopener"
              className="text-[#0F2A4A] hover:text-[#C9A96E] transition-colors font-[family-name:var(--font-dm-sans)] font-medium underline-offset-4 hover:underline"
              style={{ fontSize: '13px' }}
            >
              Voir tous les articles →
            </a>
          </div>
        </div>

        <ArticlesGrid articles={articles} />
      </div>
    </section>
  )
}
