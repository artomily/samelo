import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  try { requireAdmin(wallet) } catch { return apiError('UNAUTHORIZED', 'Admin only', 403) }

  const { video_id, position } = await request.json()
  if (!video_id) return apiError('VALIDATION', 'video_id required', 400)

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('playlist_videos')
    .upsert({ playlist_id: params.id, video_id, position: position ?? 0 })

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ added: true })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  try { requireAdmin(wallet) } catch { return apiError('UNAUTHORIZED', 'Admin only', 403) }

  const { video_id } = await request.json()
  if (!video_id) return apiError('VALIDATION', 'video_id required', 400)

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('playlist_videos')
    .delete()
    .eq('playlist_id', params.id)
    .eq('video_id', video_id)

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ removed: true })
}
