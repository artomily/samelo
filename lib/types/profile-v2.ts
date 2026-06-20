export interface ProfileV2 {
  wallet: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  twitter: string | null
  website: string | null
  country: string | null
  follower_count: number
  following_count: number
  total_points: number
  is_verified: boolean
  created_at: string
}

export interface Follow {
  follower_wallet: string
  following_wallet: string
  created_at: string
}

export function formatSocialHandle(handle: string): string {
  return handle.startsWith('@') ? handle : `@${handle}`
}

export function sanitizeUrl(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    if (!['http:', 'https:'].includes(u.protocol)) return ''
    return u.href
  } catch {
    return ''
  }
}

export function getAvatarInitials(name: string | null, wallet: string): string {
  if (name) return name.slice(0, 2).toUpperCase()
  return wallet.slice(2, 4).toUpperCase()
}
