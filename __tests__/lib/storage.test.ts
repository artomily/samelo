import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from '@/lib/storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('sets and gets a value', () => {
    storage.set('test', { foo: 'bar' })
    expect(storage.get<{ foo: string }>('test')).toEqual({ foo: 'bar' })
  })

  it('returns null for missing key', () => {
    expect(storage.get('nonexistent')).toBeNull()
  })

  it('removes a key', () => {
    storage.set('key', 42)
    storage.remove('key')
    expect(storage.get('key')).toBeNull()
  })

  it('clears all keys', () => {
    storage.set('a', 1)
    storage.set('b', 2)
    storage.clear()
    expect(storage.get('a')).toBeNull()
    expect(storage.get('b')).toBeNull()
  })

  it('handles storing different types', () => {
    storage.set('num', 42)
    storage.set('bool', true)
    storage.set('arr', [1, 2, 3])
    expect(storage.get<number>('num')).toBe(42)
    expect(storage.get<boolean>('bool')).toBe(true)
    expect(storage.get<number[]>('arr')).toEqual([1, 2, 3])
  })
})
