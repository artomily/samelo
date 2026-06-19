export function sanitizeString(input: unknown, maxLength = 255): string | null {
  if (typeof input !== 'string') return null
  return input.trim().slice(0, maxLength)
}

export function sanitizePositiveInt(input: unknown): number | null {
  const n = Number(input)
  if (!Number.isInteger(n) || n <= 0) return null
  return n
}

export function sanitizeWalletAddress(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const cleaned = input.trim()
  if (!/^0x[0-9a-fA-F]{40}$/.test(cleaned)) return null
  return cleaned.toLowerCase()
}
