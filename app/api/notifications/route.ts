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
import { NextResponse } from 'next/server'
import { getNotifications, markAllAsRead, getUnreadCount } from '@/lib/notifications'
import { validateWalletAddress } from '@/lib/security/sanitize'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')
  const unreadOnly = searchParams.get('unread') === 'true'
  const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 50)

  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  try {
    const [notifications, unreadCount] = await Promise.all([
      getNotifications(wallet, limit, unreadOnly),
      getUnreadCount(wallet),
    ])
    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  try {
    await markAllAsRead(wallet)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
  }
}
