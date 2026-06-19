import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdminWallet } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function POST(request: NextRequest, { params }: { params: { wallet: string } }) {
  const adminWallet = request.headers.get('x-wallet-address')
  if (!adminWallet || !isAdminWallet(adminWallet)) return apiError('UNAUTHORIZED', 'Admin only', 403)

  const body = await request.json()
  const { banned } = body as { banned?: boolean }

  if (typeof banned !== 'boolean') {
    return apiError('MISSING_PARAMS', 'banned (boolean) required', 400)
  }

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: banned })
    .eq('wallet_address', params.wallet.toLowerCase())

  if (error) return apiError('DB_ERROR', error.message, 500)

  return apiOk({ wallet: params.wallet, banned })
}
