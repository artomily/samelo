import { NextRequest, NextResponse } from 'next/server'
import { getXpHistory, getProfileXp } from '@/lib/xp-db'
import { getLevelForXp, getLevelProgressPct, getXpToNextLevel } from '@/lib/types/xp'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const [{ xp, level: levelNum }, history] = await Promise.all([
    getProfileXp(wallet),
    getXpHistory(wallet, 10),
  ])

  const levelConfig = getLevelForXp(xp)
  const progressPct = getLevelProgressPct(xp)
  const xpToNext = getXpToNextLevel(xp)

  return NextResponse.json({
    xp,
    level: levelNum,
    levelTitle: levelConfig.title,
    levelColor: levelConfig.color,
    progressPct,
    xpToNext,
    history,
  })
}
