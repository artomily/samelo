import '@testing-library/jest-dom/vitest'

// Supabase client initializes at import time — these stubs prevent it crashing.
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.WATCH_HMAC_SECRET = 'test-hmac-secret-32-bytes-padding!'
process.env.ORACLE_SIGNER_ADDRESS = '0x1234567890123456789012345678901234567890'
process.env.NEXT_PUBLIC_TREASURY_ADDRESS = '0x1234567890123456789012345678901234567890'
process.env.NEXT_PUBLIC_POINTS_ADDRESS = '0x1234567890123456789012345678901234567890'
process.env.NEXT_PUBLIC_SWAP_ADDRESS = '0x1234567890123456789012345678901234567890'

afterEach(() => {
  vi.restoreAllMocks()
})