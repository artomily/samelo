import { describe, it, expect } from 'vitest'
import { toSqlPagination, toPaginatedResult } from '@/lib/pagination'

describe('toSqlPagination', () => {
  it('calculates offset for page 1', () => {
    expect(toSqlPagination({ page: 1, pageSize: 20 })).toEqual({ limit: 20, offset: 0 })
  })

  it('calculates offset for page 3', () => {
    expect(toSqlPagination({ page: 3, pageSize: 10 })).toEqual({ limit: 10, offset: 20 })
  })

  it('clamps pageSize to 100 max', () => {
    expect(toSqlPagination({ page: 1, pageSize: 999 }).limit).toBe(100)
  })

  it('clamps page to minimum 1', () => {
    expect(toSqlPagination({ page: -1, pageSize: 10 }).offset).toBe(0)
  })
})

describe('toPaginatedResult', () => {
  it('calculates totalPages', () => {
    const result = toPaginatedResult([1, 2, 3], 30, { page: 1, pageSize: 10 })
    expect(result.totalPages).toBe(3)
  })

  it('hasNext is true when not on last page', () => {
    const result = toPaginatedResult([1], 30, { page: 1, pageSize: 10 })
    expect(result.hasNext).toBe(true)
  })

  it('hasPrev is false on first page', () => {
    const result = toPaginatedResult([1], 30, { page: 1, pageSize: 10 })
    expect(result.hasPrev).toBe(false)
  })

  it('hasNext is false on last page', () => {
    const result = toPaginatedResult([1], 30, { page: 3, pageSize: 10 })
    expect(result.hasNext).toBe(false)
  })
})
