import { NextRequest, NextResponse } from 'next/server'
import { createReport } from '@/lib/moderation-db'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const { target_type, target_id, reason, details } = await req.json()
  if (!target_type || !target_id || !reason) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const report = await createReport(wallet, target_type, target_id, reason, details)
  return NextResponse.json({ report }, { status: 201 })
}
