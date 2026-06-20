import { describe, it, expect } from 'vitest'
import { actionSeverity, REASON_LABELS_V2, ACTION_LABELS } from '@/lib/types/moderation-v2'

describe('REASON_LABELS_V2', () => {
  it('has a label for all 6 reasons', () => {
    expect(Object.keys(REASON_LABELS_V2)).toHaveLength(6)
    expect(REASON_LABELS_V2.harassment).toBeTruthy()
    expect(REASON_LABELS_V2.hate_speech).toBeTruthy()
  })
})

describe('ACTION_LABELS', () => {
  it('has labels for all 4 actions', () => {
    expect(Object.keys(ACTION_LABELS)).toHaveLength(4)
  })
})

describe('actionSeverity', () => {
  it('returns low for warn', () => {
    expect(actionSeverity('warn')).toBe('low')
  })

  it('returns medium for hide', () => {
    expect(actionSeverity('hide')).toBe('medium')
  })

  it('returns medium for restore', () => {
    expect(actionSeverity('restore')).toBe('medium')
  })

  it('returns high for ban', () => {
    expect(actionSeverity('ban')).toBe('high')
  })
})
