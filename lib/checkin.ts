import { createClient } from '@supabase/supabase-js'
import type { DailyCheckin } from './types/checkin'
import { calcCheckinPoints } from './types/checkin'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function doCheckin(wallet: string): Promise<DailyCheckin & { alreadyCheckedIn: boolean }> {
  const supabase = getSupabase()
  const today = new Date().toISOString().slice(0, 10)

  const { data: existing } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .eq('checkin_date', today)
    .maybeSingle()

  if (existing) return { ...existing, alreadyCheckedIn: true }

  const { data: yesterday } = await supabase
    .from('daily_checkins')
    .select('streak_day')
    .eq('wallet', wallet.toLowerCase())
    .eq('checkin_date', new Date(Date.now() - 86_400_000).toISOString().slice(0, 10))
    .maybeSingle()

  const streakDay = yesterday ? yesterday.streak_day + 1 : 1
  const points = calcCheckinPoints(streakDay)

  const { data, error } = await supabase
    .from('daily_checkins')
    .insert({
      wallet: wallet.toLowerCase(),
      checkin_date: today,
      streak_day: streakDay,
      points_awarded: points,
    })
    .select()
    .single()

  if (error) throw error
  return { ...data, alreadyCheckedIn: false }
}

export async function getCheckinHistory(wallet: string, days = 7): Promise<DailyCheckin[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .order('checkin_date', { ascending: false })
    .limit(days)
  if (error) throw error
  return data ?? []
}

export async function getCurrentStreak(wallet: string): Promise<number> {
  const history = await getCheckinHistory(wallet, 1)
  if (!history.length) return 0
  const today = new Date().toISOString().slice(0, 10)
  if (history[0]!.checkin_date !== today) return 0
  return history[0]!.streak_day
}
