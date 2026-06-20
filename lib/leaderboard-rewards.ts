import { createClient } from '@supabase/supabase-js'
import { calcRewardAmount } from './types/leaderboard-rewards'
import type { RewardEpoch, RewardDistribution, RewardPeriod } from './types/leaderboard-rewards'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getActiveEpoch(period: RewardPeriod): Promise<RewardEpoch | null> {
  const supabase = getSupabase()
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('reward_epochs')
    .select('*')
    .eq('period', period)
    .lte('starts_at', now)
    .gte('ends_at', now)
    .single()
  return data ?? null
}

export async function createEpoch(
  period: RewardPeriod,
  epochNumber: number,
  startsAt: string,
  endsAt: string,
  totalPoolMelo: number
): Promise<RewardEpoch> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reward_epochs')
    .insert({ period, epoch_number: epochNumber, starts_at: startsAt, ends_at: endsAt, total_reward_pool_melo: totalPoolMelo })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function distributeRewards(
  epochId: string,
  leaderboard: { wallet: string; points: number }[]
): Promise<RewardDistribution[]> {
  const supabase = getSupabase()
  const epoch = await supabase.from('reward_epochs').select('total_reward_pool_melo').eq('id', epochId).single()
  const pool = epoch.data?.total_reward_pool_melo ?? 0

  const distributions = leaderboard.slice(0, 10).map((entry, i) => ({
    epoch_id: epochId,
    wallet: entry.wallet,
    rank: i + 1,
    points_earned: entry.points,
    melo_amount: calcRewardAmount(i + 1, pool),
  }))

  const { data, error } = await supabase
    .from('reward_distributions')
    .insert(distributions)
    .select()
  if (error) throw new Error(error.message)

  await supabase.from('reward_epochs').update({ distributed: true, distributed_at: new Date().toISOString() }).eq('id', epochId)

  return data ?? []
}

export async function getWalletRewards(wallet: string): Promise<RewardDistribution[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('reward_distributions')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}
