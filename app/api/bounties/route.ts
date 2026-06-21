import { NextRequest, NextResponse } from 'next/server'
import { getOpenBounties, createBounty } from '@/lib/bounty-board'
import type { BountyCategory } from '@/lib/types/bounty-board'

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') as BountyCategory | null
  const bounties = await getOpenBounties(category ?? undefined)
  return NextResponse.json({ bounties })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { title, description, reward_melo, category, deadline } = await req.json()
  if (!title || !description || !reward_melo) {
    return NextResponse.json({ error: 'title, description, reward_melo required' }, { status: 400 })
  }

  const bounty = await createBounty(wallet, title, description, reward_melo, { category, deadline })
  return NextResponse.json({ bounty }, { status: 201 })
}
