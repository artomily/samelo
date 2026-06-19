import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress, keccak256, encodePacked } from 'viem'
import { randomBytes } from 'crypto'
import { privateKeyToAccount } from 'viem/accounts'
import { rateLimit } from '@/lib/middleware/rate-limit'

// Max 10 swap auth requests per wallet per 24h
const swapRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 10,
  keyFn: (req) => {
    try {
      return `swap:${req.headers.get('x-forwarded-for') ?? 'unknown'}`
    } catch {
      return 'swap:unknown'
    }
  },
})

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
  const rateLimitError = swapRateLimit(request)
  if (rateLimitError) return rateLimitError

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
  const minSwapPoints = Number(process.env.MIN_SWAP_POINTS ?? '500')

  if (!rawKey || rawKey === '0x') {
    return NextResponse.json({ error: 'Oracle key not configured' }, { status: 503 })
  }
  if (!swapAddress) {
    return NextResponse.json({ error: 'Swap contract not configured' }, { status: 503 })
  }

  if (pointAmount < minSwapPoints) {
    return NextResponse.json(
      { error: `Minimum swap amount is ${minSwapPoints} points` },
      { status: 400 },
    )
  }

  const supabase = getServiceSupabase()

  // Verify the user has at least pointAmount unclaimed points
  const { data: rows } = await supabase
    .from('watches')
    .select('points')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('claimed', false)

  const availablePoints = (rows ?? []).reduce((s, r) => s + (r.points ?? 0), 0)

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
