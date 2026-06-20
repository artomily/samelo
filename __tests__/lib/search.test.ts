import { describe, it, expect } from 'vitest'
import {
  SEARCH_ICONS,
  SEARCH_LABELS,
  MIN_QUERY_LENGTH,
  MAX_QUERY_LENGTH,
  DEBOUNCE_MS,
  type SearchResultType,
} from '@/lib/types/search'

describe('search types', () => {
  const TYPES: SearchResultType[] = ['video', 'playlist', 'profile']

  it('SEARCH_ICONS has an icon for every type', () => {
    for (const type of TYPES) {
      expect(SEARCH_ICONS[type]).toBeTruthy()
    }
  })

  it('SEARCH_LABELS has a label for every type', () => {
    for (const type of TYPES) {
      expect(SEARCH_LABELS[type]).toBeTruthy()
    }
  })

  it('MIN_QUERY_LENGTH is 2', () => {
    expect(MIN_QUERY_LENGTH).toBe(2)
  })

  it('MAX_QUERY_LENGTH is at least MIN_QUERY_LENGTH', () => {
    expect(MAX_QUERY_LENGTH).toBeGreaterThanOrEqual(MIN_QUERY_LENGTH)
  })

  it('DEBOUNCE_MS is positive and reasonable', () => {
    expect(DEBOUNCE_MS).toBeGreaterThan(0)
    expect(DEBOUNCE_MS).toBeLessThanOrEqual(1000)
  })
})
