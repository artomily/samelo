import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { validateWallet } from '@/lib/middleware/validate-wallet'

interface SwapRecord {
  id: string
  pointsBurned: number
  meloReceived: string
  txHash: string | null
  createdAt: string
}

export async function GET(request: NextRequest) {
  const walletParam = request.nextUrl.searchParams.get('walletAddress')

  if (!walletParam) {
    return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 })
  }

  const validation = validateWallet(walletParam)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const wallet = validation.address!
  const supabase = getServiceSupabase()

  try {
    const { data, error } = await supabase
      .from('point_swaps')
      .select('id, points_burned, melo_received, tx_hash, created_at')
      .eq('wallet_address', wallet)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    const swaps: SwapRecord[] = (data ?? []).map((r) => ({
      id: r.id,
      pointsBurned: r.points_burned,
      meloReceived: r.melo_received,
      txHash: r.tx_hash,
      createdAt: r.created_at,
    }))

    return NextResponse.json({ swaps, total: swaps.length })
  } catch (err) {
    console.error('[/api/rewards/swap-history]', err)
    return NextResponse.json({ error: 'Failed to fetch swap history' }, { status: 500 })
  }
}
