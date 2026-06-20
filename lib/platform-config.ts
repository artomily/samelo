import { createClient } from '@supabase/supabase-js'
import type { PlatformConfigEntry, PlatformSettings } from './types/platform-config'
import { DEFAULT_SETTINGS } from './types/platform-config'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getPublicConfig(): Promise<Partial<PlatformSettings>> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('platform_config')
    .select('key, value')
    .eq('is_public', true)

  if (!data) return DEFAULT_SETTINGS

  const result: Record<string, unknown> = {}
  for (const row of data) {
    try {
      result[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value
    } catch {
      result[row.key] = row.value
    }
  }
  return result as Partial<PlatformSettings>
}

export async function getAllConfig(): Promise<PlatformConfigEntry[]> {
  const supabase = getSupabase()
  const { data } = await supabase.from('platform_config').select('*').order('key')
  return data ?? []
}

export async function setConfig(key: string, value: unknown, updatedBy: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('platform_config')
    .update({ value: JSON.stringify(value), updated_by: updatedBy, updated_at: new Date().toISOString() })
    .eq('key', key)
}

export async function getConfigValue<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabase()
  const { data } = await supabase.from('platform_config').select('value').eq('key', key).single()
  if (!data) return fallback
  try {
    return (typeof data.value === 'string' ? JSON.parse(data.value) : data.value) as T
  } catch {
    return fallback
  }
}
