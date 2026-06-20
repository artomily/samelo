import { describe, it, expect } from 'vitest'
import { CAMPAIGN_STATUS_COLORS, type CampaignStatus } from '@/lib/types/advertiser'

const STATUSES: CampaignStatus[] = ['draft', 'active', 'paused', 'completed']

describe('advertiser types', () => {
  it('CAMPAIGN_STATUS_COLORS has entry for every status', () => {
    for (const status of STATUSES) {
      expect(CAMPAIGN_STATUS_COLORS[status]).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('active status uses brand lime color', () => {
    expect(CAMPAIGN_STATUS_COLORS.active).toBe('#c8f135')
  })
})
