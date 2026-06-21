import { NextRequest, NextResponse } from 'next/server'
import { createPoll, getVideoPolls } from '@/lib/video-polls'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const polls = await getVideoPolls(id)
  return NextResponse.json({ polls })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { question, options, is_multiple_choice, ends_at } = await req.json()
  if (!question || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: 'question and at least 2 options required' }, { status: 400 })
  }

  const poll = await createPoll(id, wallet, question, options, { isMultipleChoice: is_multiple_choice, endsAt: ends_at })
  return NextResponse.json({ poll }, { status: 201 })
}
