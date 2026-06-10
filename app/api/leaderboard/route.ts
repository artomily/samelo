import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export type Timeframe = 'weekly' | 'monthly' | 'all_time'
export type SortBy = 'points' | 'watches'

/**
 * GET /api/leaderboard?timeframe=all_time&limit=50&offset=0&walletAddress=0x...&sortBy=points
 *
 * Returns ranked leaderboard entries with optional current-user rank.
 * sortBy: "points" (default) ranks by total points, "watches" ranks by watch count.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const timeframe = (searchParams.get('timeframe') ?? 'all_time') as Timeframe
  const sortBy = (searchParams.get('sortBy') ?? 'points') as SortBy
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)
  const offset = parseInt(searchParams.get('offset') ?? '0')
  const walletAddress = searchParams.get('walletAddress') ?? undefined

  if (sortBy !== 'points' && sortBy !== 'watches') {
    return NextResponse.json({ error: 'Invalid sortBy. Use "points" or "watches".' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()

    // Aggregate points per wallet
    const query = supabase
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
        sortBy: 'points',
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
        sortBy: 'points',
      })
    }

    // all_time: use profiles table directly
    if (sortBy === 'watches') {
      // Rank by watch count
      const watchesQuery = timeframe === 'all_time'
        ? supabase.from('watches').select('wallet_address')
        : supabase.from('watches').select('wallet_address').gte('watched_at', timeframe === 'weekly' ? new Date(Date.now() - 7 * 86400000).toISOString() : new Date(Date.now() - 30 * 86400000).toISOString())

      const { data: watchData, error: watchErr } = await watchesQuery
      if (watchErr) throw watchErr

      const countMap = new Map<string, number>()
      for (const r of (watchData ?? [])) {
        countMap.set(r.wallet_address, (countMap.get(r.wallet_address) ?? 0) + 1)
      }

      const entries = Array.from(countMap.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(offset, offset + limit)
        .map(([wallet, watchCount]) => ({ wallet, points: watchCount, rank: 0 }))

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
        const allSorted = Array.from(countMap.entries()).sort(([, a], [, b]) => b - a)
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
        total: countMap.size,
        userRank,
        sortBy: 'watches',
      })
    }

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
      sortBy: 'points',
    })
  } catch (err) {
    console.error('[/api/leaderboard]', err)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
