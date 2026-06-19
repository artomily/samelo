import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

// GET /api/onchain/flow?days=7
// Returns time-series data of money flow from Web2 to Web3
export async function GET(request: NextRequest) {
  const days = parseInt(request.nextUrl.searchParams.get('days') ?? '7', 10)
  const validDays = [7, 14, 30].includes(days) ? days : 7

  const supabase = getServiceSupabase()
  const since = new Date(Date.now() - validDays * 24 * 60 * 60 * 1000).toISOString()

  try {
    const [watchesResult, swapsResult] = await Promise.all([
      supabase
        .from('watches')
        .select('watched_at, reward_cents')
        .gte('watched_at', since)
        .order('watched_at', { ascending: true }),
      supabase
        .from('point_swaps')
        .select('created_at, points_burned, melo_received')
        .gte('created_at', since)
        .order('created_at', { ascending: true }),
    ])

    // Bucket by day
    const watchesByDay = new Map<string, { count: number; points: number }>()
    const swapsByDay = new Map<string, { count: number; melo: number }>()

    for (const w of watchesResult.data ?? []) {
      const day = w.watched_at.slice(0, 10)
      const existing = watchesByDay.get(day) ?? { count: 0, points: 0 }
      watchesByDay.set(day, {
        count: existing.count + 1,
        points: existing.points + (w.reward_cents ?? 0),
      })
    }

    for (const s of swapsResult.data ?? []) {
      const day = s.created_at.slice(0, 10)
      const existing = swapsByDay.get(day) ?? { count: 0, melo: 0 }
      swapsByDay.set(day, {
        count: existing.count + 1,
        melo: existing.melo + parseFloat(s.melo_received ?? '0'),
      })
    }

    // Build unified timeline
    const allDays = new Set([...watchesByDay.keys(), ...swapsByDay.keys()])
    const timeline = Array.from(allDays)
      .sort()
      .map((day) => ({
        date: day,
        watches: watchesByDay.get(day)?.count ?? 0,
        pointsIssued: watchesByDay.get(day)?.points ?? 0,
        swaps: swapsByDay.get(day)?.count ?? 0,
        meloMinted: (swapsByDay.get(day)?.melo ?? 0).toFixed(3),
      }))

    return NextResponse.json({ timeline, days: validDays })
  } catch (err) {
    console.error('[/api/onchain/flow]', err)
    return NextResponse.json({ error: 'Failed to fetch flow data' }, { status: 500 })
  }
}
