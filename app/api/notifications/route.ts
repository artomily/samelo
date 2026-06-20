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
