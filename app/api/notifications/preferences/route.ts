import { NextResponse } from 'next/server'
import { getPreferences, upsertPreferences } from '@/lib/notifications'
import { validateWalletAddress } from '@/lib/security/sanitize'
import { DEFAULT_PREFERENCES } from '@/lib/types/notification'

export async function GET(request: Request) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 401 })
  }

  try {
    const prefs = await getPreferences(wallet)
    return NextResponse.json(prefs ?? { wallet, ...DEFAULT_PREFERENCES })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 401 })
  }

  let body: Record<string, boolean>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const validKeys = Object.keys(DEFAULT_PREFERENCES)
  const filtered = Object.fromEntries(
    Object.entries(body).filter(([k, v]) => validKeys.includes(k) && typeof v === 'boolean')
  )

  try {
    await upsertPreferences(wallet, filtered)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}
