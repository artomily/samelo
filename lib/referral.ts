export function buildReferralLink(code: string, baseUrl?: string): string {
  const base = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}?ref=${encodeURIComponent(code)}`
}

export function buildVideoReferralLink(code: string, videoId: string, baseUrl?: string): string {
  const base = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}?ref=${encodeURIComponent(code)}&v=${encodeURIComponent(videoId)}`
}

export function parseReferralFromUrl(searchParams: URLSearchParams): {
  code: string | null
  videoId: string | null
} {
  return {
    code: searchParams.get('ref'),
    videoId: searchParams.get('v'),
  }
}
