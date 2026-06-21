import { NextRequest, NextResponse } from 'next/server'
import { getPoll, castVote } from '@/lib/video-polls'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address') ?? undefined
  const poll = await getPoll(id, wallet)
  if (!poll) return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  return NextResponse.json({ poll })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { option_id } = await req.json()
  if (!option_id) return NextResponse.json({ error: 'option_id required' }, { status: 400 })

  try {
    await castVote(id, option_id, wallet)
  } catch {
    return NextResponse.json({ error: 'Already voted or invalid option' }, { status: 409 })
  }

  const poll = await getPoll(id, wallet)
  return NextResponse.json({ poll })
}
