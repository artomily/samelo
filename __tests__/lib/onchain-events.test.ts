import { describe, it, expect } from 'vitest'
import { EVENT_LABELS } from '../../lib/types/onchain-event'
import type { KnownEventName } from '../../lib/types/onchain-event'

describe('EVENT_LABELS', () => {
  const knownEvents: KnownEventName[] = [
    'PointsEarned',
    'PointsRedeemed',
    'Staked',
    'Unstaked',
    'Swapped',
    'Transferred',
  ]

  it('has a label for every known event', () => {
    for (const event of knownEvents) {
      expect(EVENT_LABELS[event]).toBeTruthy()
    }
  })

  it('labels are human-readable strings', () => {
    for (const label of Object.values(EVENT_LABELS)) {
      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(3)
    }
  })

  it('has correct label for PointsEarned', () => {
    expect(EVENT_LABELS['PointsEarned']).toBe('Points earned')
  })

  it('has correct label for Swapped', () => {
    expect(EVENT_LABELS['Swapped']).toBe('Token swapped')
  })
})
