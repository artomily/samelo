import { createClient } from '@supabase/supabase-js'
import type { RewardClaimRequest, ClaimSource, ClaimStatus } from './types/reward-claim'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createClaimRequest(
  wallet: string,
  source: ClaimSource,
  amountMelo: number,
  referenceId?: string
): Promise<RewardClaimRequest> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reward_claim_requests')
    .insert({ wallet, source, amount_melo: amountMelo, reference_id: referenceId ?? null })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getWalletClaims(wallet: string): Promise<RewardClaimRequest[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('reward_claim_requests')
    .select('*')
    .eq('wallet', wallet)
    .order('requested_at', { ascending: false })
  return data ?? []
}

export async function getPendingClaims(): Promise<RewardClaimRequest[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('reward_claim_requests')
    .select('*')
    .in('status', ['pending', 'processing'])
    .order('requested_at', { ascending: true })
  return data ?? []
}

export async function updateClaimStatus(
  claimId: string,
  status: ClaimStatus,
  opts: { txHash?: string; adminNote?: string } = {}
): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('reward_claim_requests')
    .update({
      status,
      tx_hash: opts.txHash ?? null,
      admin_note: opts.adminNote ?? null,
      processed_at: new Date().toISOString(),
    })
    .eq('id', claimId)
}

export async function getTotalClaimable(wallet: string): Promise<number> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('reward_claim_requests')
    .select('amount_melo')
    .eq('wallet', wallet)
    .eq('status', 'pending')
  if (!data) return 0
  return data.reduce((sum: number, c: { amount_melo: number }) => sum + c.amount_melo, 0)
}
