'use client'

import { displayName, twitterUrl } from '@/lib/types/user-follows'
import type { UserProfileWithCounts } from '@/lib/types/user-follows'

interface Props {
  profile: UserProfileWithCounts
}

export function UserProfileSummary({ profile }: Props) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={displayName(profile)} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xl">
            {(profile.display_name?.[0] ?? profile.wallet[2]).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-white font-[Orbitron] text-sm">{displayName(profile)}</p>
          <p className="text-xs text-[#555] font-mono">{profile.wallet.slice(0, 8)}…</p>
        </div>
        {profile.is_creator && (
          <span className="ml-auto text-[10px] font-bold text-[#030303] bg-[#c8f135] px-1.5 py-0.5 rounded uppercase">Creator</span>
        )}
      </div>
      {profile.bio && <p className="text-xs text-[#888]">{profile.bio}</p>}
      <div className="flex gap-4 text-xs text-[#666]">
        <span><strong className="text-white">{profile.follower_count}</strong> followers</span>
        <span><strong className="text-white">{profile.following_count}</strong> following</span>
      </div>
      {profile.twitter_handle && (
        <a href={twitterUrl(profile.twitter_handle)} target="_blank" rel="noopener noreferrer"
          className="text-xs text-[#1da1f2] hover:underline">
          @{profile.twitter_handle.replace(/^@/, '')}
        </a>
      )}
    </div>
  )
}
