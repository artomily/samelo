import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { generateWebhookSecret, WEBHOOK_EVENTS } from '@/lib/webhook'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('webhooks')
    .select('id, url, events, is_active, last_triggered_at, failure_count, created_at')
    .eq('wallet', wallet.toLowerCase())

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ webhooks: data ?? [] })
}

export async function POST(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet) return apiError('UNAUTHORIZED', 'Wallet required', 401)

  const { url, events } = await request.json()
  if (!url) return apiError('VALIDATION', 'url required', 400)

  try { new URL(url) } catch { return apiError('VALIDATION', 'invalid url', 400) }

  const validEvents = (events ?? WEBHOOK_EVENTS).filter((e: string) => WEBHOOK_EVENTS.includes(e as any))
  const { secret, hash } = generateWebhookSecret()

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('webhooks')
    .insert({ wallet: wallet.toLowerCase(), url, events: validEvents, secret_hash: hash })
    .select('id, url, events, created_at')
    .single()

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ webhook: { ...data, secret }, warning: 'Save this secret — it will not be shown again' }, 201)
}
