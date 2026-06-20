import { NextRequest, NextResponse } from 'next/server'
import { getPendingReports, updateReportStatus, recordModerationAction } from '@/lib/moderation-db'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const reports = await getPendingReports()
  return NextResponse.json({ reports })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { report_id, status, action, target_type, target_id, note } = await req.json()
  if (!report_id || !status || !action || !target_type || !target_id) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  await Promise.all([
    updateReportStatus(report_id, status, wallet),
    recordModerationAction(wallet, target_type, target_id, action, note, report_id),
  ])
  return NextResponse.json({ ok: true })
}
