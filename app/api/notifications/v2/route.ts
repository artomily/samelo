import { NextRequest, NextResponse } from 'next/server'
import { getNotifications, getUnreadCount, markAllRead } from '@/lib/notifications-v2'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const [notifications, unreadCount] = await Promise.all([
    getNotifications(wallet),
    getUnreadCount(wallet),
  ])
  return NextResponse.json({ notifications, unreadCount })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const { action } = await req.json()
  if (action !== 'mark_all_read') {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
  await markAllRead(wallet)
  return NextResponse.json({ ok: true })
}
