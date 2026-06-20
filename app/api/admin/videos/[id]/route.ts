import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdminWallet } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !isAdminWallet(wallet)) return apiError('UNAUTHORIZED', 'Admin only', 403)

  const body = await request.json()
  const { title, rewardCents, isActive } = body as Record<string, unknown>

  const updates: Record<string, unknown> = {}
  if (title !== undefined) updates.title = title
  if (rewardCents !== undefined) updates.reward_cents = rewardCents
  if (isActive !== undefined) updates.is_active = isActive

  if (Object.keys(updates).length === 0) {
    return apiError('MISSING_PARAMS', 'No fields to update', 400)
  }

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ video: data })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !isAdminWallet(wallet)) return apiError('UNAUTHORIZED', 'Admin only', 403)

  const supabase = getServiceSupabase()
  const { error } = await supabase.from('videos').update({ is_active: false }).eq('id', params.id)

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ deactivated: true })
}
