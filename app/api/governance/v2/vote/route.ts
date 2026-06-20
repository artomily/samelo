import { NextRequest, NextResponse } from 'next/server'
import { castVote, getWalletVote } from '@/lib/governance-v2'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const proposalId = req.nextUrl.searchParams.get('proposal_id')
  if (!proposalId) return NextResponse.json({ error: 'proposal_id required' }, { status: 400 })
  const vote = await getWalletVote(proposalId, wallet)
  return NextResponse.json({ vote })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const { proposal_id, vote } = await req.json()
  if (!proposal_id || vote === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  try {
    await castVote(proposal_id, wallet, Boolean(vote))
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
