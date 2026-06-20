import { createClient } from '@supabase/supabase-js'
import type { AchievementDefinitionV2, AchievementProgressV2, AchievementWithProgress } from './types/achievements-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getAllAchievementsV2(wallet?: string): Promise<AchievementWithProgress[]> {
  const supabase = getSupabase()
  const { data: defs } = await supabase
    .from('achievement_definitions_v2')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (!defs) return []
  if (!wallet) return defs.map((d) => ({ ...d, progress: null }))

  const { data: progress } = await supabase
    .from('achievement_progress_v2')
    .select('*')
    .eq('wallet', wallet)
    .in('achievement_id', defs.map((d: AchievementDefinitionV2) => d.id))

  const progressMap = new Map<string, AchievementProgressV2>()
  for (const p of progress ?? []) progressMap.set(p.achievement_id, p)

  return defs.map((d: AchievementDefinitionV2) => ({ ...d, progress: progressMap.get(d.id) ?? null }))
}

export async function incrementAchievementProgress(
  wallet: string,
  conditionType: string,
  incrementBy = 1
): Promise<AchievementProgressV2[]> {
  const supabase = getSupabase()
  const { data: matching } = await supabase
    .from('achievement_definitions_v2')
    .select('*')
    .eq('condition_type', conditionType)
    .eq('is_active', true)

  if (!matching || matching.length === 0) return []
  const updated: AchievementProgressV2[] = []

  for (const def of matching) {
    const { data: existing } = await supabase
      .from('achievement_progress_v2')
      .select('*')
      .eq('wallet', wallet)
      .eq('achievement_id', def.id)
      .single()

    const currentValue = (existing?.current_value ?? 0) + incrementBy
    const unlocked = currentValue >= def.condition_threshold
    const now = new Date().toISOString()

    const { data } = await supabase
      .from('achievement_progress_v2')
      .upsert({
        wallet,
        achievement_id: def.id,
        current_value: currentValue,
        unlocked,
        unlocked_at: unlocked && !existing?.unlocked ? now : existing?.unlocked_at ?? null,
        updated_at: now,
      }, { onConflict: 'wallet,achievement_id' })
      .select()
      .single()

    if (data) updated.push(data)
  }

  return updated
}
