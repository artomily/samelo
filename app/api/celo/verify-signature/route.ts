import { NextResponse } from 'next/server'
import { verifyOracleSignature, type OracleSignaturePayload } from '@/lib/celo/oracle'
import type { Hex } from 'viem'

export async function POST(request: Request) {
  let body: { payload: OracleSignaturePayload; signature: Hex; expectedSigner: Hex }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { payload, signature, expectedSigner } = body

  if (!payload || !signature || !expectedSigner) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const valid = await verifyOracleSignature(
      { ...payload, points: BigInt(payload.points), nonce: BigInt(payload.nonce) },
      signature,
      expectedSigner
    )
    return NextResponse.json({ valid })
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed', valid: false }, { status: 200 })
  }
}
