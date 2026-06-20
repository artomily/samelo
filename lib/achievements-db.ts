import { createClient } from '@supabase/supabase-js'
import type { AchievementDefinition, UserAchievement } from './types/achievement'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getAllDefinitions(): Promise<AchievementDefinition[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('achievement_definitions')
    .select('*')
    .order('category')
  if (error) throw error
  return data ?? []
}

export async function getUserAchievements(wallet: string): Promise<UserAchievement[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, definition:achievement_definitions(*)')
    .eq('wallet', wallet.toLowerCase())
    .order('unlocked_at', { ascending: false, nullsFirst: false })
  if (error) throw error
  return data ?? []
}

export async function incrementProgress(
  wallet: string,
  achievementId: string,
  amount = 1
): Promise<UserAchievement | null> {
  const supabase = getSupabase()

  const { data: def } = await supabase
    .from('achievement_definitions')
    .select('threshold')
    .eq('id', achievementId)
    .single()

  if (!def) return null

  const { data: existing } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .eq('achievement_id', achievementId)
    .maybeSingle()

  if (existing?.unlocked_at) return existing

  const progress = (existing?.progress ?? 0) + amount
  const unlocked = progress >= def.threshold

  const { data, error } = await supabase
    .from('user_achievements')
    .upsert({
      wallet: wallet.toLowerCase(),
      achievement_id: achievementId,
      progress,
      unlocked_at: unlocked ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUnlockedCount(wallet: string): Promise<number> {
  const supabase = getSupabase()
  const { count } = await supabase
    .from('user_achievements')
    .select('*', { count: 'exact', head: true })
    .eq('wallet', wallet.toLowerCase())
    .not('unlocked_at', 'is', null)
  return count ?? 0
}
