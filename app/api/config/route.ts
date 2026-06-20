import { NextRequest, NextResponse } from 'next/server'
import { getPublicConfig, getAllConfig, setConfig } from '@/lib/platform-config'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (wallet && isAdmin(wallet)) {
    const all = await getAllConfig()
    return NextResponse.json({ config: all, mode: 'admin' })
  }
  const config = await getPublicConfig()
  return NextResponse.json({ config, mode: 'public' })
}

export async function PATCH(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { key, value } = await req.json()
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

  await setConfig(key, value, wallet)
  return NextResponse.json({ ok: true })
}
