import { NextResponse } from 'next/server'
import { getProposals, createProposal } from '@/lib/governance'
import { validateWalletAddress, sanitizeText, clampString } from '@/lib/security/sanitize'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? undefined

  const VALID_STATUSES = ['active', 'passed', 'rejected', 'cancelled']
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 })
  }

  try {
    const proposals = await getProposals(status)
    return NextResponse.json({ proposals })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const wallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(wallet)) {
    return NextResponse.json({ error: 'Only admins can create proposals' }, { status: 403 })
  }

  let body: { title: string; description: string; endsAt: string; minMeloToVote?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!body.title || !body.description || !body.endsAt) {
    return NextResponse.json({ error: 'title, description, endsAt required' }, { status: 400 })
  }

  const endsAt = new Date(body.endsAt)
  if (isNaN(endsAt.getTime()) || endsAt <= new Date()) {
    return NextResponse.json({ error: 'endsAt must be a future date' }, { status: 400 })
  }

  try {
    const proposal = await createProposal(
      wallet,
      sanitizeText(clampString(body.title, 200)),
      sanitizeText(clampString(body.description, 2000)),
      endsAt,
      body.minMeloToVote ?? 100
    )
    return NextResponse.json({ proposal }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
  }
}
