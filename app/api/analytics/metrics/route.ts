import { NextResponse } from 'next/server'
import { getDailyMetrics, getTopVideos } from '@/lib/analytics/aggregate'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(request: Request) {
  const adminWallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(adminWallet)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')
  const date = dateStr ? new Date(dateStr) : new Date()

  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  try {
    const [metrics, topVideos] = await Promise.all([
      getDailyMetrics(date),
      getTopVideos(10),
    ])
    return NextResponse.json({ metrics, topVideos })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
