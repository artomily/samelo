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
    .from('notifications')
    .select('id, type, title, message, read, metadata, created_at')
    .eq('wallet_address', wallet.toLowerCase())
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ notifications: data ?? [] })
}
