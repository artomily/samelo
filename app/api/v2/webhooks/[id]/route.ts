import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('webhooks')
    .update({ is_active: false })
    .eq('id', params.id)
    .eq('wallet', wallet.toLowerCase())

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ deactivated: true })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const { events, is_active } = await request.json()
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('webhooks')
    .update({ ...(events && { events }), ...(is_active !== undefined && { is_active }) })
    .eq('id', params.id)
    .eq('wallet', wallet.toLowerCase())
    .select('id, url, events, is_active')
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ webhook: data })
}
