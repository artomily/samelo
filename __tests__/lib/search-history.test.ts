import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((k: string) => store[k] ?? null),
    setItem: vi.fn((k: string, v: string) => { store[k] = v }),
    removeItem: vi.fn((k: string) => { delete store[k] }),
    clear: () => { store = {} },
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: mockStorage })

import {
  getSearchHistory,
  addToSearchHistory,
  removeFromSearchHistory,
  clearSearchHistory,
} from '@/lib/search-history'

describe('search history', () => {
  beforeEach(() => mockStorage.clear())

  it('returns empty array initially', () => {
    expect(getSearchHistory()).toEqual([])
  })

  it('adds a query to history', () => {
    addToSearchHistory('celo')
    expect(getSearchHistory()).toContain('celo')
  })

  it('deduplicates and puts new entry first', () => {
    addToSearchHistory('celo')
    addToSearchHistory('melo')
    addToSearchHistory('celo')
    const history = getSearchHistory()
    expect(history[0]).toBe('celo')
    expect(history.filter(q => q === 'celo')).toHaveLength(1)
  })

  it('removes a specific query', () => {
    addToSearchHistory('celo')
    addToSearchHistory('melo')
    removeFromSearchHistory('celo')
    expect(getSearchHistory()).not.toContain('celo')
    expect(getSearchHistory()).toContain('melo')
  })

  it('clears all history', () => {
    addToSearchHistory('celo')
    addToSearchHistory('melo')
    clearSearchHistory()
    expect(getSearchHistory()).toEqual([])
  })
})
