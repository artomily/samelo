import { NextRequest, NextResponse } from 'next/server'
import { unstakePosition } from '@/lib/staking-v2'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { positionId } = await req.json()
  if (!positionId) return NextResponse.json({ error: 'positionId required' }, { status: 400 })

  try {
    await unstakePosition(positionId, wallet)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unstake failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
