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

  const { walletAddress, txHash, amount } = body as Record<string, unknown>

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

  // Sum up all unclaimed watches for this wallet, ordered oldest first
  const { data: unclaimedRows } = await supabase
    .from('watches')
    .select('id, reward_cents')
    .eq('wallet_address', wallet)
    .eq('claimed', false)
    .order('watched_at', { ascending: true })

  const rows = unclaimedRows ?? []

  // If amount specified, only claim up to that amount (partial claim for swaps)
  const limitAmount = typeof amount === 'number' ? amount : undefined
  const idsToClaim: number[] = []
  let claimedTotal = 0

  for (const row of rows) {
    if (limitAmount !== undefined && claimedTotal >= limitAmount) break
    idsToClaim.push(row.id as number)
    claimedTotal += row.reward_cents ?? 0
  }

  const totalCents = rows.reduce((sum, r) => sum + (r.reward_cents ?? 0), 0)

  if (idsToClaim.length > 0) {
    await supabase
      .from('watches')
      .update({ claimed: true })
      .in('id', idsToClaim)
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
