import { createClient } from '@supabase/supabase-js'
import type { SwapQuote, SwapHistory, SwapStatus } from './types/swap'
import { QUOTE_TTL_SECONDS } from './types/swap'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createSwapQuote(
  wallet: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: number,
  amountOut: number,
  priceImpact: number,
  slippageBps: number,
  route: unknown[]
): Promise<SwapQuote> {
  const supabase = getSupabase()
  const expiresAt = new Date(Date.now() + QUOTE_TTL_SECONDS * 1000).toISOString()

  const { data, error } = await supabase
    .from('swap_quotes')
    .insert({
      wallet: wallet.toLowerCase(),
      token_in: tokenIn,
      token_out: tokenOut,
      amount_in: amountIn,
      amount_out: amountOut,
      price_impact: priceImpact,
      slippage_bps: slippageBps,
      route,
      expires_at: expiresAt,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function recordSwap(
  wallet: string,
  quoteId: string | null,
  tokenIn: string,
  tokenOut: string,
  amountIn: number,
  amountOut: number,
  txHash: string
): Promise<SwapHistory> {
  const supabase = getSupabase()

  if (quoteId) {
    await supabase.from('swap_quotes').update({ used: true }).eq('id', quoteId)
  }

  const { data, error } = await supabase
    .from('swap_history')
    .insert({
      wallet: wallet.toLowerCase(),
      quote_id: quoteId,
      token_in: tokenIn,
      token_out: tokenOut,
      amount_in: amountIn,
      amount_out: amountOut,
      tx_hash: txHash.toLowerCase(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateSwapStatus(txHash: string, status: SwapStatus): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('swap_history')
    .update({ status })
    .eq('tx_hash', txHash.toLowerCase())
}

export async function getSwapHistory(wallet: string, limit = 20): Promise<SwapHistory[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('swap_history')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}
