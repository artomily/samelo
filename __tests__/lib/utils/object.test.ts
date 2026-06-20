import { describe, it, expect } from 'vitest'
import { pick, omit, deepEqual, isEmpty, mapValues } from '@/lib/utils/object'

describe('pick', () => {
  it('picks selected keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
})

describe('omit', () => {
  it('omits selected keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 })
  })
})

describe('deepEqual', () => {
  it('returns true for equal objects', () => {
    expect(deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] })).toBe(true)
  })

  it('returns false for different objects', () => {
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
  })

  it('returns true for primitives', () => {
    expect(deepEqual(42, 42)).toBe(true)
    expect(deepEqual('hi', 'hi')).toBe(true)
  })
})

describe('isEmpty', () => {
  it('detects empty string', () => { expect(isEmpty('')).toBe(true) })
  it('detects empty array', () => { expect(isEmpty([])).toBe(true) })
  it('detects empty object', () => { expect(isEmpty({})).toBe(true) })
  it('detects null', () => { expect(isEmpty(null)).toBe(true) })
  it('returns false for non-empty', () => { expect(isEmpty([1])).toBe(false) })
})

describe('mapValues', () => {
  it('transforms values', () => {
    expect(mapValues({ a: 1, b: 2 }, v => v * 2)).toEqual({ a: 2, b: 4 })
  })
})
