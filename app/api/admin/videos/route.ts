import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdminWallet } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !isAdminWallet(wallet)) return apiError('UNAUTHORIZED', 'Admin only', 403)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('videos')
    .select('id, title, youtube_id, reward_cents, is_active, created_at')
    .order('created_at', { ascending: false })

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ videos: data ?? [] })
}

export async function POST(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !isAdminWallet(wallet)) return apiError('UNAUTHORIZED', 'Admin only', 403)

  const body = await request.json()
  const { title, youtubeId, rewardCents } = body as Record<string, unknown>

  if (!title || !youtubeId || typeof rewardCents !== 'number') {
    return apiError('MISSING_PARAMS', 'title, youtubeId, rewardCents required', 400)
  }

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('videos')
    .insert({ title, youtube_id: youtubeId, reward_cents: rewardCents, is_active: true })
    .select()
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ video: data }, 201)
}
