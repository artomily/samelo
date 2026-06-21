import { NextRequest, NextResponse } from 'next/server'
import { getMessage, replyToMessage, markMessageRead, archiveMessage } from '@/lib/fan-messages'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const message = await getMessage(id)
  if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (message.to_wallet === wallet && !message.is_read) {
    await markMessageRead(id)
  }

  return NextResponse.json({ message })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { action, body } = await req.json()

  if (action === 'archive') {
    await archiveMessage(id, wallet)
    return NextResponse.json({ ok: true })
  }

  if (!body) return NextResponse.json({ error: 'body required' }, { status: 400 })

  const reply = await replyToMessage(id, wallet, body)
  return NextResponse.json({ reply }, { status: 201 })
}
