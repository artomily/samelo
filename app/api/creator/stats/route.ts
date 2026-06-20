import { NextRequest, NextResponse } from 'next/server'
import { getCreatorStats } from '@/lib/creator-stats'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const days = Number(req.nextUrl.searchParams.get('days') ?? '30')
  const stats = await getCreatorStats(wallet, days)
  return NextResponse.json({ stats })
}
