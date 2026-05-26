import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('walletAddress')

  if (!wallet || !isAddress(wallet)) {
    return NextResponse.json(
      { error: 'Valid walletAddress is required' },
      { status: 400 },
    )
  }

  const supabase = getServiceSupabase()

  const { data: rows } = await supabase
    .from('watches')
    .select('video_id, points')
    .eq('wallet_address', wallet.toLowerCase())
    .eq('claimed', false)

  const total = (rows ?? []).reduce((sum, r) => sum + (r.points ?? 0), 0)

  const byVideo = new Map<string, number>()
  for (const r of rows ?? []) {
    byVideo.set(r.video_id, (byVideo.get(r.video_id) ?? 0) + (r.points ?? 0))
  }
  const perVideo = Array.from(byVideo.entries()).map(([video_id, points]) => ({
    video_id,
    points,
  }))

  return NextResponse.json({ total, perVideo })
}
