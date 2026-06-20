const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://samelo.app'

export function referralDeepLink(code: string): string {
  return `${BASE_URL}/?ref=${encodeURIComponent(code)}`
}

export function videoDeepLink(videoId: string): string {
  return `${BASE_URL}/watch?v=${encodeURIComponent(videoId)}`
}

export function profileDeepLink(wallet: string): string {
  return `${BASE_URL}/profile/${encodeURIComponent(wallet)}`
}

export function parseRefCode(url: string): string | null {
  try {
    const u = new URL(url)
    return u.searchParams.get('ref')
  } catch {
    return null
  }
}
