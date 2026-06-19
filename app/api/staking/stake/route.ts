import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isValidAddress } from '@/lib/address'
import { stakingTierForDays } from '@/lib/types/staking'
import { apiError, apiOk } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { wallet, amountMelo, lockDays, txHash } = body as Record<string, unknown>

  if (typeof wallet !== 'string' || !isValidAddress(wallet)) {
    return apiError('MISSING_PARAMS', 'Valid wallet required', 400)
  }
  if (typeof amountMelo !== 'string' || parseFloat(amountMelo) <= 0) {
    return apiError('MISSING_PARAMS', 'amountMelo must be positive string', 400)
  }
  if (typeof lockDays !== 'number') {
    return apiError('MISSING_PARAMS', 'lockDays required', 400)
  }

  const tier = stakingTierForDays(lockDays)
  if (!tier) return apiError('MISSING_PARAMS', 'lockDays must be 7, 30, 90, or 180', 400)

  const stakedAt = new Date()
  const unlockAt = new Date(stakedAt.getTime() + lockDays * 86_400_000)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('stake_positions')
    .insert({
      wallet_address: wallet.toLowerCase(),
      amount_melo: amountMelo,
      lock_days: lockDays,
      bonus_multiplier: tier.bonusMultiplier,
      staked_at: stakedAt.toISOString(),
      unlock_at: unlockAt.toISOString(),
      tx_hash: txHash ?? null,
    })
    .select()
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ position: data }, 201)
}
