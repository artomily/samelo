import { NextRequest, NextResponse } from 'next/server'
import { getWalletEvents } from '@/lib/onchain-events'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const eventName = req.nextUrl.searchParams.get('event') ?? undefined
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '20'), 50)

  const events = await getWalletEvents(wallet, eventName, limit)
  return NextResponse.json({ events })
}
