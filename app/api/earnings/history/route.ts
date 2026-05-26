import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const walletAddress = searchParams.get('walletAddress')
  const cursor = searchParams.get('cursor')

  if (!walletAddress || !/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 })
  }

  const supabase = getServiceSupabase()
  const wallet = walletAddress.toLowerCase()

  // Fetch watch rows with keyset pagination
  let query = supabase
    .from('watches')
    .select('id, video_id, points, watched_at, claimed')
    .eq('wallet_address', wallet)
    .order('watched_at', { ascending: false })
    .limit(PAGE_SIZE + 1)

  if (cursor) {
    query = query.lt('watched_at', cursor)
  }

  const { data: watchRows, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const hasMore = (watchRows ?? []).length > PAGE_SIZE
  const items = hasMore ? (watchRows ?? []).slice(0, PAGE_SIZE) : (watchRows ?? [])
  const nextCursor = hasMore ? items[items.length - 1].watched_at : null

  // Aggregate totals from watches
  const { data: allWatches } = await supabase
    .from('watches')
    .select('points, claimed')
    .eq('wallet_address', wallet)

  let totalEarned = 0
  let totalClaimed = 0
  for (const r of allWatches ?? []) {
    totalEarned += r.points ?? 0
    if (r.claimed) totalClaimed += r.points ?? 0
  }

  // Include quiz points in total earned
  const { data: quizRows } = await supabase
    .from('user_quiz_attempts')
    .select('points_earned')
    .eq('wallet_address', wallet)

  for (const r of quizRows ?? []) {
    totalEarned += r.points_earned ?? 0
  }

  return NextResponse.json({
    items: items.map((r) => ({
      id: r.id,
      video_id: r.video_id,
      points: r.points ?? 0,
      watched_at: r.watched_at,
      claimed: r.claimed ?? false,
    })),
    nextCursor,
    totalEarned,
    totalClaimed,
  })
}
