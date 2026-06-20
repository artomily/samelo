import { createClient } from '@supabase/supabase-js'
import type { StakingPosition, StakingReward, StakingTierV2 } from './types/staking-v2'
import { getTierConfigV2, calcDailyRewardPoints } from './types/staking-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createStakingPosition(
  wallet: string,
  amountMelo: number,
  tier: StakingTierV2,
  txHash?: string
): Promise<StakingPosition> {
  const supabase = getSupabase()
  const config = getTierConfigV2(tier)

  if (amountMelo < config.minMelo) {
    throw new Error(`Minimum stake for ${config.label} is ${config.minMelo} MELO`)
  }

  const stakedAt = new Date()
  const unstakeAt = new Date(stakedAt)
  unstakeAt.setDate(unstakeAt.getDate() + config.durationDays)

  const { data, error } = await supabase
    .from('staking_positions')
    .insert({
      wallet: wallet.toLowerCase(),
      amount_melo: amountMelo,
      tier,
      duration_days: config.durationDays,
      bonus_multiplier: config.bonusMultiplier,
      staked_at: stakedAt.toISOString(),
      unstake_at: unstakeAt.toISOString(),
      tx_hash: txHash ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getActivePositions(wallet: string): Promise<StakingPosition[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('staking_positions')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .is('unstaked_at', null)
    .order('staked_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function unstakePosition(positionId: string, wallet: string): Promise<void> {
  const supabase = getSupabase()

  const { data: position, error: posErr } = await supabase
    .from('staking_positions')
    .select('*')
    .eq('id', positionId)
    .eq('wallet', wallet.toLowerCase())
    .is('unstaked_at', null)
    .single()

  if (posErr || !position) throw new Error('Position not found')
  if (new Date() < new Date(position.unstake_at)) throw new Error('Position still locked')

  const { error } = await supabase
    .from('staking_positions')
    .update({ unstaked_at: new Date().toISOString() })
    .eq('id', positionId)
  if (error) throw error
}

export async function accrueEpochRewards(epochDate: string): Promise<void> {
  const supabase = getSupabase()

  const { data: positions } = await supabase
    .from('staking_positions')
    .select('*')
    .is('unstaked_at', null)
    .lte('staked_at', new Date().toISOString())

  await Promise.all(
    (positions ?? []).map(async (pos) => {
      const points = calcDailyRewardPoints(pos.amount_melo, pos.bonus_multiplier)
      await supabase.from('staking_rewards').upsert({
        position_id: pos.id,
        wallet: pos.wallet,
        points,
        epoch_date: epochDate,
      })
    })
  )
}
