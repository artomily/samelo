'use client'

import { useActiveSessions, useRevokeAllSessions } from '@/hooks/useSessions'

interface Props {
  wallet: string
}

export function SessionList({ wallet }: Props) {
  const { data, isLoading } = useActiveSessions(wallet)
  const { mutate: revokeAll, isPending } = useRevokeAllSessions(wallet)

  if (isLoading) return <p className="text-sm text-white/40">Loading sessions…</p>

  const sessions = data?.sessions ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Active sessions</h2>
        {sessions.length > 0 && (
          <button
            onClick={() => revokeAll()}
            disabled={isPending}
            className="text-xs text-red-400 hover:text-red-300 disabled:opacity-40"
          >
            Revoke all
          </button>
        )}
      </div>
      {sessions.length === 0 ? (
        <p className="text-sm text-white/40">No active sessions.</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 space-y-1">
              <p className="text-xs text-white/60">
                {s.user_agent ? s.user_agent.slice(0, 60) + '…' : 'Unknown browser'}
              </p>
              <p className="text-xs text-white/30">
                Last seen {new Date(s.last_seen_at).toLocaleString()}
              </p>
              {s.ip_address && (
                <p className="text-xs text-white/20">{s.ip_address}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
