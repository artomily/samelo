import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(_request: NextRequest, { params }: { params: { wallet: string } }) {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .select('wallet, display_name, avatar_url, bio, total_points, xp, level, current_streak, longest_streak, created_at')
    .eq('wallet', params.wallet.toLowerCase())
    .single()

  if (error || !data) return apiError('NOT_FOUND', 'Profile not found', 404)
  return apiOk({ profile: data })
}
