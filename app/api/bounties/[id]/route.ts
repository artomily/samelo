import { NextRequest, NextResponse } from 'next/server'
import { getBounty, submitBounty, approveSubmission, getBountySubmissions } from '@/lib/bounty-board'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [bounty, submissions] = await Promise.all([getBounty(id), getBountySubmissions(id)])
  if (!bounty) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ bounty, submissions })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { action, description, submission_url, submission_id, winner_wallet } = await req.json()

  if (action === 'approve') {
    if (!isAdmin(wallet)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    if (!submission_id || !winner_wallet) {
      return NextResponse.json({ error: 'submission_id and winner_wallet required' }, { status: 400 })
    }
    await approveSubmission(submission_id, winner_wallet, id)
    return NextResponse.json({ ok: true })
  }

  if (!description) return NextResponse.json({ error: 'description required' }, { status: 400 })

  const submission = await submitBounty(id, wallet, description, submission_url)
  return NextResponse.json({ submission }, { status: 201 })
}
