import { createClient } from '@supabase/supabase-js'
import { calcNetAmount, calcPlatformFee } from './types/creator-monetization'
import type { CreatorEarning, CreatorPayoutRequest, EarningsSourceType } from './types/creator-monetization'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function recordEarning(
  creatorWallet: string,
  sourceType: EarningsSourceType,
  grossAmountMelo: number,
  opts: { videoId?: string; referenceId?: string; platformFeePct?: number } = {}
): Promise<CreatorEarning> {
  const supabase = getSupabase()
  const feePct = opts.platformFeePct ?? 20
  const { data, error } = await supabase
    .from('creator_earnings')
    .insert({
      creator_wallet: creatorWallet,
      source_type: sourceType,
      gross_amount_melo: grossAmountMelo,
      platform_fee_melo: calcPlatformFee(grossAmountMelo, feePct),
      net_amount_melo: calcNetAmount(grossAmountMelo, feePct),
      video_id: opts.videoId ?? null,
      reference_id: opts.referenceId ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getCreatorEarnings(wallet: string): Promise<{ earnings: CreatorEarning[]; totalUnpaid: number }> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('creator_earnings')
    .select('*')
    .eq('creator_wallet', wallet)
    .order('created_at', { ascending: false })

  const earnings = data ?? []
  const totalUnpaid = earnings
    .filter((e: CreatorEarning) => !e.paid_out)
    .reduce((sum: number, e: CreatorEarning) => sum + e.net_amount_melo, 0)

  return { earnings, totalUnpaid: parseFloat(totalUnpaid.toFixed(8)) }
}

export async function requestPayout(wallet: string, amountMelo: number): Promise<CreatorPayoutRequest> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('creator_payout_requests')
    .insert({ creator_wallet: wallet, amount_melo: amountMelo })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getPayoutRequests(wallet: string): Promise<CreatorPayoutRequest[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('creator_payout_requests')
    .select('*')
    .eq('creator_wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}
