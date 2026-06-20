export interface PriceSnapshot {
  id: string
  symbol: string
  price_usd: number
  price_celo: number | null
  market_cap_usd: number | null
  volume_24h_usd: number | null
  change_24h_pct: number | null
  source: string
  created_at: string
}

export interface PriceAlert {
  id: string
  wallet: string
  symbol: string
  target_price_usd: number
  direction: 'above' | 'below'
  triggered_at: string | null
  created_at: string
}

export const TRACKED_SYMBOLS = ['CELO', 'MELO', 'cUSD', 'cEUR'] as const
export type TrackedSymbol = typeof TRACKED_SYMBOLS[number]

export function formatPrice(usd: number): string {
  if (usd < 0.01) return `$${usd.toFixed(6)}`
  if (usd < 1) return `$${usd.toFixed(4)}`
  return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatChange(pct: number | null): string {
  if (pct === null) return '—'
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(2)}%`
}

export function isPositiveChange(pct: number | null): boolean {
  return pct !== null && pct > 0
}
