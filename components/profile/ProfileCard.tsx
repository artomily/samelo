'use client'

import { getAvatarInitials } from '@/lib/types/profile-v2'
import type { ProfileV2 } from '@/lib/types/profile-v2'
import { FollowButton } from './FollowButton'
import { shortenAddress } from '@/lib/celo/wallet'

interface Props {
  profile: ProfileV2
  showFollowButton?: boolean
}

export function ProfileCard({ profile, showFollowButton = true }: Props) {
  const initials = getAvatarInitials(profile.display_name, profile.wallet)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
      <div className="flex items-start gap-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? 'avatar'}
            className="w-12 h-12 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border border-white/10"
            style={{ background: '#c8f13520', color: '#c8f135' }}
          >
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate">
              {profile.display_name ?? shortenAddress(profile.wallet)}
            </p>
            {profile.is_verified && (
              <span style={{ color: '#c8f135' }} title="Verified">✓</span>
            )}
          </div>
          <p className="text-xs text-white/40 font-mono">{shortenAddress(profile.wallet)}</p>
        </div>

        {showFollowButton && <FollowButton targetWallet={profile.wallet} />}
      </div>

      {profile.bio && <p className="text-sm text-white/70">{profile.bio}</p>}

      <div className="flex gap-4 text-xs text-white/50">
        <span><strong className="text-white">{profile.follower_count}</strong> followers</span>
        <span><strong className="text-white">{profile.following_count}</strong> following</span>
        <span><strong style={{ color: '#c8f135' }}>{profile.total_points.toLocaleString()}</strong> pts</span>
      </div>
    </div>
  )
}
