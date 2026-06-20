import { NextRequest, NextResponse } from 'next/server'
import { claimVested } from '@/lib/vesting'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { scheduleId } = await req.json()
  if (!scheduleId) return NextResponse.json({ error: 'scheduleId required' }, { status: 400 })

  try {
    const claim = await claimVested(scheduleId, wallet)
    return NextResponse.json({ claim })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Claim failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
