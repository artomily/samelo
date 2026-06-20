import { NextRequest, NextResponse } from 'next/server'
import { getRecentTransactions, getLatestSnapshot, recordTransaction } from '@/lib/dao-treasury'
import { isAdmin } from '@/lib/admin-auth'
import type { TxType, TxCategory } from '@/lib/types/dao-treasury'

export async function GET() {
  const [transactions, snapshot] = await Promise.all([getRecentTransactions(20), getLatestSnapshot()])
  return NextResponse.json({ transactions, snapshot })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { tx_type, category, amount_melo, description, tx_hash, epoch } = await req.json()
  const validTypes: TxType[] = ['inflow', 'outflow', 'transfer']
  if (!validTypes.includes(tx_type) || !category || !amount_melo) {
    return NextResponse.json({ error: 'tx_type, category, and amount_melo required' }, { status: 400 })
  }

  const tx = await recordTransaction(tx_type as TxType, category as TxCategory, amount_melo, {
    description,
    txHash: tx_hash,
    epoch,
  })
  return NextResponse.json({ tx }, { status: 201 })
}
