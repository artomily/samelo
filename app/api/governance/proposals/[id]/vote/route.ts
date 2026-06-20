import { NextResponse } from 'next/server'
import { castVote, getUserVote } from '@/lib/governance'
import { validateWalletAddress, validateUuid } from '@/lib/security/sanitize'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!validateUuid(params.id)) {
    return NextResponse.json({ error: 'Invalid proposal ID' }, { status: 400 })
  }

  const wallet = request.headers.get('x-wallet-address') ?? ''
  if (!validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  try {
    const vote = await getUserVote(params.id, wallet)
    return NextResponse.json({ vote: vote?.vote ?? null })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch vote' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!validateUuid(params.id)) {
    return NextResponse.json({ error: 'Invalid proposal ID' }, { status: 400 })
  }

  const wallet = request.headers.get('x-wallet-address') ?? ''
  if (!validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  let body: { vote: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!['for', 'against'].includes(body.vote)) {
    return NextResponse.json({ error: 'vote must be "for" or "against"' }, { status: 400 })
  }

  try {
    await castVote(params.id, wallet, body.vote as 'for' | 'against')
    return NextResponse.json({ ok: true })
  } catch (error) {
    const msg = (error as Error).message
    if (msg === 'Proposal is not active' || msg === 'Voting period has ended') {
      return NextResponse.json({ error: msg }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 })
  }
}
