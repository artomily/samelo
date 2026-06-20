import { NextRequest, NextResponse } from 'next/server'
import { ingestEvent } from '@/lib/onchain-events'
import { isAdmin } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(wallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { txHash, blockNumber, chainId, contractAddress, eventName, data } = body

  if (!txHash || !blockNumber || !chainId || !contractAddress || !eventName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const event = await ingestEvent({ txHash, blockNumber, chainId, contractAddress, eventName, wallet: body.wallet, data })
  return NextResponse.json({ event }, { status: 201 })
}
