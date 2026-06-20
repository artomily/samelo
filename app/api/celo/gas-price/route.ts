import { NextResponse } from 'next/server'
import { getGasPrice } from '@/lib/celo/rpc'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chainId = Number(searchParams.get('chainId') ?? '42220')

  try {
    const gasPrice = await getGasPrice(chainId)
    return NextResponse.json({
      chainId,
      gasPriceWei: gasPrice.toString(),
      gasPriceGwei: (Number(gasPrice) / 1e9).toFixed(4),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gas price' }, { status: 502 })
  }
}
