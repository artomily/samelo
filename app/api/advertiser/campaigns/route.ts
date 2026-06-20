import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const supabase = getServiceSupabase()
  const { data: advertiser } = await supabase
    .from('advertisers')
    .select('id')
    .eq('wallet', wallet.toLowerCase())
    .single()

  if (!advertiser) return apiError('NOT_FOUND', 'Advertiser account not found', 404)

  const { data, error } = await supabase
    .from('ad_campaigns')
    .select('*')
    .eq('advertiser_id', advertiser.id)
    .order('created_at', { ascending: false })

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ campaigns: data ?? [] })
}

export async function POST(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const supabase = getServiceSupabase()
  const { data: advertiser } = await supabase
    .from('advertisers')
    .select('id')
    .eq('wallet', wallet.toLowerCase())
    .single()

  if (!advertiser) return apiError('NOT_FOUND', 'Advertiser account not found', 404)

  const body = await request.json()
  const { name, budget_cents, cpm_cents, start_date, end_date, target_category } = body

  if (!name || !budget_cents) return apiError('VALIDATION', 'name and budget_cents required', 400)

  const { data, error } = await supabase
    .from('ad_campaigns')
    .insert({
      advertiser_id: advertiser.id,
      name,
      budget_cents,
      cpm_cents: cpm_cents ?? 100,
      start_date,
      end_date,
      target_category,
    })
    .select()
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ campaign: data }, 201)
}
