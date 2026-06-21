import { NextRequest, NextResponse } from 'next/server'
import { getInbox, getSentMessages, sendMessage } from '@/lib/fan-messages'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const mode = req.nextUrl.searchParams.get('mode') ?? 'inbox'
  const archived = req.nextUrl.searchParams.get('archived') === '1'

  if (mode === 'sent') {
    const messages = await getSentMessages(wallet)
    return NextResponse.json({ messages })
  }

  const messages = await getInbox(wallet, archived)
  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { to_wallet, body, subject, tip_melo } = await req.json()
  if (!to_wallet || !body) {
    return NextResponse.json({ error: 'to_wallet and body required' }, { status: 400 })
  }

  const message = await sendMessage(wallet, to_wallet, body, { subject, tipMelo: tip_melo })
  return NextResponse.json({ message }, { status: 201 })
}
