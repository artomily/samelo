import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (error || !data) return apiError('NOT_FOUND', 'Video not found', 404)
  return apiOk({ video: data })
}
