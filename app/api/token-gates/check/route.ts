import { NextRequest, NextResponse } from 'next/server'
import { getGatesForResource, recordGateCheck } from '@/lib/token-gates'
import type { GateResourceType } from '@/lib/types/token-gate'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const { resource_type, resource_id, balances } = await req.json()
  if (!resource_type || !resource_id || !balances) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const gates = await getGatesForResource(resource_type as GateResourceType, resource_id)
  const results = await Promise.all(
    gates.map(async (gate) => {
      const balance = Number(balances[gate.token_address] ?? '0')
      const passed = balance >= gate.min_balance
      await recordGateCheck(wallet, gate.id, passed)
      return { gate_id: gate.id, passed, balance: String(balance) }
    })
  )
  const allPassed = results.every((r) => r.passed)
  return NextResponse.json({ results, allPassed })
}
