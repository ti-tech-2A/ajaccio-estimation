export interface WPRenderedField {
  rendered: string
  protected?: boolean
}

export interface WPMediaSize {
  source_url: string
  width: number
  height: number
}

export interface WPMediaItem {
  id: number
  source_url: string
  alt_text?: string
  media_details?: {
    width?: number
    height?: number
    sizes?: Record<string, WPMediaSize>
  }
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  taxonomy: string
}

export interface WPEmbedded {
  'wp:featuredmedia'?: WPMediaItem[]
  'wp:term'?: WPTerm[][]
}

export interface WPPost {
  id: number
  date: string
  link: string
  title: WPRenderedField
  excerpt: WPRenderedField
  _embedded?: WPEmbedded
}

export interface ArticleTeaser {
  id: number
  title: string
  excerpt: string
  link: string
  date: string
  category: string | null
  image: {
    src: string
    alt: string
    width: number
    height: number
  } | null
}
