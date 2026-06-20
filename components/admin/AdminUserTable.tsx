'use client'

import { useState } from 'react'
import { useAdminUsers, useBanUser, useAdjustPoints } from '@/hooks/useAdminUsers'
import { truncateAddress } from '@/lib/address'

export function AdminUserTable() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useAdminUsers(search)
  const banUser = useBanUser()
  const adjustPoints = useAdjustPoints()

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search by wallet or name…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c8f135]/50"
      />
      {isLoading && <p className="text-white/40 text-sm">Loading…</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/40 text-xs border-b border-white/10">
              <th className="text-left py-2 pr-4">Wallet</th>
              <th className="text-left py-2 pr-4">Name</th>
              <th className="text-right py-2 pr-4">Points</th>
              <th className="text-right py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data?.users ?? []).map(user => (
              <tr key={user.walletAddress} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 pr-4 font-mono text-white/70">{truncateAddress(user.walletAddress)}</td>
                <td className="py-2 pr-4 text-white">{user.displayName ?? '—'}</td>
                <td className="py-2 pr-4 text-right text-[#c8f135] font-mono">{user.totalPoints.toLocaleString()}</td>
                <td className="py-2 text-right space-x-2">
                  <button
                    onClick={() => adjustPoints.mutate({ wallet: user.walletAddress, delta: 100, reason: 'admin grant' })}
                    className="text-xs text-[#c8f135] hover:underline"
                  >+100</button>
                  <button
                    onClick={() => banUser.mutate({ wallet: user.walletAddress, banned: !user.isBanned })}
                    className="text-xs text-red-400 hover:underline"
                  >{user.isBanned ? 'Unban' : 'Ban'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
