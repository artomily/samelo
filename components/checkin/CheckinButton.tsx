'use client'

import { useDoCheckin, useCheckinHistory } from '@/hooks/useCheckin'
import { getStreakMessage, calcCheckinPoints } from '@/lib/types/checkin'
import { StreakCalendar } from './StreakCalendar'

interface Props {
  wallet: string
}

export function CheckinButton({ wallet }: Props) {
  const { data } = useCheckinHistory(wallet)
  const { mutate, isPending, data: result, isSuccess } = useDoCheckin(wallet)

  const history = data?.history ?? []
  const todayCheckin = history[0]
  const today = new Date().toISOString().slice(0, 10)
  const alreadyDone = todayCheckin?.checkin_date === today

  const currentStreak = todayCheckin?.streak_day ?? 0
  const nextPoints = calcCheckinPoints(currentStreak + 1)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Daily Check-in</p>
          <p className="text-xs text-white/40">
            {alreadyDone ? getStreakMessage(currentStreak) : `+${nextPoints} pts today`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: '#c8f135' }}>{currentStreak}</p>
          <p className="text-xs text-white/40">day streak</p>
        </div>
      </div>

      <StreakCalendar history={history} />

      {isSuccess && !result?.alreadyCheckedIn && (
        <p className="text-xs font-medium" style={{ color: '#c8f135' }}>
          +{result.points_awarded} pts — {getStreakMessage(result.streak_day)}
        </p>
      )}

      <button
        onClick={() => mutate()}
        disabled={isPending || alreadyDone}
        className="w-full py-2 rounded text-sm font-medium transition-opacity disabled:opacity-40"
        style={{ background: '#c8f135', color: '#030303' }}
      >
        {isPending ? 'Checking in…' : alreadyDone ? 'Checked in today ✓' : 'Check in'}
      </button>
    </div>
  )
}
