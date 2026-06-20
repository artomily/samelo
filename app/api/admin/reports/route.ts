import { NextResponse } from 'next/server'
import { getReports, reviewReport } from '@/lib/moderation'
import { isAdmin } from '@/lib/admin-auth'
import { validateUuid } from '@/lib/security/sanitize'
import type { ReportStatus } from '@/lib/types/moderation'

const VALID_STATUSES: ReportStatus[] = ['pending', 'reviewed', 'actioned', 'dismissed']

export async function GET(request: Request) {
  const adminWallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(adminWallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') as ReportStatus | null

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    const reports = await getReports(status ?? undefined)
    return NextResponse.json({ reports, total: reports.length })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const adminWallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(adminWallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: { reportId: string; status: ReportStatus }
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  if (!validateUuid(body.reportId)) {
    return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 })
  }
  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    await reviewReport(body.reportId, adminWallet, body.status)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to review report' }, { status: 500 })
  }
}
