import type { SupabaseClient } from '@supabase/supabase-js'
import { getMissionProgress, isMissionComplete } from './missions'
import type { MissionType } from './types/missions'

interface UserStats {
  watchCount: number
  quizCount: number
  referralCount: number
  totalPoints: number
}

/**
 * Fetch current stats for a wallet needed to compute mission progress.
 */
export async function fetchUserStats(supabase: SupabaseClient, wallet: string): Promise<UserStats> {
  const [watches, quizzes, referrals, profile] = await Promise.all([
    supabase.from('watches').select('id', { count: 'exact', head: true }).eq('wallet_address', wallet),
    supabase.from('user_quiz_attempts').select('id', { count: 'exact', head: true }).eq('wallet_address', wallet),
    supabase.from('referrals').select('id', { count: 'exact', head: true }).eq('referrer_wallet', wallet),
    supabase.from('profiles').select('total_points').eq('wallet_address', wallet).maybeSingle(),
  ])

  return {
    watchCount: watches.count ?? 0,
    quizCount: quizzes.count ?? 0,
    referralCount: referrals.count ?? 0,
    totalPoints: profile.data?.total_points ?? 0,
  }
}

/**
 * Sync all mission progress for a wallet after a user action.
 * Called after watch complete, quiz submit, or referral redeem.
 */
export async function syncMissionProgress(supabase: SupabaseClient, wallet: string): Promise<void> {
  const [statsResult, missionsResult] = await Promise.all([
    fetchUserStats(supabase, wallet),
    supabase.from('missions').select('id, mission_type, target_value').eq('is_active', true),
  ])

  const stats = statsResult
  const missions = missionsResult.data ?? []
  const now = new Date().toISOString()

  for (const mission of missions) {
    const progress = getMissionProgress(mission.mission_type as MissionType, stats)
    const completed = isMissionComplete(progress, mission.target_value)

    await supabase
      .from('user_missions')
      .upsert(
        {
          wallet_address: wallet,
          mission_id: mission.id,
          progress,
          completed_at: completed ? now : null,
        },
        { onConflict: 'wallet_address,mission_id', ignoreDuplicates: false },
      )
  }
}
