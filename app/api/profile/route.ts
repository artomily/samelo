import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('walletAddress')

  if (!wallet || !isAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 })
  }

  const supabase = getServiceSupabase()
  const addr = wallet.toLowerCase()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('wallet_address, display_name, referral_code, referred_by, total_points, total_earned_cents')
    .eq('wallet_address', addr)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json({ profile })
}

export async function PATCH(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { walletAddress, displayName } = body as Record<string, unknown>

  if (typeof walletAddress !== 'string' || !isAddress(walletAddress)) {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 })
  }

  if (typeof displayName !== 'string' || displayName.trim().length < 1 || displayName.length > 32) {
    return NextResponse.json(
      { error: 'displayName must be 1–32 characters' },
      { status: 400 },
    )
  }

  const supabase = getServiceSupabase()

  const { data, error } = await supabase
    .from('profiles')
    .update({ display_name: displayName.trim() })
    .eq('wallet_address', walletAddress.toLowerCase())
    .select('wallet_address, display_name')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}
