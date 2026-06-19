/** Calculate a user's engagement score based on multiple activity signals */
export interface EngagementInput {
  watchCount: number
  quizCount: number
  referralCount: number
  swapCount: number
  missionCount: number
}

export function calcEngagementScore(input: EngagementInput): number {
  return (
    input.watchCount * 1 +
    input.quizCount * 3 +
    input.referralCount * 10 +
    input.swapCount * 5 +
    input.missionCount * 8
  )
}

/** Assign a tier label based on engagement score */
export function engagementTier(score: number): 'Observer' | 'Watcher' | 'Miner' | 'Pioneer' | 'Legend' {
  if (score >= 1000) return 'Legend'
  if (score >= 500) return 'Pioneer'
  if (score >= 200) return 'Miner'
  if (score >= 50) return 'Watcher'
  return 'Observer'
}
