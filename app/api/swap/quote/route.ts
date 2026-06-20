import { NextRequest, NextResponse } from 'next/server'
import { createSwapQuote } from '@/lib/swap'
import { MAX_SLIPPAGE_BPS, MIN_SLIPPAGE_BPS } from '@/lib/types/swap'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { tokenIn, tokenOut, amountIn, amountOut, priceImpact, slippageBps, route } = await req.json()

  if (!tokenIn || !tokenOut || !amountIn || !amountOut) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const bps = slippageBps ?? 50
  if (bps < MIN_SLIPPAGE_BPS || bps > MAX_SLIPPAGE_BPS) {
    return NextResponse.json({ error: `slippageBps must be ${MIN_SLIPPAGE_BPS}–${MAX_SLIPPAGE_BPS}` }, { status: 400 })
  }

  const quote = await createSwapQuote(wallet, tokenIn, tokenOut, amountIn, amountOut, priceImpact ?? 0, bps, route ?? [])
  return NextResponse.json({ quote }, { status: 201 })
}
