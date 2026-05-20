import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { getServiceSupabase } from '@/lib/supabase'
import { TREASURY_SIMPLE_ABI } from '@/lib/treasurySimple.abi'
import { isAddress } from 'viem'

/**
 * POST /api/rewards/release
 *
 * Server-side release path for SameloTreasurySimple (testnet).
 * The oracle/owner wallet calls releaseReward() directly on-chain.
 * No user wallet interaction required.
 *
 * Body: { walletAddress: string }
 *
 * Only available when NEXT_PUBLIC_CHAIN_ENV=testnet and
 * NEXT_PUBLIC_TREASURY_SIMPLE_ADDRESS is set.
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { walletAddress } = body as Record<string, unknown>

  if (typeof walletAddress !== 'string' || !isAddress(walletAddress)) {
    return NextResponse.json({ error: 'Valid walletAddress required' }, { status: 400 })
  }

  const oracleKey = process.env.REWARD_ORACLE_PRIVATE_KEY
  const treasuryAddress = process.env
    .NEXT_PUBLIC_TREASURY_SIMPLE_ADDRESS as `0x${string}` | undefined
  const rpcUrl =
    process.env.NEXT_PUBLIC_CELO_RPC ?? 'https://celo-sepolia.drpc.org'

  if (!oracleKey || oracleKey === '0x') {
    return NextResponse.json({ error: 'Oracle key not configured' }, { status: 503 })
  }
  if (!treasuryAddress) {
    return NextResponse.json({ error: 'Treasury address not configured' }, { status: 503 })
  }

  const supabase = getServiceSupabase()

  // Sum unclaimed rewards for this wallet
  const { data: rows, error: fetchError } = await supabase
    .from('watches')
    .select('id, reward_cents')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('claimed', false)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const pending = rows ?? []
  const amountCents = pending.reduce((s, r) => s + (r.reward_cents ?? 0), 0)

  if (amountCents === 0) {
    return NextResponse.json({ amountWei: '0', message: 'Nothing to claim' })
  }

  // 1 cent = 0.01 CELO = 10^16 wei
  const amountWei = BigInt(amountCents) * BigInt(10 ** 16)

  // Build a server-side wallet client (oracle pays gas on testnet)
  const account = privateKeyToAccount(oracleKey as `0x${string}`)

  // Import chain dynamically to avoid bundling mainnet RPC at testnet path
  const { celoSepolia } = await import('@/lib/chains')
  const walletClient = createWalletClient({
    account,
    chain: celoSepolia,
    transport: http(rpcUrl),
  })

  try {
    const txHash = await walletClient.writeContract({
      address: treasuryAddress,
      abi: TREASURY_SIMPLE_ABI,
      functionName: 'releaseReward',
      args: [walletAddress as `0x${string}`, amountWei],
    })

    // Mark all pending watches as claimed
    const ids = pending.map((r) => r.id)
    await supabase.from('watches').update({ claimed: true }).in('id', ids)

    return NextResponse.json({
      txHash,
      amountWei: amountWei.toString(),
      amountCents,
    })
  } catch (err) {
    console.error('[release] releaseReward tx failed:', err)
    return NextResponse.json({ error: 'Transaction failed' }, { status: 500 })
  }
}
