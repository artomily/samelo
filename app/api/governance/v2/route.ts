import { NextRequest, NextResponse } from 'next/server'
import { getAllProposals, createProposal } from '@/lib/governance-v2'
import { isAdmin } from '@/lib/admin-auth'

export async function GET() {
  const proposals = await getAllProposals()
  return NextResponse.json({ proposals })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { title, description, ends_at, quorum_required } = await req.json()
  if (!title || !description || !ends_at) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const proposal = await createProposal(title, description, wallet, ends_at, quorum_required ?? 100)
  return NextResponse.json({ proposal }, { status: 201 })
}
