import type { ArticleTeaser, WPMediaItem, WPPost } from '@/types/wp'

const WP_BASE = 'https://vendreencorse.com/wp-json/wp/v2'
const TAG_ID = 186
const REVALIDATE_SECONDS = 60 * 60 * 24

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function truncate(input: string, maxChars: number): string {
  if (input.length <= maxChars) return input
  const cut = input.slice(0, maxChars)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

function pickImage(media: WPMediaItem | undefined, title: string): ArticleTeaser['image'] {
  if (!media?.source_url) return null
  const sizes = media.media_details?.sizes
  const preferred = sizes?.medium_large ?? sizes?.large ?? sizes?.medium ?? sizes?.full
  const src = preferred?.source_url ?? media.source_url
  const width = preferred?.width ?? media.media_details?.width ?? 800
  const height = preferred?.height ?? media.media_details?.height ?? 600
  return {
    src,
    alt: media.alt_text?.trim() || title,
    width,
    height,
  }
}

function pickCategory(post: WPPost): string | null {
  const terms = post._embedded?.['wp:term']
  if (!terms) return null
  // wp:term[0] = categories, wp:term[1] = tags
  const categories = terms[0]
  if (!Array.isArray(categories) || categories.length === 0) return null
  const cat = categories.find((t) => t.taxonomy === 'category' && t.slug !== 'uncategorized') ?? categories[0]
  return cat ? decodeHtmlEntities(cat.name) : null
}

function toTeaser(post: WPPost): ArticleTeaser {
  const title = decodeHtmlEntities(stripHtml(post.title.rendered))
  const excerpt = truncate(decodeHtmlEntities(stripHtml(post.excerpt.rendered)), 140)
  const featured = post._embedded?.['wp:featuredmedia']?.[0]
  return {
    id: post.id,
    title,
    excerpt,
    link: post.link,
    date: post.date,
    category: pickCategory(post),
    image: pickImage(featured, title),
  }
}

export async function getAjaccioArticles(limit = 4): Promise<ArticleTeaser[]> {
  const url = new URL(`${WP_BASE}/posts`)
  url.searchParams.set('tags', String(TAG_ID))
  url.searchParams.set('_embed', 'true')
  url.searchParams.set('per_page', String(limit))
  url.searchParams.set('orderby', 'date')
  url.searchParams.set('order', 'desc')

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS, tags: ['wp-articles'] },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return []
    const posts = (await res.json()) as WPPost[]
    if (!Array.isArray(posts)) return []
    return posts.map(toTeaser)
  } catch {
    return []
  }
}
