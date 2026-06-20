import { NextResponse } from 'next/server'
import { markAsRead } from '@/lib/notifications'
import { validateWalletAddress, validateUuid } from '@/lib/security/sanitize'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!validateUuid(params.id)) {
    return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 })
  }

  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 401 })
  }

  try {
    await markAsRead(params.id, wallet)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
  }
}
