import { createClient } from '@supabase/supabase-js'
import type { VestingSchedule, VestingClaim, VestingCategory } from './types/vesting'
import { computeVestedAmount } from './types/vesting'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getVestingSchedules(wallet: string): Promise<VestingSchedule[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('vesting_schedules')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .order('vest_start')
  if (error) throw error
  return data ?? []
}

export async function createVestingSchedule(
  wallet: string,
  totalMelo: number,
  cliffAt: Date,
  vestStart: Date,
  vestEnd: Date,
  category: VestingCategory
): Promise<VestingSchedule> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('vesting_schedules')
    .insert({
      wallet: wallet.toLowerCase(),
      total_melo: totalMelo,
      cliff_at: cliffAt.toISOString(),
      vest_start: vestStart.toISOString(),
      vest_end: vestEnd.toISOString(),
      category,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function claimVested(scheduleId: string, wallet: string): Promise<VestingClaim> {
  const supabase = getSupabase()

  const { data: schedule, error: schedErr } = await supabase
    .from('vesting_schedules')
    .select('*')
    .eq('id', scheduleId)
    .eq('wallet', wallet.toLowerCase())
    .single()

  if (schedErr || !schedule) throw new Error('Schedule not found')

  const claimable = Math.max(0, computeVestedAmount(schedule) - schedule.vested_melo)
  if (claimable <= 0) throw new Error('Nothing to claim')

  const { error: updateErr } = await supabase
    .from('vesting_schedules')
    .update({ vested_melo: schedule.vested_melo + claimable })
    .eq('id', scheduleId)
  if (updateErr) throw updateErr

  const { data: claim, error: claimErr } = await supabase
    .from('vesting_claims')
    .insert({ schedule_id: scheduleId, wallet: wallet.toLowerCase(), amount: claimable })
    .select()
    .single()
  if (claimErr) throw claimErr

  return claim
}
