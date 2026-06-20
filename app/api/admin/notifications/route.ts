import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { notifySystem } from '@/lib/notify'
import { validateWalletAddress } from '@/lib/security/sanitize'

export async function POST(request: Request) {
  const adminWallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(adminWallet)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { wallet?: string; wallets?: string[]; title: string; body: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!body.title || !body.body) {
    return NextResponse.json({ error: 'title and body are required' }, { status: 400 })
  }

  const targets = body.wallets ?? (body.wallet ? [body.wallet] : [])
  if (targets.length === 0) {
    return NextResponse.json({ error: 'Provide wallet or wallets array' }, { status: 400 })
  }

  const invalid = targets.filter(w => !validateWalletAddress(w))
  if (invalid.length > 0) {
    return NextResponse.json({ error: 'Invalid wallet addresses', invalid }, { status: 400 })
  }

  const results = await Promise.allSettled(
    targets.map(w => notifySystem(w, body.title, body.body))
  )

  const sent = results.filter(r => r.status === 'fulfilled').length
  return NextResponse.json({ sent, total: targets.length })
}
