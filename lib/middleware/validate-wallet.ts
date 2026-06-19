import { NextResponse } from 'next/server'
import { isAddress } from 'viem'

export function validateWallet(wallet: string | null | undefined): {
  valid: boolean
  error?: NextResponse
  address?: string
} {
  if (!wallet || !isAddress(wallet)) {
    return {
      valid: false,
      error: NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 }),
    }
  }
  return { valid: true, address: wallet.toLowerCase() }
}
