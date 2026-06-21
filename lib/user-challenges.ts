import { createClient } from '@supabase/supabase-js'
import type { Challenge, ChallengeProgress, ChallengeWithProgress } from './types/user-challenges'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getActiveChallenges(wallet?: string): Promise<ChallengeWithProgress[]> {
  const supabase = getSupabase()
  const { data: challenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('is_active', true)
    .order('created_at')

  if (!challenges) return []
  if (!wallet) return challenges.map((c) => ({ ...c, progress: null }))

  const { data: progresses } = await supabase
    .from('challenge_progress')
    .select('*')
    .eq('wallet', wallet)
    .in('challenge_id', challenges.map((c: Challenge) => c.id))

  const progressMap = new Map<string, ChallengeProgress>()
  for (const p of progresses ?? []) progressMap.set(p.challenge_id, p)

  return challenges.map((c: Challenge) => ({ ...c, progress: progressMap.get(c.id) ?? null }))
}

export async function incrementChallengeProgress(
  wallet: string,
  challengeId: string,
  by = 1
): Promise<ChallengeProgress> {
  const supabase = getSupabase()
  const { data: existing } = await supabase
    .from('challenge_progress')
    .select('*')
    .eq('wallet', wallet)
    .eq('challenge_id', challengeId)
    .single()

  const { data: challenge } = await supabase
    .from('challenges')
    .select('target_count')
    .eq('id', challengeId)
    .single()

  const currentCount = (existing?.current_count ?? 0) + by
  const completed = challenge ? currentCount >= challenge.target_count : false
  const completedAt = completed && !existing?.completed ? new Date().toISOString() : existing?.completed_at ?? null

  const { data, error } = await supabase
    .from('challenge_progress')
    .upsert({
      wallet,
      challenge_id: challengeId,
      current_count: currentCount,
      completed,
      completed_at: completedAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'wallet,challenge_id' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function claimChallengeReward(wallet: string, challengeId: string): Promise<number> {
  const supabase = getSupabase()
  const { data: progress } = await supabase
    .from('challenge_progress')
    .select('*')
    .eq('wallet', wallet)
    .eq('challenge_id', challengeId)
    .eq('completed', true)
    .eq('reward_claimed', false)
    .single()

  if (!progress) throw new Error('No claimable reward')

  const { data: challenge } = await supabase
    .from('challenges')
    .select('reward_melo')
    .eq('id', challengeId)
    .single()

  await supabase
    .from('challenge_progress')
    .update({ reward_claimed: true })
    .eq('id', progress.id)

  return challenge?.reward_melo ?? 0
}
