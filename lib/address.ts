/** Normalize an Ethereum address to checksummed lowercase */
export function normalizeAddress(address: string): string {
  return address.toLowerCase()
}

/** Validate that a string looks like a valid Ethereum address */
export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

/** Truncate address to 0x1234…abcd format */
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

/** Compare two addresses case-insensitively */
export function sameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}
