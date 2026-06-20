import { NextResponse } from 'next/server'
import { getWeeklyStats } from '@/lib/rewards'
import { validateWalletAddress } from '@/lib/security/sanitize'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  try {
    const weekly = await getWeeklyStats(wallet)
    return NextResponse.json({ weekly })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weekly stats' }, { status: 500 })
  }
}
