import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { validateWallet } from '@/lib/middleware/validate-wallet'
import type { MissionWithProgress } from '@/lib/types/missions'

export async function GET(request: NextRequest) {
  const walletParam = request.nextUrl.searchParams.get('walletAddress')
  const supabase = getServiceSupabase()

  try {
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (missionsError) throw missionsError

    const missionList = missions ?? []

    // If no wallet provided, return missions without progress
    if (!walletParam) {
      const result: MissionWithProgress[] = missionList.map((m) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
        description: m.description,
        missionType: m.mission_type,
        targetValue: m.target_value,
        rewardPoints: m.reward_points,
        isActive: m.is_active,
        sortOrder: m.sort_order,
        progress: 0,
        completedAt: null,
        claimedAt: null,
        isCompleted: false,
        isClaimed: false,
        progressPercent: 0,
      }))
      return NextResponse.json({ missions: result })
    }

    const validation = validateWallet(walletParam)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const wallet = validation.address!

    const { data: userMissions } = await supabase
      .from('user_missions')
      .select('mission_id, progress, completed_at, claimed_at')
      .eq('wallet_address', wallet)

    const progressMap = new Map(
      (userMissions ?? []).map((um) => [
        um.mission_id,
        { progress: um.progress, completedAt: um.completed_at, claimedAt: um.claimed_at },
      ]),
    )

    const result: MissionWithProgress[] = missionList.map((m) => {
      const up = progressMap.get(m.id)
      const progress = up?.progress ?? 0
      const completedAt = up?.completedAt ?? null
      const claimedAt = up?.claimedAt ?? null
      const isCompleted = completedAt !== null
      const isClaimed = claimedAt !== null
      const progressPercent = Math.min(100, Math.round((progress / m.target_value) * 100))

      return {
        id: m.id,
        slug: m.slug,
        title: m.title,
        description: m.description,
        missionType: m.mission_type,
        targetValue: m.target_value,
        rewardPoints: m.reward_points,
        isActive: m.is_active,
        sortOrder: m.sort_order,
        progress,
        completedAt,
        claimedAt,
        isCompleted,
        isClaimed,
        progressPercent,
      }
    })

    return NextResponse.json({ missions: result })
  } catch (err) {
    console.error('[/api/missions/list]', err)
    return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 })
  }
}
