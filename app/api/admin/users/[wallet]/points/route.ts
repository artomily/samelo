import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdminWallet } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function POST(request: NextRequest, { params }: { params: { wallet: string } }) {
  const adminWallet = request.headers.get('x-wallet-address')
  if (!adminWallet || !isAdminWallet(adminWallet)) return apiError('UNAUTHORIZED', 'Admin only', 403)

  const body = await request.json()
  const { delta, reason } = body as { delta?: number; reason?: string }

  if (typeof delta !== 'number' || delta === 0) {
    return apiError('MISSING_PARAMS', 'delta (non-zero number) required', 400)
  }

  const supabase = getServiceSupabase()

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('total_points')
    .eq('wallet_address', params.wallet.toLowerCase())
    .single()

  if (fetchError || !profile) return apiError('NOT_FOUND', 'User not found', 404)

  const newTotal = Math.max(0, (profile.total_points ?? 0) + delta)

  const { error } = await supabase
    .from('profiles')
    .update({ total_points: newTotal })
    .eq('wallet_address', params.wallet.toLowerCase())

  if (error) return apiError('DB_ERROR', error.message, 500)

  return apiOk({ wallet: params.wallet, delta, newTotal, reason: reason ?? '' })
}
