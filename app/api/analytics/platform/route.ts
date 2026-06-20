import { NextRequest, NextResponse } from 'next/server'
import { getPlatformMetrics } from '@/lib/platform-analytics'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const days = Number(req.nextUrl.searchParams.get('days') ?? '30')
  const metrics = await getPlatformMetrics(days)
  return NextResponse.json({ metrics })
}
