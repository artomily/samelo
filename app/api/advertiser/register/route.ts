import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const { company_name, contact_email } = await request.json()
  if (!company_name) return apiError('VALIDATION', 'company_name required', 400)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('advertisers')
    .insert({ wallet: wallet.toLowerCase(), company_name, contact_email })
    .select()
    .single()

  if (error?.code === '23505') return apiError('CONFLICT', 'Advertiser already registered', 409)
  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ advertiser: data }, 201)
}
