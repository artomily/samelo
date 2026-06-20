import { NextResponse } from 'next/server'
import { banWallet, unbanWallet, isBanned } from '@/lib/moderation'
import { isAdmin } from '@/lib/admin-auth'
import { validateWalletAddress, clampString } from '@/lib/security/sanitize'

export async function GET(request: Request) {
  const adminWallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(adminWallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  const banned = await isBanned(wallet)
  return NextResponse.json({ wallet, banned })
}

export async function POST(request: Request) {
  const adminWallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(adminWallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: { wallet: string; reason: string; expiresAt?: string }
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  if (!validateWalletAddress(body.wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }
  if (!body.reason) {
    return NextResponse.json({ error: 'reason required' }, { status: 400 })
  }

  const expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined
  if (expiresAt && isNaN(expiresAt.getTime())) {
    return NextResponse.json({ error: 'Invalid expiresAt date' }, { status: 400 })
  }

  try {
    await banWallet(body.wallet, clampString(body.reason, 500), adminWallet, expiresAt)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to ban wallet' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const adminWallet = request.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(adminWallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet || !validateWalletAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  try {
    await unbanWallet(wallet)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to unban wallet' }, { status: 500 })
  }
}
