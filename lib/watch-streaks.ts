import { createClient } from '@supabase/supabase-js'
import type { WatchStreak, WatchStreakCheckpoint } from './types/watch-streaks'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getWatchStreak(wallet: string): Promise<WatchStreak | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('watch_streaks')
    .select('*')
    .eq('wallet', wallet)
    .single()
  return data ?? null
}

export async function recordWatchDay(wallet: string, minutesWatched: number): Promise<WatchStreak> {
  const supabase = getSupabase()
  const today = new Date().toISOString().slice(0, 10)

  const existing = await getWatchStreak(wallet)

  let currentStreak = 1
  let streakStartedAt = today

  if (existing?.last_watch_date) {
    const last = new Date(existing.last_watch_date)
    const now = new Date(today)
    const diffDays = Math.floor((now.getTime() - last.getTime()) / 86_400_000)

    if (diffDays === 0) {
      // Already recorded today
      return existing
    } else if (diffDays === 1) {
      currentStreak = existing.current_streak + 1
      streakStartedAt = existing.streak_started_at ?? today
    }
  }

  const longestStreak = existing
    ? Math.max(existing.longest_streak, currentStreak)
    : currentStreak

  const totalWatchDays = (existing?.total_watch_days ?? 0) + 1

  const { data: streak, error } = await supabase
    .from('watch_streaks')
    .upsert({
      wallet,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_watch_date: today,
      streak_started_at: streakStartedAt,
      total_watch_days: totalWatchDays,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'wallet' })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await supabase.from('watch_streak_checkpoints').upsert({
    wallet,
    watch_date: today,
    minutes_watched: minutesWatched,
    streak_day: currentStreak,
  }, { onConflict: 'wallet,watch_date' })

  return streak
}

export async function getStreakCheckpoints(wallet: string, limit = 30): Promise<WatchStreakCheckpoint[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('watch_streak_checkpoints')
    .select('*')
    .eq('wallet', wallet)
    .order('watch_date', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getLeaderboard(limit = 20): Promise<WatchStreak[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('watch_streaks')
    .select('*')
    .order('current_streak', { ascending: false })
    .limit(limit)
  return data ?? []
}
