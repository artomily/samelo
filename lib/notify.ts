import { createNotification } from './notifications'

export async function notifyAchievement(wallet: string, achievementName: string, points: number) {
  return createNotification(
    wallet,
    'achievement',
    `Achievement unlocked: ${achievementName}`,
    `You earned ${points} bonus points!`,
    { achievementName, points }
  )
}

export async function notifyReward(wallet: string, points: number, reason: string) {
  return createNotification(
    wallet,
    'reward',
    `+${points} points earned`,
    reason,
    { points, reason }
  )
}

export async function notifySwap(wallet: string, pointsAmount: number, meloAmount: string) {
  return createNotification(
    wallet,
    'swap',
    'Swap confirmed',
    `${pointsAmount.toLocaleString()} pts → ${meloAmount} $MELO`,
    { pointsAmount, meloAmount }
  )
}

export async function notifyStake(wallet: string, amount: number, lockDays: number) {
  return createNotification(
    wallet,
    'stake',
    'Stake position opened',
    `${amount.toLocaleString()} $MELO locked for ${lockDays} days`,
    { amount, lockDays }
  )
}

export async function notifyFollow(wallet: string, followerAddress: string) {
  return createNotification(
    wallet,
    'social',
    'New follower',
    `${followerAddress.slice(0, 6)}…${followerAddress.slice(-4)} started following you`,
    { followerAddress }
  )
}

export async function notifySystem(wallet: string, title: string, body: string) {
  return createNotification(wallet, 'system', title, body)
}
