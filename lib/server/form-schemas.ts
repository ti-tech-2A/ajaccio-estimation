import { z } from 'zod'
import { COVERED_POSTAL_CODES } from '@/lib/constants'

export const PHONE_REGEX = /^(\+33|0)[67]\d{8}$/

export const estimateRequestSchema = z.object({
  propertyType: z.enum(['appartement', 'villa', 'terrain']),
  address: z.string().trim().max(200).optional().default(''),
  postalCode: z.enum(COVERED_POSTAL_CODES),
  commune: z.string().trim().max(100).optional().default('Ajaccio'),
  surface: z.number().int().min(10).max(999),
  rooms: z.number().int().min(0).max(20).optional().default(1),
  bedrooms: z.number().int().min(0).max(15).optional().default(0),
  floor: z.number().int().min(0).max(30).optional(),
  totalFloors: z.number().int().min(1).max(50).optional(),
  landSurface: z.number().int().min(0).max(10000).optional(),
  yearBuilt: z.number().int().min(1900).max(2026).optional(),
  condition: z.enum(['neuf', 'tres-bon', 'bon', 'a-rafraichir', 'a-renover']).default('bon'),
  features: z.array(z.string().trim().min(1)).max(20).default([]),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200).transform((value) => value.toLowerCase()),
  phone: z.string().transform((value) => value.replace(/\s/g, '')),
  gdprConsent: z.literal(true),
}).refine((data) => PHONE_REGEX.test(data.phone), {
  message: 'Numero invalide. Format attendu : 06XXXXXXXX ou +336XXXXXXXX',
  path: ['phone'],
})

export const contactRequestSchema = z.object({
  full_name: z.string().trim().min(2).max(120).optional(),
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().transform((value) => value.replace(/\s/g, '')),
  message: z.string().trim().max(1000).optional().default(''),
  source_page: z.string().trim().max(200).optional(),
  sourcePage: z.string().trim().max(200).optional(),
  preferred_time_slot: z.enum(['morning', 'afternoon', 'any']).optional(),
  preferredTimeSlot: z.enum(['morning', 'afternoon', 'any']).optional(),
  preferred_days: z.array(z.string().trim().min(1).max(20)).max(6).optional(),
  preferredDays: z.array(z.string().trim().min(1).max(20)).max(6).optional(),
}).superRefine((data, ctx) => {
  if (!data.full_name && !data.fullName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Le nom est requis.',
      path: ['full_name'],
    })
  }

  if (!PHONE_REGEX.test(data.phone)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Numero invalide. Format attendu : 06XXXXXXXX ou +336XXXXXXXX',
      path: ['phone'],
    })
  }
}).transform((data) => ({
  fullName: data.full_name ?? data.fullName ?? '',
  phone: data.phone,
  message: data.message ?? '',
  sourcePage: data.source_page ?? data.sourcePage ?? '',
  preferredTimeSlot: data.preferred_time_slot ?? data.preferredTimeSlot,
  preferredDays: data.preferred_days ?? data.preferredDays ?? [],
}))

export function isOutsideCoverage(postalCode: string, address: string): boolean {
  return postalCode === '20167' && /\balata\b/i.test(address)
}
