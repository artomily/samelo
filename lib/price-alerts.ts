import { createClient } from '@supabase/supabase-js'
import type { PriceAlert } from './types/price-alerts'
import { shouldTrigger } from './types/price-alerts'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createPriceAlert(
  wallet: string,
  tokenSymbol: string,
  condition: PriceAlert['condition'],
  targetPrice: number
): Promise<PriceAlert> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('price_alerts')
    .insert({ wallet, token_symbol: tokenSymbol, condition, target_price: targetPrice })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getWalletAlerts(wallet: string): Promise<PriceAlert[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function deactivateAlert(id: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('price_alerts')
    .update({ is_active: false })
    .eq('id', id)
    .eq('wallet', wallet)
}

export async function checkAndTriggerAlerts(tokenSymbol: string, currentPrice: number): Promise<number> {
  const supabase = getSupabase()
  const { data: alerts } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('token_symbol', tokenSymbol)
    .eq('is_active', true)
    .is('triggered_at', null)

  let triggered = 0
  for (const alert of alerts ?? []) {
    if (shouldTrigger(alert, currentPrice)) {
      const now = new Date().toISOString()
      await supabase
        .from('price_alerts')
        .update({ triggered_at: now, is_active: false })
        .eq('id', alert.id)

      await supabase
        .from('price_alert_history')
        .insert({ alert_id: alert.id, triggered_price: currentPrice, triggered_at: now })

      triggered++
    }
  }
  return triggered
}
