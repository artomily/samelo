import { createClient } from '@supabase/supabase-js'
import type { PriceSnapshot } from './types/price-feed'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getLatestPrice(symbol: string): Promise<PriceSnapshot | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('price_snapshots')
    .select('*')
    .eq('symbol', symbol)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return data ?? null
}

export async function getLatestPrices(symbols: string[]): Promise<Record<string, PriceSnapshot>> {
  const result: Record<string, PriceSnapshot> = {}
  await Promise.all(
    symbols.map(async (symbol) => {
      const snap = await getLatestPrice(symbol)
      if (snap) result[symbol] = snap
    })
  )
  return result
}

export async function ingestPriceSnapshot(
  symbol: string,
  priceUsd: number,
  extras?: {
    price_celo?: number
    market_cap_usd?: number
    volume_24h_usd?: number
    change_24h_pct?: number
  }
): Promise<PriceSnapshot> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('price_snapshots')
    .insert({
      symbol,
      price_usd: priceUsd,
      price_celo: extras?.price_celo ?? null,
      market_cap_usd: extras?.market_cap_usd ?? null,
      volume_24h_usd: extras?.volume_24h_usd ?? null,
      change_24h_pct: extras?.change_24h_pct ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getPriceHistory(symbol: string, limitHours = 24): Promise<PriceSnapshot[]> {
  const supabase = getSupabase()
  const since = new Date(Date.now() - limitHours * 3600_000).toISOString()
  const { data } = await supabase
    .from('price_snapshots')
    .select('*')
    .eq('symbol', symbol)
    .gte('created_at', since)
    .order('created_at', { ascending: true })
  return data ?? []
}
