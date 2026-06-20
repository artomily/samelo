'use client'

import { useState } from 'react'
import { useProfileUpdate } from '@/hooks/useProfileUpdate'

interface ProfileEditFormProps {
  initial: { displayName?: string | null; bio?: string | null; twitterHandle?: string | null }
  onSuccess?: () => void
}

export function ProfileEditForm({ initial, onSuccess }: ProfileEditFormProps) {
  const [displayName, setDisplayName] = useState(initial.displayName ?? '')
  const [bio, setBio] = useState(initial.bio ?? '')
  const [twitter, setTwitter] = useState(initial.twitterHandle ?? '')
  const update = useProfileUpdate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    update.mutate({ displayName, bio, twitterHandle: twitter }, { onSuccess })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs text-white/50 mb-1 block">Display Name</label>
        <input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          maxLength={32}
          placeholder="Your name"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c8f135]/50"
        />
      </div>
      <div>
        <label className="text-xs text-white/50 mb-1 block">Bio <span className="text-white/30">{bio.length}/160</span></label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={160}
          rows={3}
          placeholder="Tell the world about yourself…"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c8f135]/50 resize-none"
        />
      </div>
      <div>
        <label className="text-xs text-white/50 mb-1 block">Twitter / X</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
          <input
            value={twitter}
            onChange={e => setTwitter(e.target.value)}
            placeholder="handle"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c8f135]/50"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={update.isPending}
        className="w-full py-2 rounded-lg bg-[#c8f135] text-black text-sm font-semibold hover:bg-[#d4f557] disabled:opacity-50"
      >
        {update.isPending ? 'Saving…' : 'Save Profile'}
      </button>
      {update.isError && <p className="text-red-400 text-xs">Failed to save. Try again.</p>}
      {update.isSuccess && <p className="text-[#35d07f] text-xs">Profile saved!</p>}
    </form>
  )
}
