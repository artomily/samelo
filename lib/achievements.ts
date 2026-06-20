export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

export interface AchievementInput {
  watchCount: number
  quizCount: number
  referralCount: number
  swapCount: number
  currentStreak: number
  longestStreak: number
  totalPoints: number
}

const ACHIEVEMENT_DEFS: Array<{
  id: string
  title: string
  description: string
  icon: string
  check: (i: AchievementInput) => boolean
}> = [
  { id: 'first_watch',    title: 'First Watch',    description: 'Watch your first video',          icon: '▶️', check: i => i.watchCount >= 1 },
  { id: 'watch_10',       title: 'Binge Watcher',  description: 'Watch 10 videos',                 icon: '📺', check: i => i.watchCount >= 10 },
  { id: 'watch_50',       title: 'Couch Miner',    description: 'Watch 50 videos',                 icon: '⛏️', check: i => i.watchCount >= 50 },
  { id: 'watch_100',      title: 'Centurion',      description: 'Watch 100 videos',                icon: '💯', check: i => i.watchCount >= 100 },
  { id: 'first_quiz',     title: 'Scholar',        description: 'Complete your first quiz',        icon: '📝', check: i => i.quizCount >= 1 },
  { id: 'quiz_10',        title: 'Quiz Master',    description: 'Complete 10 quizzes',             icon: '🎓', check: i => i.quizCount >= 10 },
  { id: 'first_referral', title: 'Recruiter',      description: 'Refer your first user',           icon: '🤝', check: i => i.referralCount >= 1 },
  { id: 'refer_5',        title: 'Network Node',   description: 'Refer 5 users',                   icon: '🌐', check: i => i.referralCount >= 5 },
  { id: 'first_swap',     title: 'On-Chain',       description: 'Swap points to $MELO',            icon: '⚡', check: i => i.swapCount >= 1 },
  { id: 'streak_7',       title: 'Week Warrior',   description: '7-day watch streak',              icon: '🔥', check: i => i.longestStreak >= 7 },
  { id: 'streak_30',      title: 'Iron Watcher',   description: '30-day watch streak',             icon: '💎', check: i => i.longestStreak >= 30 },
  { id: 'points_1000',    title: 'Thousandaire',   description: 'Earn 1,000 points',              icon: '🪙', check: i => i.totalPoints >= 1000 },
]

export function getAchievements(input: AchievementInput): Achievement[] {
  return ACHIEVEMENT_DEFS.map(def => ({
    id: def.id,
    title: def.title,
    description: def.description,
    icon: def.icon,
    unlocked: def.check(input),
  }))
}

export function countUnlocked(achievements: Achievement[]): number {
  return achievements.filter(a => a.unlocked).length
}
