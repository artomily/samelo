import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('ad_campaigns')
    .select('*, advertisers!inner(wallet)')
    .eq('id', params.id)
    .eq('advertisers.wallet', wallet.toLowerCase())
    .single()

  if (error || !data) return apiError('NOT_FOUND', 'Campaign not found', 404)
  return apiOk({ campaign: data })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const supabase = getServiceSupabase()
  const { data: existing } = await supabase
    .from('ad_campaigns')
    .select('id, advertisers!inner(wallet)')
    .eq('id', params.id)
    .eq('advertisers.wallet', wallet.toLowerCase())
    .single()

  if (!existing) return apiError('NOT_FOUND', 'Campaign not found', 404)

  const body = await request.json()
  const allowedFields = ['name', 'status', 'budget_cents', 'cpm_cents', 'start_date', 'end_date', 'target_category']
  const update = Object.fromEntries(Object.entries(body).filter(([k]) => allowedFields.includes(k)))

  const { data, error } = await supabase
    .from('ad_campaigns')
    .update(update)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ campaign: data })
}
