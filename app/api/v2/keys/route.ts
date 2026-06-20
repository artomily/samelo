import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { generateApiKey, validateScopes } from '@/lib/api-key'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, name, key_prefix, scopes, last_used_at, expires_at, is_active, created_at')
    .eq('wallet', wallet.toLowerCase())
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ keys: data ?? [] })
}

export async function POST(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const { name, scopes, expires_at } = await request.json()
  if (!name) return apiError('VALIDATION', 'name required', 400)

  const validScopes = validateScopes(scopes ?? ['read'])
  const { key, prefix, hash } = generateApiKey()

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      wallet: wallet.toLowerCase(),
      name,
      key_hash: hash,
      key_prefix: prefix,
      scopes: validScopes,
      expires_at,
    })
    .select('id, name, key_prefix, scopes, created_at')
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  // Return plaintext key ONCE — not stored
  return apiOk({ key: { ...data, key }, warning: 'Save this key — it will not be shown again' }, 201)
}
