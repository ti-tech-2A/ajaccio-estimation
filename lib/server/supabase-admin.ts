import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cachedAdminClient: SupabaseClient | null | undefined
let cachedReadClient: SupabaseClient | null | undefined

export type InsertRecordResult =
  | { persisted: true; reason: null }
  | {
      persisted: false
      reason: 'missing_config' | 'insert_failed' | 'request_failed'
    }

function getSupabaseConfig() {
  return {
    url:
      process.env.SUPABASE_URL ??
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SERVICE_KEY,
    anonKey:
      process.env.SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.SUPABASE_KEY,
  }
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (cachedAdminClient !== undefined) {
    return cachedAdminClient
  }

  const { url, serviceRoleKey } = getSupabaseConfig()

  if (!url || !serviceRoleKey) {
    cachedAdminClient = null
    return cachedAdminClient
  }

  cachedAdminClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return cachedAdminClient
}

export function getSupabaseReadClient(): SupabaseClient | null {
  if (cachedReadClient !== undefined) {
    return cachedReadClient
  }

  const { url, serviceRoleKey, anonKey } = getSupabaseConfig()
  const readKey = serviceRoleKey || anonKey

  if (!url || !readKey) {
    cachedReadClient = null
    return cachedReadClient
  }

  cachedReadClient = createClient(url, readKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return cachedReadClient
}

export async function insertRecord(
  table: string,
  payload: Record<string, unknown>,
): Promise<InsertRecordResult> {
  const client = getSupabaseAdminClient()

  if (!client) {
    return { persisted: false, reason: 'missing_config' as const }
  }

  try {
    const { error } = await client.from(table).insert(payload)

    if (error) {
      console.error(`[supabase] insert failed for ${table}:`, error.message)
      return { persisted: false, reason: 'insert_failed' as const }
    }

    return { persisted: true, reason: null }
  } catch (error) {
    console.error(`[supabase] request failed for ${table}:`, error)
    return { persisted: false, reason: 'request_failed' as const }
  }
}
