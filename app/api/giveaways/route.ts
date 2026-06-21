import { NextRequest, NextResponse } from 'next/server'
import { getActiveGiveaways, createGiveaway } from '@/lib/giveaways'

export async function GET() {
  const giveaways = await getActiveGiveaways()
  return NextResponse.json({ giveaways })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { title, ends_at, description, prize_melo, prize_description, max_entries } = await req.json()
  if (!title || !ends_at) {
    return NextResponse.json({ error: 'title and ends_at required' }, { status: 400 })
  }

  const giveaway = await createGiveaway(wallet, title, ends_at, {
    description,
    prizeMelo: prize_melo,
    prizeDescription: prize_description,
    maxEntries: max_entries,
  })
  return NextResponse.json({ giveaway }, { status: 201 })
}
