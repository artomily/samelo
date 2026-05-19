import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAddress, keccak256, encodePacked } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('walletAddress')

  if (!wallet || !isAddress(wallet)) {
    return NextResponse.json(
      { error: 'Valid walletAddress is required' },
      { status: 400 },
    )
  }

  const rawKey = process.env.REWARD_ORACLE_PRIVATE_KEY
  if (!rawKey || rawKey === '0x') {
    // Dev mode: return amount without signature (claim won't work on-chain yet)
    const db = getDb()
    const row = db
      .prepare(
        `SELECT COALESCE(SUM(reward_cents), 0) AS total
         FROM watches
         WHERE wallet_address = ? AND claimed = 0`,
      )
      .get(wallet.toLowerCase()) as { total: number }

    return NextResponse.json({
      amountWei: '0',
      amountCents: row.total,
      signature: null,
      nonce: 0,
      devMode: true,
    })
  }

  const db = getDb()

  const totalRow = db
    .prepare(
      `SELECT COALESCE(SUM(reward_cents), 0) AS total
       FROM watches
       WHERE wallet_address = ? AND claimed = 0`,
    )
    .get(wallet.toLowerCase()) as { total: number }

  const amountCents = totalRow.total
  // Convert cents → cUSD wei (cUSD has 18 decimals; 1 cent = 10^16 wei)
  const amountWei = BigInt(amountCents) * BigInt(10 ** 16)

  // Fetch current nonce from DB (incremented after each successful on-chain claim)
  const nonceRow = db
    .prepare(`SELECT COALESCE(MAX(nonce), 0) AS nonce FROM claim_nonces WHERE wallet_address = ?`)
    .get(wallet.toLowerCase()) as { nonce: number } | undefined

  // Lazily create the nonces table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS claim_nonces (
      wallet_address TEXT PRIMARY KEY,
      nonce          INTEGER NOT NULL DEFAULT 0
    )
  `)

  const nonce = nonceRow?.nonce ?? 0

  // Sign: keccak256(abi.encodePacked(wallet, amountWei, nonce))
  const hash = keccak256(
    encodePacked(
      ['address', 'uint256', 'uint256'],
      [wallet as `0x${string}`, amountWei, BigInt(nonce)],
    ),
  )

  const oracle = privateKeyToAccount(rawKey as `0x${string}`)
  const signature = await oracle.signMessage({ message: { raw: hash } })

  return NextResponse.json({
    amountWei: amountWei.toString(),
    amountCents,
    signature,
    nonce,
    devMode: false,
  })
}
