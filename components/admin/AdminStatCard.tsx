'use client'

interface AdminStatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

export function AdminStatCard({ label, value, sub, accent }: AdminStatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? 'border-[#c8f135]/40 bg-[#c8f135]/5' : 'border-white/10 bg-white/5'}`}>
      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${accent ? 'text-[#c8f135]' : 'text-white'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
    </div>
  )
}
