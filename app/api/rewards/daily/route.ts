import { NextResponse } from 'next/server'
import { getDailyReward } from '@/lib/rewards'
import { validateWalletAddress } from '@/lib/security/sanitize'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')
  const day = searchParams.get('day') ?? undefined

  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  if (day && !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return NextResponse.json({ error: 'Invalid date format, use YYYY-MM-DD' }, { status: 400 })
  }

  try {
    const reward = await getDailyReward(wallet, day)
    return NextResponse.json({ reward })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch daily reward' }, { status: 500 })
  }
}
