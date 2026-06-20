import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock env before importing
vi.stubEnv('ADMIN_WALLET_ADDRESSES', '0xADMIN1,0xADMIN2')

const { isAdminWallet, requireAdmin } = await import('@/lib/admin-auth')

describe('isAdminWallet', () => {
  it('returns true for a configured admin address', () => {
    expect(isAdminWallet('0xadmin1')).toBe(true)
    expect(isAdminWallet('0xADMIN1')).toBe(true) // case-insensitive
  })

  it('returns false for non-admin address', () => {
    expect(isAdminWallet('0xUSER')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isAdminWallet('')).toBe(false)
  })
})

describe('requireAdmin', () => {
  it('does not throw for admin wallet', () => {
    expect(() => requireAdmin('0xadmin1')).not.toThrow()
  })

  it('throws UNAUTHORIZED for non-admin', () => {
    expect(() => requireAdmin('0xrandom')).toThrow('UNAUTHORIZED')
  })

  it('throws UNAUTHORIZED for null', () => {
    expect(() => requireAdmin(null)).toThrow('UNAUTHORIZED')
  })
})
