import { describe, it, expect } from 'vitest'
import { progressPct, RARITY_COLORS_V2, CATEGORY_ICONS } from '@/lib/types/achievements-v2'
import type { AchievementWithProgress, AchievementDefinitionV2, AchievementProgressV2 } from '@/lib/types/achievements-v2'

const baseDef: AchievementDefinitionV2 = {
  id: 'a1',
  slug: 'first-watch',
  title: 'First Watch',
  description: 'Complete your first video',
  category: 'watch',
  rarity: 'common',
  icon_url: null,
  points_reward: 50,
  condition_type: 'watch_count',
  condition_threshold: 10,
  is_active: true,
  sort_order: 0,
  created_at: '2026-06-21T00:00:00Z',
}

const baseProgress: AchievementProgressV2 = {
  id: 'p1',
  wallet: '0x1234567890123456789012345678901234567890',
  achievement_id: 'a1',
  current_value: 5,
  unlocked: false,
  unlocked_at: null,
  points_awarded: false,
  created_at: '2026-06-21T00:00:00Z',
  updated_at: '2026-06-21T00:00:00Z',
}

const makeAchievement = (progress: AchievementProgressV2 | null = null): AchievementWithProgress => ({
  ...baseDef,
  progress,
})

describe('progressPct', () => {
  it('returns 0 with no progress', () => {
    expect(progressPct(makeAchievement())).toBe(0)
  })

  it('calculates percentage correctly', () => {
    expect(progressPct(makeAchievement(baseProgress))).toBe(50)
  })

  it('caps at 100', () => {
    expect(progressPct(makeAchievement({ ...baseProgress, current_value: 100 }))).toBe(100)
  })
})

describe('RARITY_COLORS_V2', () => {
  it('legendary uses lime', () => {
    expect(RARITY_COLORS_V2.legendary).toBe('#c8f135')
  })

  it('all rarities have color', () => {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const
    for (const r of rarities) {
      expect(RARITY_COLORS_V2[r]).toBeTruthy()
    }
  })
})

describe('CATEGORY_ICONS', () => {
  it('has icon for every category', () => {
    const cats = ['watch', 'social', 'quiz', 'staking', 'governance', 'streak', 'referral', 'special'] as const
    for (const c of cats) {
      expect(CATEGORY_ICONS[c]).toBeTruthy()
    }
  })
})
