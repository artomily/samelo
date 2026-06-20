const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
]

export function sanitizeText(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;')
}

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

export function isDangerousInput(input: string): boolean {
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(input))
}

export function validateWalletAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

export function validateUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length <= 100
}

export function clampString(input: string, maxLength: number): string {
  return input.slice(0, maxLength).trim()
}
