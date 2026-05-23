import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { walletAddress, txHash } = body as Record<string, unknown>

  if (typeof walletAddress !== 'string' || typeof txHash !== 'string') {
    return NextResponse.json(
      { error: 'walletAddress and txHash are required strings' },
      { status: 400 },
    )
  }

  if (!isAddress(walletAddress)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const supabase = getServiceSupabase()
  const wallet = walletAddress.toLowerCase()

  // Sum up all unclaimed watches for this wallet
  const { data: unclaimedRows } = await supabase
    .from('watches')
    .select('id, reward_cents')
    .eq('wallet_address', wallet)
    .eq('claimed', false)

  const rows = unclaimedRows ?? []
  const totalCents = rows.reduce((sum, r) => sum + (r.reward_cents ?? 0), 0)

  if (rows.length > 0) {
    const ids = rows.map((r) => r.id as number)

    // Mark all unclaimed watches as claimed
    await supabase
      .from('watches')
      .update({ claimed: true })
      .in('id', ids)
  }

  // Insert claim record
  await supabase.from('claims').insert({
    wallet_address: wallet,
    total_cents: totalCents,
    tx_hash: txHash,
    status: 'confirmed',
    confirmed_at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true, totalCents, claimedCount: rows.length })
}
