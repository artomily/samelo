import { describe, it, expect } from 'vitest'
import { isFeatureEnabled, DEFAULT_SETTINGS } from '@/lib/types/platform-config'
import type { FeatureFlags } from '@/lib/types/platform-config'

const defaultFlags: FeatureFlags = {
  tips: true,
  live_events: true,
  governance: true,
  collections: true,
}

describe('isFeatureEnabled', () => {
  it('returns true for enabled feature', () => {
    expect(isFeatureEnabled(defaultFlags, 'tips')).toBe(true)
  })

  it('returns false for disabled feature', () => {
    const flags: FeatureFlags = { ...defaultFlags, governance: false }
    expect(isFeatureEnabled(flags, 'governance')).toBe(false)
  })
})

describe('DEFAULT_SETTINGS', () => {
  it('has positive points values', () => {
    expect(DEFAULT_SETTINGS.points_per_minute_watched).toBeGreaterThan(0)
    expect(DEFAULT_SETTINGS.quiz_base_points).toBeGreaterThan(0)
    expect(DEFAULT_SETTINGS.checkin_base_points).toBeGreaterThan(0)
  })

  it('maintenance mode is off by default', () => {
    expect(DEFAULT_SETTINGS.maintenance_mode).toBe(false)
  })

  it('platform fee is 20%', () => {
    expect(DEFAULT_SETTINGS.platform_fee_pct).toBe(20)
  })

  it('all features enabled by default', () => {
    const flags = DEFAULT_SETTINGS.feature_flags
    expect(flags.tips).toBe(true)
    expect(flags.live_events).toBe(true)
    expect(flags.governance).toBe(true)
    expect(flags.collections).toBe(true)
  })
})
