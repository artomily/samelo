import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdminWallet } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !isAdminWallet(wallet)) return apiError('UNAUTHORIZED', 'Admin only', 403)

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const supabase = getServiceSupabase()

  let query = supabase
    .from('profiles')
    .select('wallet_address, display_name, referral_code, total_points, created_at')
    .order('total_points', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`wallet_address.ilike.%${search}%,display_name.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) return apiError('DB_ERROR', error.message, 500)

  return apiOk({ users: data ?? [], limit, offset })
}
