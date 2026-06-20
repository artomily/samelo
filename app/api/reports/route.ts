import { NextResponse } from 'next/server'
import { createReport } from '@/lib/moderation'
import { validateWalletAddress, clampString } from '@/lib/security/sanitize'
import type { ReportTargetType, ReportReason } from '@/lib/types/moderation'

const TARGET_TYPES: ReportTargetType[] = ['video', 'comment', 'profile', 'playlist']
const REASONS: ReportReason[] = ['spam', 'inappropriate', 'misinformation', 'copyright', 'other']

export async function POST(request: Request) {
  const wallet = request.headers.get('x-wallet-address') ?? ''
  if (!validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 401 })
  }

  let body: { targetType: ReportTargetType; targetId: string; reason: ReportReason; description?: string }
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  if (!TARGET_TYPES.includes(body.targetType)) {
    return NextResponse.json({ error: 'Invalid target type' }, { status: 400 })
  }
  if (!REASONS.includes(body.reason)) {
    return NextResponse.json({ error: 'Invalid reason' }, { status: 400 })
  }
  if (!body.targetId) {
    return NextResponse.json({ error: 'targetId required' }, { status: 400 })
  }

  try {
    const report = await createReport(
      wallet,
      body.targetType,
      body.targetId,
      body.reason,
      body.description ? clampString(body.description, 500) : undefined
    )
    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    if ((error as Error).message === 'Already reported') {
      return NextResponse.json({ error: 'Already reported' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}
