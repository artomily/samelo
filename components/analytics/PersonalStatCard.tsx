'use client'

interface PersonalStatCardProps {
  label: string
  value: string | number
  icon: string
  sub?: string
  highlight?: boolean
}

export function PersonalStatCard({ label, value, icon, sub, highlight }: PersonalStatCardProps) {
  return (
    <div className={`rounded-xl border p-4 space-y-2 ${highlight ? 'border-[#c8f135]/30 bg-[#c8f135]/5' : 'border-white/10 bg-white/5'}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs text-white/50 uppercase tracking-wide">{label}</p>
      </div>
      <p className={`text-2xl font-bold font-mono ${highlight ? 'text-[#c8f135]' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-white/40">{sub}</p>}
    </div>
  )
}
