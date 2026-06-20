export function buildUrl(base: string, params: Record<string, string | number | boolean | null | undefined>): string {
  const url = new URL(base, 'https://placeholder.com')
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }
  const full = url.toString()
  return full.startsWith('https://placeholder.com') ? full.slice('https://placeholder.com'.length) : full
}

export function parseQueryParams(search: string): Record<string, string> {
  const params: Record<string, string> = {}
  const searchParams = new URLSearchParams(search)
  searchParams.forEach((value, key) => { params[key] = value })
  return params
}

export function isExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function joinPath(...segments: string[]): string {
  return '/' + segments
    .map(s => s.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/')
}
