import { NextRequest, NextResponse } from 'next/server'
import { doCheckin, getCheckinHistory } from '@/lib/checkin'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const history = await getCheckinHistory(wallet, 7)
  return NextResponse.json({ history })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const result = await doCheckin(wallet)
  return NextResponse.json(result, { status: result.alreadyCheckedIn ? 200 : 201 })
}
