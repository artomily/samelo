import { NextRequest, NextResponse } from 'next/server'
import { getPointsHistory, getPointsTotals } from '@/lib/points-history'
import type { PointsSource } from '@/lib/types/points-history'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const source = req.nextUrl.searchParams.get('source') as PointsSource | null
  const limit = Number(req.nextUrl.searchParams.get('limit') ?? '50')
  const [history, totals] = await Promise.all([
    getPointsHistory(wallet, limit, source ?? undefined),
    getPointsTotals(wallet),
  ])
  return NextResponse.json({ history, totals })
}
