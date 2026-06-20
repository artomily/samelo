import { NextRequest, NextResponse } from 'next/server'
import { getAllGates, createGate } from '@/lib/token-gates'
import { isAdmin } from '@/lib/admin-auth'

export async function GET() {
  const gates = await getAllGates()
  return NextResponse.json({ gates })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !isAdmin(wallet)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const body = await req.json()
  const { name, description, token_address, chain_id, min_balance, token_type, resource_type, resource_id } = body
  if (!name || !token_address || !token_type || !resource_type || !resource_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const gate = await createGate({
    name,
    description: description ?? null,
    token_address,
    chain_id: chain_id ?? 42220,
    min_balance: min_balance ?? 1,
    token_type,
    resource_type,
    resource_id,
  })
  return NextResponse.json({ gate }, { status: 201 })
}
