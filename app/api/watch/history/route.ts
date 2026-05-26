import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('walletAddress')

  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 })
  }

  const supabase = getServiceSupabase()

  const { data: rows } = await supabase
    .from('watches')
    .select('video_id')
    .eq('wallet_address', wallet.toLowerCase())

  const videoIds = (rows ?? []).map((r) => r.video_id as string)

  return NextResponse.json({ videoIds })
}
