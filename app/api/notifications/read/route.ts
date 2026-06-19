import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isValidAddress } from '@/lib/address'
import { markAllRead } from '@/lib/notifications'
import { apiError, apiOk } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { wallet, notificationId } = body as Record<string, unknown>

  if (typeof wallet !== 'string' || !isValidAddress(wallet)) {
    return apiError('MISSING_PARAMS', 'Valid wallet required', 400)
  }

  const supabase = getServiceSupabase()

  if (notificationId) {
    // Mark single notification as read
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('wallet_address', wallet.toLowerCase())
    if (error) return apiError('DB_ERROR', error.message, 500)
    return apiOk({ markedRead: 1 })
  }

  // Mark all as read
  await markAllRead(supabase, wallet)
  return apiOk({ markedReadAll: true })
}
