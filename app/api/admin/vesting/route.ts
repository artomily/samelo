import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { createVestingSchedule, getVestingSchedules } from '@/lib/vesting'
import type { VestingCategory } from '@/lib/types/vesting'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(wallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const target = req.nextUrl.searchParams.get('wallet') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(target)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  const schedules = await getVestingSchedules(target)
  return NextResponse.json({ schedules })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(wallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { target, totalMelo, cliffAt, vestStart, vestEnd, category } = await req.json()

  if (!target || !totalMelo || !cliffAt || !vestStart || !vestEnd || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const schedule = await createVestingSchedule(
    target,
    totalMelo,
    new Date(cliffAt),
    new Date(vestStart),
    new Date(vestEnd),
    category as VestingCategory
  )

  return NextResponse.json({ schedule }, { status: 201 })
}
