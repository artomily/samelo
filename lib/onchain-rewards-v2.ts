import { createClient } from '@supabase/supabase-js'
import type { OnchainRewardQueue, OnchainRewardType, OnchainRewardStatus } from './types/onchain-rewards-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function queueReward(
  wallet: string,
  rewardType: OnchainRewardType,
  amountMelo: number,
  referenceId?: string
): Promise<OnchainRewardQueue> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('onchain_reward_queues')
    .insert({ wallet, reward_type: rewardType, amount_melo: amountMelo, reference_id: referenceId ?? null })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getWalletRewardQueue(wallet: string): Promise<OnchainRewardQueue[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('onchain_reward_queues')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(50)
  return data ?? []
}

export async function getPendingRewards(): Promise<OnchainRewardQueue[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('onchain_reward_queues')
    .select('*')
    .in('status', ['queued', 'signed'])
    .order('created_at', { ascending: true })
    .limit(100)
  return data ?? []
}

export async function updateRewardStatus(
  rewardId: string,
  status: OnchainRewardStatus,
  opts: { txHash?: string; oracleSignature?: string; errorMessage?: string } = {}
): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('onchain_reward_queues')
    .update({
      status,
      tx_hash: opts.txHash ?? null,
      oracle_signature: opts.oracleSignature ?? null,
      error_message: opts.errorMessage ?? null,
      processed_at: ['confirmed', 'failed'].includes(status) ? new Date().toISOString() : null,
    })
    .eq('id', rewardId)
}
