import { NextRequest, NextResponse } from 'next/server'
import { createSession, getActiveSessions, revokeAllSessions } from '@/lib/sessions'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const sessions = await getActiveSessions(wallet)
  return NextResponse.json({ sessions })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const ip = req.headers.get('x-forwarded-for') ?? undefined
  const ua = req.headers.get('user-agent') ?? undefined
  const session = await createSession(wallet, ip, ua)
  return NextResponse.json({ session }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  await revokeAllSessions(wallet)
  return NextResponse.json({ ok: true })
}
