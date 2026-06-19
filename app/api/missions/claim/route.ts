import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { validateWallet } from '@/lib/middleware/validate-wallet'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { walletAddress, missionId } = body as Record<string, unknown>

  if (!walletAddress || typeof walletAddress !== 'string') {
    return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 })
  }
  if (!missionId || typeof missionId !== 'string') {
    return NextResponse.json({ error: 'missionId is required' }, { status: 400 })
  }

  const validation = validateWallet(walletAddress)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const wallet = validation.address!
  const supabase = getServiceSupabase()

  try {
    // Fetch the user_mission record
    const { data: userMission, error: umError } = await supabase
      .from('user_missions')
      .select('id, progress, completed_at, claimed_at, missions(reward_points, target_value)')
      .eq('wallet_address', wallet)
      .eq('mission_id', missionId)
      .maybeSingle()

    if (umError) throw umError

    if (!userMission) {
      return NextResponse.json({ error: 'Mission not started' }, { status: 404 })
    }
    if (!userMission.completed_at) {
      return NextResponse.json({ error: 'Mission not yet completed' }, { status: 400 })
    }
    if (userMission.claimed_at) {
      return NextResponse.json({ error: 'Reward already claimed' }, { status: 409 })
    }

    const mission = Array.isArray(userMission.missions) ? userMission.missions[0] : userMission.missions
    const rewardPoints = (mission as { reward_points: number }).reward_points

    // Mark as claimed and credit points atomically
    const now = new Date().toISOString()

    const [claimResult, profileResult] = await Promise.all([
      supabase
        .from('user_missions')
        .update({ claimed_at: now })
        .eq('id', userMission.id),
      supabase
        .from('profiles')
        .update({ total_points: supabase.rpc('increment_points', { p_wallet: wallet, p_amount: rewardPoints }) })
        .eq('wallet_address', wallet),
    ])

    if (claimResult.error) throw claimResult.error

    return NextResponse.json({ success: true, pointsAwarded: rewardPoints, claimedAt: now })
  } catch (err) {
    console.error('[/api/missions/claim]', err)
    return NextResponse.json({ error: 'Failed to claim mission reward' }, { status: 500 })
  }
}
