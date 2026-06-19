import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isValidAddress } from '@/lib/address'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')
  if (!wallet || !isValidAddress(wallet)) return apiError('MISSING_PARAMS', 'Valid wallet required', 400)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('stake_positions')
    .select('id, amount_melo, lock_days, bonus_multiplier, staked_at, unlock_at, is_active, claimed_at, tx_hash')
    .eq('wallet_address', wallet.toLowerCase())
    .order('staked_at', { ascending: false })

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ positions: data ?? [] })
}
