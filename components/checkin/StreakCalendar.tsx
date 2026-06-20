'use client'

import type { DailyCheckin } from '@/lib/types/checkin'

interface Props {
  history: DailyCheckin[]
}

export function StreakCalendar({ history }: Props) {
  const checkedDates = new Set(history.map((c) => c.checkin_date))
  const today = new Date()

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })

  return (
    <div className="flex gap-2">
      {days.map((date) => {
        const checked = checkedDates.has(date)
        const isToday = date === today.toISOString().slice(0, 10)
        const label = new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' }).slice(0, 1)

        return (
          <div key={date} className="flex flex-col items-center gap-1">
            <div
              className={['w-8 h-8 rounded-full flex items-center justify-center text-xs', checked ? '' : 'bg-white/10'].join(' ')}
              style={checked ? { background: '#c8f135', color: '#030303' } : {}}
            >
              {checked ? '✓' : '·'}
            </div>
            <span className={['text-xs', isToday ? 'text-white' : 'text-white/40'].join(' ')}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
