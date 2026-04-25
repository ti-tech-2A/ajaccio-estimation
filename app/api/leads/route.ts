import { RATE_LIMIT } from '@/lib/constants'
import { computeEstimation } from '@/lib/estimation/engine'
import { estimateRequestSchema, isOutsideCoverage } from '@/lib/server/form-schemas'
import { persistLeadFromEstimate } from '@/lib/server/persistence'
import { consumeRateLimit, getRequestIp } from '@/lib/server/rate-limit'
import { getSupabaseAdminClient } from '@/lib/server/supabase-admin'
import type { EstimationInput } from '@/types/estimation'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const ip = getRequestIp(req)
  const rateLimit = consumeRateLimit({
    key: `leads:${ip}`,
    max: RATE_LIMIT.leads.max,
    windowSeconds: RATE_LIMIT.leads.windowSeconds,
  })

  if (!rateLimit.ok) {
    return Response.json(
      { error: 'Trop de soumissions. Veuillez reessayer plus tard.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return Response.json({ error: 'Requete invalide.' }, { status: 400 })
  }

  const parsed = estimateRequestSchema.safeParse(payload)
  if (!parsed.success) {
    return Response.json(
      { error: 'Les donnees du lead sont invalides.', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const formData = { ...parsed.data, commune: 'Ajaccio' as const }

  if (isOutsideCoverage(formData.postalCode, formData.address)) {
    return Response.json(
      { error: "Les biens situes a Alata ne sont pas couverts par ajaccio-estimation.fr." },
      { status: 422 },
    )
  }

  if (formData.propertyType === 'terrain') {
    return Response.json(
      { error: "L'estimation de terrains n'est pas encore disponible." },
      { status: 422 },
    )
  }

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return Response.json({ error: 'Service temporairement indisponible.' }, { status: 503 })
  }

  const estimationInput: EstimationInput = {
    postalCode: formData.postalCode,
    propertyType: formData.propertyType,
    surface: formData.surface,
    rooms: formData.rooms,
    condition: formData.condition,
    features: formData.features,
    floor: formData.floor,
    totalFloors: formData.totalFloors,
    yearBuilt: formData.yearBuilt,
  }

  const estimation = await computeEstimation(supabase, estimationInput)

  const persistence = await persistLeadFromEstimate({
    formData,
    result: estimation,
    source: 'lead-api',
  })

  if (!persistence.leadInsert.persisted || !persistence.estimationInsert.persisted) {
    console.warn('[api/leads] persistence incomplete:', {
      leads: persistence.leadInsert.reason,
      estimations: persistence.estimationInsert.reason,
    })
  }

  if (!persistence.webhook.sent) {
    console.warn('[api/leads] n8n webhook not sent:', persistence.webhook.reason)
  }

  return Response.json({ ok: true, estimation })
}
