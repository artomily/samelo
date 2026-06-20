import { NextResponse } from 'next/server'
import { getProposal, getUserVote } from '@/lib/governance'
import { validateWalletAddress, validateUuid } from '@/lib/security/sanitize'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!validateUuid(params.id)) {
    return NextResponse.json({ error: 'Invalid proposal ID' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const viewerWallet = searchParams.get('wallet')

  try {
    const proposal = await getProposal(params.id)
    if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    let userVote = null
    if (viewerWallet && validateWalletAddress(viewerWallet)) {
      const vote = await getUserVote(params.id, viewerWallet)
      userVote = vote?.vote ?? null
    }

    return NextResponse.json({ proposal: { ...proposal, userVote } })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 })
  }
}
