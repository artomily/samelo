import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isValidAddress } from '@/lib/address'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')
  if (!wallet || !isValidAddress(wallet)) return apiError('MISSING_PARAMS', 'Valid wallet required', 400)

  const supabase = getServiceSupabase()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('stake_positions')
    .select('bonus_multiplier')
    .eq('wallet_address', wallet.toLowerCase())
    .eq('is_active', true)
    .gt('unlock_at', now)

  if (error) return apiError('DB_ERROR', error.message, 500)

  // Effective multiplier: highest active stake wins (non-stacking)
  const multiplier = (data ?? []).reduce((max, r) => Math.max(max, parseFloat(r.bonus_multiplier)), 1.0)
  return apiOk({ multiplier, activeStakes: data?.length ?? 0 })
}
