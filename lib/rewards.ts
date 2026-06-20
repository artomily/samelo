import { createClient } from '@supabase/supabase-js'
import { getTierForPoints, POINTS_PER_VIDEO, POINTS_PER_QUIZ, STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS } from './types/rewards'
import type { DailyReward, WeeklyReward } from './types/rewards'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function recordVideoWatch(wallet: string, streakDays: number): Promise<DailyReward> {
  const supabase = getSupabase()
  const today = new Date().toISOString().split('T')[0]
  const streakBonus = Math.min(streakDays * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS)
  const pointsToAdd = POINTS_PER_VIDEO + streakBonus

  const { data: existing } = await supabase
    .from('daily_rewards')
    .select('*')
    .eq('wallet', wallet)
    .eq('day', today)
    .maybeSingle()

  if (existing) {
    const newPoints = existing.points_earned + pointsToAdd
    const tier = getTierForPoints(newPoints)
    const { data, error } = await supabase
      .from('daily_rewards')
      .update({
        points_earned: newPoints,
        videos_watched: existing.videos_watched + 1,
        bonus_multiplier: tier.bonus_multiplier,
      })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('daily_rewards')
    .insert({
      wallet,
      day: today,
      points_earned: pointsToAdd,
      videos_watched: 1,
      bonus_multiplier: getTierForPoints(pointsToAdd).bonus_multiplier,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function recordQuizPass(wallet: string): Promise<DailyReward> {
  const supabase = getSupabase()
  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('daily_rewards')
    .select('*')
    .eq('wallet', wallet)
    .eq('day', today)
    .maybeSingle()

  if (existing) {
    const newPoints = existing.points_earned + POINTS_PER_QUIZ
    const { data, error } = await supabase
      .from('daily_rewards')
      .update({
        points_earned: newPoints,
        quizzes_passed: existing.quizzes_passed + 1,
        bonus_multiplier: getTierForPoints(newPoints).bonus_multiplier,
      })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('daily_rewards')
    .insert({
      wallet,
      day: today,
      points_earned: POINTS_PER_QUIZ,
      quizzes_passed: 1,
      bonus_multiplier: getTierForPoints(POINTS_PER_QUIZ).bonus_multiplier,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getDailyReward(wallet: string, day?: string): Promise<DailyReward | null> {
  const supabase = getSupabase()
  const targetDay = day ?? new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_rewards')
    .select('*')
    .eq('wallet', wallet)
    .eq('day', targetDay)
    .maybeSingle()
  return data
}

export async function getWeeklyStats(wallet: string): Promise<WeeklyReward | null> {
  const supabase = getSupabase()
  const weekStart = getWeekStart()
  const { data } = await supabase
    .from('weekly_rewards')
    .select('*')
    .eq('wallet', wallet)
    .eq('week_start', weekStart)
    .maybeSingle()
  return data
}

function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split('T')[0]
}
