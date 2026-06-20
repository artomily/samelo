import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdminWallet } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !isAdminWallet(wallet)) return apiError('UNAUTHORIZED', 'Admin only', 403)

  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('point_swaps')
    .select('id, wallet_address, points_burned, melo_received, tx_hash, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ swaps: data ?? [], limit })
}
