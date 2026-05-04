import { NextResponse } from 'next/server'

const WP_BASE = 'https://vendreencorse.com/wp-json/wp/v2'
const TAG_ID = 186

export const revalidate = 86400

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get('limit') ?? 4), 12)

  const url = new URL(`${WP_BASE}/posts`)
  url.searchParams.set('tags', String(TAG_ID))
  url.searchParams.set('_embed', 'true')
  url.searchParams.set('per_page', String(limit))
  url.searchParams.set('orderby', 'date')
  url.searchParams.set('order', 'desc')

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 86400, tags: ['wp-articles'] },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return NextResponse.json([], { status: 200 })
    const data = await res.json()
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 })
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
