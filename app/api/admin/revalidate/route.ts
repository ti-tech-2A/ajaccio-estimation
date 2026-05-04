import { revalidatePath } from 'next/cache'
import { createHash, timingSafeEqual } from 'crypto'

function safeCompare(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  const secret = process.env.ADMIN_SECRET

  if (!secret || !authHeader || !safeCompare(authHeader, `Bearer ${secret}`)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const paths = ['/marche', '/marche/20000', '/marche/20090', '/marche/20167']
  paths.forEach((p) => revalidatePath(p))

  return Response.json({ revalidated: true, paths })
}
