import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const walletAddress = searchParams.get('walletAddress')
  const cursor = searchParams.get('cursor') // ISO timestamp cursor for keyset pagination

  if (!walletAddress || !/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 })
  }

  const supabase = getServiceSupabase()

  // Keyset pagination on watched_at
  let query = supabase
    .from('watches')
    .select('id, video_id, reward_cents, watched_at, claimed')
    .eq('wallet_address', walletAddress.toLowerCase())
    .order('watched_at', { ascending: false })
    .limit(PAGE_SIZE + 1)

  if (cursor) {
    query = query.lt('watched_at', cursor)
  }

  const { data: rows, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const hasMore = (rows ?? []).length > PAGE_SIZE
  const items = hasMore ? (rows ?? []).slice(0, PAGE_SIZE) : (rows ?? [])
  const nextCursor = hasMore ? items[items.length - 1].watched_at : null

  // Aggregate totals
  const { data: allRows } = await supabase
    .from('watches')
    .select('reward_cents, claimed')
    .eq('wallet_address', walletAddress.toLowerCase())

  let totalEarnedCents = 0
  let totalClaimedCents = 0
  for (const r of allRows ?? []) {
    totalEarnedCents += r.reward_cents ?? 0
    if (r.claimed) totalClaimedCents += r.reward_cents ?? 0
  }

  return NextResponse.json({ items, nextCursor, totalEarnedCents, totalClaimedCents })
}
