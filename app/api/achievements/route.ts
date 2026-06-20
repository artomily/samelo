import { NextRequest, NextResponse } from 'next/server'
import { getUserAchievements, getAllDefinitions, getUnlockedCount } from '@/lib/achievements-db'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''

  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    const definitions = await getAllDefinitions()
    return NextResponse.json({ definitions })
  }

  const [achievements, unlockedCount] = await Promise.all([
    getUserAchievements(wallet),
    getUnlockedCount(wallet),
  ])

  return NextResponse.json({ achievements, unlockedCount })
}
