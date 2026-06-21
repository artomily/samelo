import { NextRequest, NextResponse } from 'next/server'
import { getGiveaway, enterGiveaway, drawWinner, getWalletEntry } from '@/lib/giveaways'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address') ?? undefined

  const [giveaway, entry] = await Promise.all([
    getGiveaway(id),
    wallet ? getWalletEntry(id, wallet) : Promise.resolve(null),
  ])

  if (!giveaway) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ giveaway, entry })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { action } = await req.json()

  if (action === 'draw') {
    if (!isAdmin(wallet)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    const winner = await drawWinner(id)
    return NextResponse.json({ winner })
  }

  const entry = await enterGiveaway(id, wallet)
  return NextResponse.json({ entry }, { status: 201 })
}
