import type { EstimationResult, WizardFormData } from '@/types/estimation'
import { insertRecord } from '@/lib/server/supabase-admin'
import { sendN8nWebhook } from '@/lib/server/n8n-webhook'

const CONDITION_TO_DB: Record<WizardFormData['condition'], string> = {
  neuf: 'neuf',
  'tres-bon': 'tres_bon',
  bon: 'bon',
  'a-rafraichir': 'a_rafraichir',
  'a-renover': 'a_renover',
}

export async function persistLeadFromEstimate({
  formData,
  result,
  source,
}: {
  formData: WizardFormData
  result: EstimationResult
  source: string
}) {
  const payload = {
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    property_type: formData.propertyType,
    postal_code: formData.postalCode,
    commune: 'Ajaccio',
    commune_code_insee: '2A004',
    address: formData.address,
    surface: formData.surface,
    rooms: formData.rooms,
    bedrooms: formData.bedrooms,
    floor: formData.floor,
    total_floors: formData.totalFloors,
    land_surface: formData.landSurface,
    year_built: formData.yearBuilt,
    condition: CONDITION_TO_DB[formData.condition],
    features: formData.features,
    estimated_price_low: result.priceLow,
    estimated_price_high: result.priceHigh,
    estimated_price_sqm: result.priceMedianSqm,
    comparable_count: result.comparableCount,
    query_level: result.queryLevel,
    precision_level: result.precisionLevel,
    source,
    status: 'new',
    gdpr_consent: formData.gdprConsent,
    gdpr_consent_date: new Date().toISOString(),
  }

  const leadInsert = await insertRecord('leads', payload)
  const estimationInsert = await insertRecord('estimations', payload)
  const webhook = await sendN8nWebhook('lead_captured', {
    source,
    lead: {
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      postal_code: payload.postal_code,
      property_type: payload.property_type,
    },
    estimation: {
      estimated_price_low: payload.estimated_price_low,
      estimated_price_high: payload.estimated_price_high,
      estimated_price_sqm: payload.estimated_price_sqm,
      comparable_count: payload.comparable_count,
      query_level: payload.query_level,
      precision_level: payload.precision_level,
    },
    persistence: {
      leads: leadInsert.persisted,
      estimations: estimationInsert.persisted,
    },
  })

  return {
    leadInsert,
    estimationInsert,
    webhook,
  }
}

export async function persistContactRequest({
  fullName,
  phone,
  message,
  sourcePage,
  preferredTimeSlot,
  preferredDays,
}: {
  fullName: string
  phone: string
  message?: string
  sourcePage?: string
  preferredTimeSlot?: 'morning' | 'afternoon' | 'any'
  preferredDays?: string[]
}) {
  const payload = {
    full_name: fullName,
    phone,
    message: message ?? '',
    source_page: sourcePage ?? '',
    preferred_time_slot: preferredTimeSlot ?? 'any',
    preferred_days: preferredDays ?? [],
    status: 'new',
  }

  const contactInsert = await insertRecord('contact_requests', payload)
  const webhook = await sendN8nWebhook('contact_request_submitted', {
    contact: {
      full_name: payload.full_name,
      phone: payload.phone,
      source_page: payload.source_page,
      preferred_time_slot: payload.preferred_time_slot,
      preferred_days: payload.preferred_days,
    },
    message: payload.message,
    persistence: {
      contact_requests: contactInsert.persisted,
    },
  })

  return {
    contactInsert,
    webhook,
  }
}
