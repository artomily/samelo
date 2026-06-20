const ADMIN_ADDRESSES = (process.env.ADMIN_WALLET_ADDRESSES ?? '')
  .split(',')
  .map(a => a.trim().toLowerCase())
  .filter(Boolean)

export function isAdminWallet(address: string): boolean {
  return ADMIN_ADDRESSES.includes(address.toLowerCase())
}

export function requireAdmin(address: string | null | undefined): void {
  if (!address || !isAdminWallet(address)) {
    throw new Error('UNAUTHORIZED')
  }
}
