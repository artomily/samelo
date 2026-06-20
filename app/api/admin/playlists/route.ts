import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  try { requireAdmin(wallet) } catch { return apiError('UNAUTHORIZED', 'Admin only', 403) }

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('playlists')
    .select('*, playlist_videos(count)')
    .order('sort_order', { ascending: true })

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ playlists: data ?? [] })
}

export async function POST(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  try { requireAdmin(wallet) } catch { return apiError('UNAUTHORIZED', 'Admin only', 403) }

  const body = await request.json()
  const { slug, title, description, thumbnail_url, is_featured, sort_order } = body

  if (!slug || !title) return apiError('VALIDATION', 'slug and title required', 400)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('playlists')
    .insert({ slug, title, description, thumbnail_url, is_featured: is_featured ?? false, sort_order: sort_order ?? 0 })
    .select()
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ playlist: data }, 201)
}
