'use client'

interface StreakBadgeProps {
  currentStreak: number
  longestStreak: number
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  const isActive = currentStreak > 0
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className={`text-2xl ${isActive ? '' : 'grayscale opacity-40'}`}>🔥</span>
        <div>
          <p className={`text-xl font-bold font-mono ${isActive ? 'text-[#c8f135]' : 'text-white/30'}`}>
            {currentStreak}
          </p>
          <p className="text-xs text-white/40">day streak</p>
        </div>
      </div>
      <div className="w-px h-8 bg-white/10" />
      <div>
        <p className="text-sm font-mono text-white/60">{longestStreak}</p>
        <p className="text-xs text-white/40">best streak</p>
      </div>
    </div>
  )
}
