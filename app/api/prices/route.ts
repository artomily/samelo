import { NextRequest, NextResponse } from 'next/server'
import { getLatestPrices } from '@/lib/price-feed'
import { TRACKED_SYMBOLS } from '@/lib/types/price-feed'

export async function GET(req: NextRequest) {
  const symbolsParam = req.nextUrl.searchParams.get('symbols')
  const symbols = symbolsParam
    ? symbolsParam.split(',').map((s) => s.trim().toUpperCase())
    : [...TRACKED_SYMBOLS]
  const prices = await getLatestPrices(symbols)
  return NextResponse.json({ prices })
}
