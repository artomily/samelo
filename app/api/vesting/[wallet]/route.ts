import { NextRequest, NextResponse } from 'next/server'
import { getVestingSchedules } from '@/lib/vesting'
import { getClaimableAmount } from '@/lib/types/vesting'

export async function GET(
  _req: NextRequest,
  { params }: { params: { wallet: string } }
) {
  const { wallet } = params
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  const schedules = await getVestingSchedules(wallet)
  const enriched = schedules.map((s) => ({
    ...s,
    claimable: getClaimableAmount(s),
  }))

  return NextResponse.json({ schedules: enriched })
}
