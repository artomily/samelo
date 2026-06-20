import { NextRequest, NextResponse } from 'next/server'
import { getAllAchievementsV2 } from '@/lib/achievements-v2'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? undefined
  const achievements = await getAllAchievementsV2(wallet)
  const unlockedCount = achievements.filter((a) => a.progress?.unlocked).length
  return NextResponse.json({ achievements, unlockedCount })
}
