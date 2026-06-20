import { NextRequest, NextResponse } from 'next/server'
import { getAllBadgeDefinitions, getWalletBadgeMints } from '@/lib/nft-badges'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const [definitions, mints] = await Promise.all([
    getAllBadgeDefinitions(),
    wallet && /^0x[0-9a-fA-F]{40}$/.test(wallet)
      ? getWalletBadgeMints(wallet)
      : Promise.resolve([]),
  ])
  return NextResponse.json({ definitions, mints })
}
