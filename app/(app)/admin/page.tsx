'use client'

import { useAccount } from 'wagmi'
import { isAdminWallet } from '@/lib/admin-auth'
import { AdminStatsGrid } from '@/components/admin/AdminStatsGrid'
import { AdminUserTable } from '@/components/admin/AdminUserTable'
import { AdminVideoTable } from '@/components/admin/AdminVideoTable'

export default function AdminPage() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/40">Connect wallet to access admin panel.</p>
      </div>
    )
  }

  if (!address || !isAdminWallet(address)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Access denied. Admin wallets only.</p>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Orbitron']">Admin Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Protocol management · {address}</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Protocol Stats</h2>
        <AdminStatsGrid />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">User Management</h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <AdminUserTable />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Video Management</h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <AdminVideoTable />
        </div>
      </section>
    </main>
  )
}
