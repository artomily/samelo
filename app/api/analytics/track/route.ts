import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, trackFeatureUsage } from '@/lib/platform-analytics'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const { type, path, referrer, session_id, feature, action, metadata } = await req.json()

  if (type === 'pageview') {
    if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 })
    await trackPageView(
      path,
      wallet && /^0x[0-9a-fA-F]{40}$/.test(wallet) ? wallet : undefined,
      referrer,
      session_id
    ).catch(() => {})
    return NextResponse.json({ ok: true })
  }

  if (type === 'feature') {
    if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
      return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
    }
    if (!feature || !action) return NextResponse.json({ error: 'feature and action required' }, { status: 400 })
    await trackFeatureUsage(wallet, feature, action, metadata ?? {}).catch(() => {})
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
}
