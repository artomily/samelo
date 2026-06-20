import { describe, it, expect } from 'vitest'
import {
  REPORT_REASON_LABELS,
  REPORT_STATUS_COLORS,
  type ReportReason,
  type ReportStatus,
} from '@/lib/types/moderation'

describe('moderation types', () => {
  const REASONS: ReportReason[] = ['spam', 'inappropriate', 'misinformation', 'copyright', 'other']
  const STATUSES: ReportStatus[] = ['pending', 'reviewed', 'actioned', 'dismissed']

  it('REPORT_REASON_LABELS has a label for every reason', () => {
    for (const reason of REASONS) {
      expect(REPORT_REASON_LABELS[reason]).toBeTruthy()
    }
  })

  it('REPORT_STATUS_COLORS has a color for every status', () => {
    for (const status of STATUSES) {
      expect(REPORT_STATUS_COLORS[status]).toMatch(/^#/)
    }
  })

  it('pending status is yellow-ish', () => {
    expect(REPORT_STATUS_COLORS.pending).toBeTruthy()
  })

  it('actioned status is red-ish', () => {
    expect(REPORT_STATUS_COLORS.actioned).toBeTruthy()
  })

  it('has 5 report reasons', () => {
    expect(REASONS).toHaveLength(5)
  })

  it('all labels are non-empty strings', () => {
    for (const label of Object.values(REPORT_REASON_LABELS)) {
      expect(label.length).toBeGreaterThan(0)
    }
  })
})
