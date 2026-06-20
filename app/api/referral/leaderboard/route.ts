import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(_req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('referrals')
    .select('referrer_wallet')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const counts: Record<string, number> = {}
  for (const r of data ?? []) {
    counts[r.referrer_wallet] = (counts[r.referrer_wallet] ?? 0) + 1
  }

  const leaderboard = Object.entries(counts)
    .map(([wallet, count]) => ({ wallet, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  return NextResponse.json({ leaderboard })
}
