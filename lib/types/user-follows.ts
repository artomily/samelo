export interface UserFollow {
  id: string
  follower_wallet: string
  following_wallet: string
  created_at: string
}

export interface UserProfile {
  wallet: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  twitter_handle: string | null
  is_creator: boolean
  created_at: string
  updated_at: string
}

export interface UserProfileWithCounts extends UserProfile {
  follower_count: number
  following_count: number
}

export function displayName(profile: UserProfile): string {
  return profile.display_name ?? shortenWallet(profile.wallet)
}

export function shortenWallet(wallet: string): string {
  return `${wallet.slice(0, 6)}…${wallet.slice(-4)}`
}

export function twitterUrl(handle: string): string {
  return `https://twitter.com/${handle.replace(/^@/, '')}`
}
