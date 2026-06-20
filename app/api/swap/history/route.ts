import { NextRequest, NextResponse } from 'next/server'
import { getSwapHistory } from '@/lib/swap'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '20'), 100)
  const history = await getSwapHistory(wallet, limit)
  return NextResponse.json({ history })
}
