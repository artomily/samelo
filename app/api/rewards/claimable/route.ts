import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress, keccak256, encodePacked, randomBytes } from 'viem'
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
  const supabase = getServiceSupabase()

  // Sum unclaimed rewards
  const { data: rows } = await supabase
    .from('watches')
    .select('reward_cents')
    .eq('wallet_address', wallet.toLowerCase())
    .eq('claimed', false)

  const amountCents = (rows ?? []).reduce((s, r) => s + (r.reward_cents ?? 0), 0)

  if (!rawKey || rawKey === '0x') {
    return NextResponse.json({
      amountWei: '0',
      amountCents,
      signature: null,
      nonce: null,
      devMode: true,
    })
  }

  if (amountCents === 0) {
    return NextResponse.json({
      amountWei: '0',
      amountCents: 0,
      signature: null,
      nonce: null,
      devMode: false,
    })
  }

  // 1 cent = 0.01 CELO = 10^16 wei
  const amountWei = BigInt(amountCents) * BigInt(10 ** 16)

  // Random bytes32 nonce — unique per claim request
  const nonce = `0x${Buffer.from(randomBytes(32)).toString('hex')}` as `0x${string}`

  // Treasury contract address (where executeRewardAction is called)
  const treasuryAddress = (process.env.NEXT_PUBLIC_TREASURY_ADDRESS ??
    process.env.NEXT_PUBLIC_TREASURY_SIMPLE_ADDRESS) as `0x${string}` | undefined

  if (!treasuryAddress) {
    return NextResponse.json({ error: 'Treasury not configured' }, { status: 503 })
  }

  // Sign: keccak256(abi.encodePacked(user, amount, actionType=0, nonce, treasury))
  const hash = keccak256(
    encodePacked(
      ['address', 'uint256', 'uint8', 'bytes32', 'address'],
      [wallet as `0x${string}`, amountWei, 0, nonce, treasuryAddress],
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
