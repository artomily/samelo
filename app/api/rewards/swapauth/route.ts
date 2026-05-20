import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress, keccak256, encodePacked, randomBytes } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

/**
 * POST /api/rewards/swapauth
 *
 * Issues an oracle-signed payload that authorises a SameloSwap.swapPoints()
 * transaction. The signature is tied to:
 *   keccak256(abi.encodePacked(user, pointAmount, nonce, swapAddress))
 *
 * Body: { walletAddress: string, pointAmount: number }
 *
 * Returns: { pointAmount, nonce, signature, celoPreview }
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { walletAddress, pointAmount } = body as Record<string, unknown>

  if (typeof walletAddress !== 'string' || !isAddress(walletAddress)) {
    return NextResponse.json({ error: 'Valid walletAddress required' }, { status: 400 })
  }

  if (typeof pointAmount !== 'number' || !Number.isInteger(pointAmount) || pointAmount <= 0) {
    return NextResponse.json({ error: 'pointAmount must be a positive integer' }, { status: 400 })
  }

  const rawKey = process.env.REWARD_ORACLE_PRIVATE_KEY
  const swapAddress = process.env.NEXT_PUBLIC_SWAP_ADDRESS as `0x${string}` | undefined

  if (!rawKey || rawKey === '0x') {
    return NextResponse.json({ error: 'Oracle key not configured' }, { status: 503 })
  }
  if (!swapAddress) {
    return NextResponse.json({ error: 'Swap contract not configured' }, { status: 503 })
  }

  const supabase = getServiceSupabase()

  // Verify the user has at least pointAmount unclaimed points
  const { data: rows } = await supabase
    .from('watches')
    .select('reward_cents')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('claimed', false)

  // reward_cents maps 1:1 to points (1 cent = 1 point in Samelo)
  const availablePoints = (rows ?? []).reduce((s, r) => s + (r.reward_cents ?? 0), 0)

  if (availablePoints < pointAmount) {
    return NextResponse.json(
      { error: `Insufficient points: have ${availablePoints}, need ${pointAmount}` },
      { status: 400 },
    )
  }

  // Random bytes32 nonce — unique per swap request
  const nonce = `0x${Buffer.from(randomBytes(32)).toString('hex')}` as `0x${string}`

  // Sign: keccak256(abi.encodePacked(user, pointAmount, nonce, swapAddress))
  const hash = keccak256(
    encodePacked(
      ['address', 'uint256', 'bytes32', 'address'],
      [walletAddress as `0x${string}`, BigInt(pointAmount), nonce, swapAddress],
    ),
  )

  const oracle = privateKeyToAccount(rawKey as `0x${string}`)
  const signature = await oracle.signMessage({ message: { raw: hash } })

  // Preview: pointsToCELORate default 1e13 wei/point
  const rateWei = BigInt(process.env.POINTS_TO_CELO_RATE_WEI ?? '10000000000000') // 1e13
  const celoPreview = (BigInt(pointAmount) * rateWei).toString()

  return NextResponse.json({
    pointAmount,
    nonce,
    signature,
    celoPreview,
  })
}
