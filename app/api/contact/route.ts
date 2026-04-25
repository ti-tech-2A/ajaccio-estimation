import { RATE_LIMIT } from '@/lib/constants'
import { contactRequestSchema } from '@/lib/server/form-schemas'
import { persistContactRequest } from '@/lib/server/persistence'
import { consumeRateLimit, getRequestIp } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const ip = getRequestIp(req)
  const rateLimit = consumeRateLimit({
    key: `contact:${ip}`,
    max: RATE_LIMIT.leads.max,
    windowSeconds: RATE_LIMIT.leads.windowSeconds,
  })

  if (!rateLimit.ok) {
    return Response.json(
      { error: 'Trop de demandes. Veuillez patienter avant de reessayer.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    )
  }

  let payload: unknown

  try {
    payload = await req.json()
  } catch {
    return Response.json({ error: 'Requete invalide.' }, { status: 400 })
  }

  const parsed = contactRequestSchema.safeParse(payload)

  if (!parsed.success) {
    return Response.json(
      {
        error: 'Le formulaire de rappel est incomplet.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const persistence = await persistContactRequest(parsed.data)

  if (!persistence.contactInsert.persisted) {
    console.warn('[api/contact] persistence incomplete:', persistence.contactInsert.reason)
  }

  if (!persistence.webhook.sent) {
    console.warn('[api/contact] n8n webhook not sent:', persistence.webhook.reason)
  }

  return Response.json({ ok: true })
}
