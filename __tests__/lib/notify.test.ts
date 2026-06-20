import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn().mockResolvedValue({ id: 'test-id', type: 'reward' }),
}))

import { notifyAchievement, notifyReward, notifySwap, notifyStake, notifyFollow } from '@/lib/notify'
import { createNotification } from '@/lib/notifications'

describe('notify helpers', () => {
  beforeEach(() => vi.clearAllMocks())
  const wallet = '0x1234567890abcdef1234567890abcdef12345678'

  it('notifyAchievement calls createNotification with achievement type', async () => {
    await notifyAchievement(wallet, 'First Watch', 50)
    expect(createNotification).toHaveBeenCalledWith(
      wallet, 'achievement', expect.stringContaining('First Watch'),
      expect.stringContaining('50'), expect.any(Object)
    )
  })

  it('notifyReward calls createNotification with reward type', async () => {
    await notifyReward(wallet, 100, 'Watched video')
    expect(createNotification).toHaveBeenCalledWith(
      wallet, 'reward', expect.stringContaining('100'),
      'Watched video', expect.any(Object)
    )
  })

  it('notifySwap calls createNotification with swap type', async () => {
    await notifySwap(wallet, 1000, '1.0')
    expect(createNotification).toHaveBeenCalledWith(
      wallet, 'swap', expect.any(String), expect.stringContaining('$MELO'), expect.any(Object)
    )
  })

  it('notifyStake calls createNotification with stake type', async () => {
    await notifyStake(wallet, 500, 30)
    expect(createNotification).toHaveBeenCalledWith(
      wallet, 'stake', expect.any(String), expect.stringContaining('30 days'), expect.any(Object)
    )
  })

  it('notifyFollow calls createNotification with social type', async () => {
    const follower = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
    await notifyFollow(wallet, follower)
    expect(createNotification).toHaveBeenCalledWith(
      wallet, 'social', expect.any(String), expect.any(String), expect.any(Object)
    )
  })
})
