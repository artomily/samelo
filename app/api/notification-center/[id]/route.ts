import { NextRequest, NextResponse } from 'next/server'
import { markNotificationRead, deleteNotificationItem } from '@/lib/notification-center'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  await markNotificationRead(id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  await deleteNotificationItem(id)
  return NextResponse.json({ ok: true })
}
