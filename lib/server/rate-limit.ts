type Bucket = {
  count: number
  resetAt: number
}

declare global {
  var __ajaccioRateLimitStore: Map<string, Bucket> | undefined
}

const rateLimitStore = globalThis.__ajaccioRateLimitStore ?? new Map<string, Bucket>()

if (!globalThis.__ajaccioRateLimitStore) {
  globalThis.__ajaccioRateLimitStore = rateLimitStore
}

export function getRequestIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || '127.0.0.1'
  }

  return request.headers.get('x-real-ip') ?? '127.0.0.1'
}

export function consumeRateLimit({
  key,
  max,
  windowSeconds,
}: {
  key: string
  max: number
  windowSeconds: number
}) {
  const now = Date.now()
  const existing = rateLimitStore.get(key)

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    })

    return {
      ok: true,
      remaining: max - 1,
      retryAfterSeconds: windowSeconds,
    }
  }

  if (existing.count >= max) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  rateLimitStore.set(key, existing)

  return {
    ok: true,
    remaining: max - existing.count,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  }
}
