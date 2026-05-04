'use client'

import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ArticleCard from '@/components/articles/ArticleCard'
import type { ArticleTeaser, WPPost } from '@/types/wp'

const VEC_HOMEPAGE = 'https://vendreencorse.com/'

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…').replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function truncate(input: string, max: number): string {
  if (input.length <= max) return input
  const cut = input.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

function toTeaser(post: WPPost): ArticleTeaser {
  const title = decodeHtmlEntities(stripHtml(post.title.rendered))
  const excerpt = truncate(decodeHtmlEntities(stripHtml(post.excerpt.rendered)), 140)
  const featured = post._embedded?.['wp:featuredmedia']?.[0]
  const terms = post._embedded?.['wp:term']
  const categories = terms?.[0]
  const cat = categories?.find((t) => t.taxonomy === 'category' && t.slug !== 'uncategorized') ?? categories?.[0]
  const category = cat ? decodeHtmlEntities(cat.name) : null

  let image: ArticleTeaser['image'] = null
  if (featured?.source_url) {
    const sizes = featured.media_details?.sizes
    const preferred = sizes?.medium_large ?? sizes?.large ?? sizes?.medium ?? sizes?.full
    image = {
      src: preferred?.source_url ?? featured.source_url,
      alt: featured.alt_text?.trim() || title,
      width: preferred?.width ?? featured.media_details?.width ?? 800,
      height: preferred?.height ?? featured.media_details?.height ?? 600,
    }
  }

  return { id: post.id, title, excerpt, link: post.link, date: post.date, category, image }
}

export default function ArticlesVendreEnCorse() {
  const [articles, setArticles] = useState<ArticleTeaser[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  useEffect(() => {
    fetch('/api/wp-articles?limit=4')
      .then((r) => r.json())
      .then((data: WPPost[]) => {
        if (Array.isArray(data) && data.length > 0) setArticles(data.map(toTeaser))
      })
      .catch(() => {})
  }, [])

  if (articles.length === 0) return null

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: a.link,
      name: a.title,
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
            Acheter ou Vendre En Corse
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
              Décryptages du marché immobilier ajaccien
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

        <motion.div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
