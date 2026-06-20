import { createClient } from '@supabase/supabase-js'
import type { XpEvent, XpSource } from './types/xp'
import { getLevelForXp } from './types/xp'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function awardXp(
  wallet: string,
  amount: number,
  source: XpSource,
  description?: string
): Promise<XpEvent> {
  const supabase = getSupabase()

  const { data: event, error } = await supabase
    .from('xp_events')
    .insert({ wallet: wallet.toLowerCase(), amount, source, description: description ?? null })
    .select()
    .single()
  if (error) throw error

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('wallet', wallet.toLowerCase())
    .maybeSingle()

  const newXp = (profile?.xp ?? 0) + amount
  const level = getLevelForXp(newXp)

  await supabase
    .from('profiles')
    .update({ xp: newXp, level: level.level, level_updated_at: new Date().toISOString() })
    .eq('wallet', wallet.toLowerCase())

  return event
}

export async function getXpHistory(wallet: string, limit = 20): Promise<XpEvent[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('xp_events')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getProfileXp(wallet: string): Promise<{ xp: number; level: number }> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('wallet', wallet.toLowerCase())
    .maybeSingle()
  return { xp: data?.xp ?? 0, level: data?.level ?? 1 }
}
