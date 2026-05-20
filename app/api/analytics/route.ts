import { NextResponse } from 'next/server'
import { createPublicClient, http, formatUnits } from 'viem'
import { getServiceSupabase } from '@/lib/supabase'
import { TREASURY_SIMPLE_ABI } from '@/lib/treasurySimple.abi'
import { TREASURY_ABI } from '@/lib/treasury.abi'

/**
 * GET /api/analytics
 *
 * Returns global + user-level analytics for the AnalyticsPanel.
 *
 * Query params:
 *   walletAddress  — optional, for per-user earnings
 *
 * Returns:
 *   poolBalance      — reward pool CELO balance (string, 18 decimals)
 *   totalPaidOut     — total CELO released (string)
 *   videosToday      — count of distinct videos with a watch event today
 *   totalWatchers    — count of distinct wallet addresses
 *   userEarningsCents — unclaimed cents for walletAddress (or 0)
 *   leaderboard      — top 5 wallets by total earned cents
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('walletAddress')

  const supabase = getServiceSupabase()

  // ── On-chain pool balance ───────────────────────────────────────────────
  const isTestnet = process.env.NEXT_PUBLIC_CHAIN_ENV === 'testnet'
  const contractAddress = (
    isTestnet
      ? process.env.NEXT_PUBLIC_TREASURY_SIMPLE_ADDRESS
      : process.env.NEXT_PUBLIC_TREASURY_ADDRESS
  ) as `0x${string}` | undefined

  const rpcUrl = process.env.NEXT_PUBLIC_CELO_RPC ?? (
    isTestnet ? 'https://celo-sepolia.drpc.org' : 'https://forno.celo.org'
  )

  let poolBalance = '0'
  let totalPaidOut = '0'

  if (contractAddress) {
    try {
      const { activeChain } = await import('@/lib/wagmi')
      const publicClient = createPublicClient({
        chain: activeChain,
        transport: http(rpcUrl),
      })

      const abi = isTestnet ? TREASURY_SIMPLE_ABI : TREASURY_ABI

      const [pool, paidOut] = await Promise.all([
        publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: 'rewardPoolBalance',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: 'totalPaidOut',
        }) as Promise<bigint>,
      ])

      poolBalance = formatUnits(pool, 18)
      totalPaidOut = formatUnits(paidOut, 18)
    } catch {
      // Non-fatal: contract may not be funded yet on testnet
    }
  }

  // ── Off-chain Supabase metrics ──────────────────────────────────────────

  // Distinct wallets
  const { count: totalWatchers } = await supabase
    .from('watches')
    .select('wallet_address', { count: 'exact', head: true })

  // Videos watched today
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)
  const { count: videosToday } = await supabase
    .from('watches')
    .select('video_id', { count: 'exact', head: true })
    .gte('watched_at', todayStart.toISOString())

  // Per-user unclaimed cents
  let userEarningsCents = 0
  if (walletAddress) {
    const { data: userRows } = await supabase
      .from('watches')
      .select('reward_cents')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('claimed', false)
    userEarningsCents = (userRows ?? []).reduce((s, r) => s + (r.reward_cents ?? 0), 0)
  }

  // Leaderboard: top 5 by total earned (all-time)
  const { data: lbRows } = await supabase
    .from('watches')
    .select('wallet_address, reward_cents')
    .order('reward_cents', { ascending: false })

  const lbMap = new Map<string, number>()
  for (const r of lbRows ?? []) {
    lbMap.set(r.wallet_address, (lbMap.get(r.wallet_address) ?? 0) + (r.reward_cents ?? 0))
  }
  const leaderboard = Array.from(lbMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([wallet, totalCents]) => ({ wallet, totalCents }))

  return NextResponse.json({
    poolBalance,
    totalPaidOut,
    videosToday: videosToday ?? 0,
    totalWatchers: totalWatchers ?? 0,
    userEarningsCents,
    leaderboard,
  })
}
