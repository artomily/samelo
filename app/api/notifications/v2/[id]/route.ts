import { NextRequest, NextResponse } from 'next/server'
import { markRead } from '@/lib/notifications-v2'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const { id } = await params
  await markRead(id)
  return NextResponse.json({ ok: true })
}
