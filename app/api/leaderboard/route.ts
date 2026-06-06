import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export type Timeframe = 'weekly' | 'monthly' | 'all_time'

/**
 * GET /api/leaderboard?timeframe=all_time&limit=50&offset=0&walletAddress=0x...
 *
 * Returns ranked leaderboard entries with optional current-user rank.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const timeframe = (searchParams.get('timeframe') ?? 'all_time') as Timeframe
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)
  const offset = parseInt(searchParams.get('offset') ?? '0')
  const walletAddress = searchParams.get('walletAddress') ?? undefined

  try {
    const supabase = getServiceSupabase()

    // Aggregate points per wallet
    let query = supabase
      .from('profiles')
      .select('wallet_address, total_points, total_earned_cents, display_name')
      .order('total_points', { ascending: false })

    if (timeframe === 'weekly') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      // For weekly, aggregate from watches table
      const { data: weeklyData, error: weeklyErr } = await supabase
        .from('watches')
        .select('wallet_address, points')
        .gte('watched_at', weekAgo.toISOString())

      if (weeklyErr) throw weeklyErr

      // Add quiz points earned this week
      const { data: quizData, error: quizErr } = await supabase
        .from('user_quiz_attempts')
        .select('wallet_address, points_earned')
        .gte('answered_at', weekAgo.toISOString())

      if (quizErr) throw quizErr

      const pointsMap = new Map<string, number>()
      for (const r of weeklyData ?? []) {
        pointsMap.set(r.wallet_address, (pointsMap.get(r.wallet_address) ?? 0) + (r.points ?? 0))
      }
      for (const r of quizData ?? []) {
        pointsMap.set(r.wallet_address, (pointsMap.get(r.wallet_address) ?? 0) + (r.points_earned ?? 0))
      }

      const entries = Array.from(pointsMap.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(offset, offset + limit)
        .map(([wallet, points]) => ({
          wallet,
          points,
          rank: 0,
        }))

      // Get display names
      const wallets = entries.map(e => e.wallet)
      const { data: displayData } = await supabase
        .from('profiles')
        .select('wallet_address, display_name')
        .in('wallet_address', wallets)

      const displayMap = new Map(
        (displayData ?? []).map(p => [p.wallet_address, p.display_name]),
      )

      let userRank: { rank: number; points: number } | undefined
      if (walletAddress) {
        const allSorted = Array.from(pointsMap.entries()).sort(([, a], [, b]) => b - a)
        const idx = allSorted.findIndex(([w]) => w === walletAddress.toLowerCase())
        if (idx >= 0) {
          userRank = { rank: idx + 1, points: allSorted[idx]![1] }
        }
      }

      return NextResponse.json({
        entries: entries.map((e, i) => ({
          ...e,
          rank: offset + i + 1,
          displayName: displayMap.get(e.wallet) ?? null,
        })),
        total: pointsMap.size,
        userRank,
      })
    }

    if (timeframe === 'monthly') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)

      const { data: monthlyData, error: monthlyErr } = await supabase
        .from('watches')
        .select('wallet_address, points')
        .gte('watched_at', monthAgo.toISOString())

      if (monthlyErr) throw monthlyErr

      const { data: quizMonthly, error: quizMonthlyErr } = await supabase
        .from('user_quiz_attempts')
        .select('wallet_address, points_earned')
        .gte('answered_at', monthAgo.toISOString())

      if (quizMonthlyErr) throw quizMonthlyErr

      const pointsMap = new Map<string, number>()
      for (const r of monthlyData ?? []) {
        pointsMap.set(r.wallet_address, (pointsMap.get(r.wallet_address) ?? 0) + (r.points ?? 0))
      }
      for (const r of quizMonthly ?? []) {
        pointsMap.set(r.wallet_address, (pointsMap.get(r.wallet_address) ?? 0) + (r.points_earned ?? 0))
      }

      const entries = Array.from(pointsMap.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(offset, offset + limit)
        .map(([wallet, points]) => ({
          wallet,
          points,
          rank: 0,
        }))

      const wallets = entries.map(e => e.wallet)
      const { data: displayData } = await supabase
        .from('profiles')
        .select('wallet_address, display_name')
        .in('wallet_address', wallets)

      const displayMap = new Map(
        (displayData ?? []).map(p => [p.wallet_address, p.display_name]),
      )

      let userRank: { rank: number; points: number } | undefined
      if (walletAddress) {
        const allSorted = Array.from(pointsMap.entries()).sort(([, a], [, b]) => b - a)
        const idx = allSorted.findIndex(([w]) => w === walletAddress.toLowerCase())
        if (idx >= 0) {
          userRank = { rank: idx + 1, points: allSorted[idx]![1] }
        }
      }

      return NextResponse.json({
        entries: entries.map((e, i) => ({
          ...e,
          rank: offset + i + 1,
          displayName: displayMap.get(e.wallet) ?? null,
        })),
        total: pointsMap.size,
        userRank,
      })
    }

    // all_time: use profiles table directly
    const { data: allData, error: allErr } = await query
      .range(offset, offset + limit - 1)

    if (allErr) throw allErr

    // Get total count
    const { count: total } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('total_points', 0)

    let userRank: { rank: number; points: number } | undefined
    if (walletAddress) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle()

      if (userProfile) {
        const { count: rankCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('total_points', userProfile.total_points)

        userRank = {
          rank: (rankCount ?? 0) + 1,
          points: userProfile.total_points,
        }
      }
    }

    return NextResponse.json({
      entries: (allData ?? []).map((p, i) => ({
        wallet: p.wallet_address,
        points: p.total_points,
        rank: offset + i + 1,
        displayName: p.display_name,
      })),
      total: total ?? 0,
      userRank,
    })
  } catch (err) {
    console.error('[/api/leaderboard]', err)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
