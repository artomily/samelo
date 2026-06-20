import { NextResponse } from 'next/server'
import { getCurrentBlock } from '@/lib/celo/rpc'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chainId = Number(searchParams.get('chainId') ?? '42220')

  try {
    const blockNumber = await getCurrentBlock(chainId)
    return NextResponse.json({ chainId, blockNumber: blockNumber.toString() })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch block number' }, { status: 502 })
  }
}
