import { NextRequest, NextResponse } from 'next/server'
import { recordSwap } from '@/lib/swap'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { quoteId, tokenIn, tokenOut, amountIn, amountOut, txHash } = await req.json()

  if (!tokenIn || !tokenOut || !amountIn || !amountOut || !txHash) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const swap = await recordSwap(wallet, quoteId ?? null, tokenIn, tokenOut, amountIn, amountOut, txHash)
  return NextResponse.json({ swap }, { status: 201 })
}
