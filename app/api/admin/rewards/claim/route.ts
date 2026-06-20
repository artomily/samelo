import { NextRequest, NextResponse } from 'next/server'
import { getPendingClaims, updateClaimStatus } from '@/lib/reward-claims'
import { isAdmin } from '@/lib/admin-auth'
import type { ClaimStatus } from '@/lib/types/reward-claim'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const claims = await getPendingClaims()
  return NextResponse.json({ claims })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { claim_id, status, tx_hash, admin_note } = await req.json()
  if (!claim_id) return NextResponse.json({ error: 'claim_id required' }, { status: 400 })

  const validStatuses: ClaimStatus[] = ['processing', 'paid', 'failed', 'rejected']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await updateClaimStatus(claim_id, status, { txHash: tx_hash, adminNote: admin_note })
  return NextResponse.json({ ok: true })
}
