import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  try { requireAdmin(wallet) } catch { return apiError('UNAUTHORIZED', 'Admin only', 403) }

  const body = await request.json()
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('playlists')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ playlist: data })
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = _request.headers.get('x-wallet-address')
  try { requireAdmin(wallet) } catch { return apiError('UNAUTHORIZED', 'Admin only', 403) }

  const supabase = getServiceSupabase()
  const { error } = await supabase.from('playlists').delete().eq('id', params.id)
  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ deleted: true })
}
