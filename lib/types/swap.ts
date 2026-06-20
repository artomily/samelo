export interface SwapQuote {
  id: string
  wallet: string
  token_in: string
  token_out: string
  amount_in: number
  amount_out: number
  price_impact: number
  slippage_bps: number
  route: SwapRouteStep[]
  expires_at: string
  used: boolean
  created_at: string
}

export interface SwapRouteStep {
  pool: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
}

export type SwapStatus = 'pending' | 'confirmed' | 'failed'

export interface SwapHistory {
  id: string
  wallet: string
  quote_id: string | null
  token_in: string
  token_out: string
  amount_in: number
  amount_out: number
  tx_hash: string
  status: SwapStatus
  created_at: string
}

export const MAX_SLIPPAGE_BPS = 500
export const MIN_SLIPPAGE_BPS = 10
export const QUOTE_TTL_SECONDS = 30

export function formatPriceImpact(impact: number): string {
  if (impact < 0.01) return '< 0.01%'
  return `${impact.toFixed(2)}%`
}

export function isHighPriceImpact(impact: number): boolean {
  return impact > 2.0
}

export function calcMinimumOut(amountOut: number, slippageBps: number): number {
  return amountOut * (1 - slippageBps / 10_000)
}
