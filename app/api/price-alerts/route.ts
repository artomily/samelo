import { NextRequest, NextResponse } from 'next/server'
import { createPriceAlert, getWalletAlerts, deactivateAlert, checkAndTriggerAlerts } from '@/lib/price-alerts'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const alerts = await getWalletAlerts(wallet)
  return NextResponse.json({ alerts })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { action, token_symbol = 'MELO', condition, target_price, alert_id, current_price } = await req.json()

  if (action === 'check') {
    if (!isAdmin(wallet)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    const triggered = await checkAndTriggerAlerts(token_symbol, current_price)
    return NextResponse.json({ triggered })
  }

  if (action === 'deactivate') {
    if (!alert_id) return NextResponse.json({ error: 'alert_id required' }, { status: 400 })
    await deactivateAlert(alert_id, wallet)
    return NextResponse.json({ ok: true })
  }

  if (!condition || target_price === undefined) {
    return NextResponse.json({ error: 'condition and target_price required' }, { status: 400 })
  }

  const alert = await createPriceAlert(wallet, token_symbol, condition, target_price)
  return NextResponse.json({ alert }, { status: 201 })
}
