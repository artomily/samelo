import { NextRequest, NextResponse } from 'next/server'
import {
  getNotificationCenter,
  getNotificationUnreadCount,
  markAllNotificationsRead,
  pushNotification,
} from '@/lib/notification-center'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const countOnly = req.nextUrl.searchParams.get('count') === '1'
  if (countOnly) {
    const count = await getNotificationUnreadCount(wallet)
    return NextResponse.json({ unread: count })
  }

  const notifications = await getNotificationCenter(wallet)
  return NextResponse.json({ notifications })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { recipient_wallet, type, title, body, action_url, image_url } = await req.json()
  if (!recipient_wallet || !type || !title || !body) {
    return NextResponse.json({ error: 'recipient_wallet, type, title, body required' }, { status: 400 })
  }

  const notification = await pushNotification(recipient_wallet, type, title, body, {
    actionUrl: action_url,
    imageUrl: image_url,
  })
  return NextResponse.json({ notification }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { action } = await req.json()
  if (action === 'mark_all_read') {
    await markAllNotificationsRead(wallet)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
