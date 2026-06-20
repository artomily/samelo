interface Props {
  label: string
  value: string | number
  icon?: string
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({ label, value, icon, trend, className = '' }: Props) {
  const trendPositive = trend && trend.value >= 0

  return (
    <div className={`p-4 rounded-xl border border-white/10 bg-white/5 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wide">{label}</p>
          <p className="text-[#c8f135] text-2xl font-bold font-display mt-1">{value}</p>
        </div>
        {icon && <span className="text-2xl opacity-60">{icon}</span>}
      </div>
      {trend && (
        <p className={`text-xs mt-2 ${trendPositive ? 'text-green-400' : 'text-red-400'}`}>
          {trendPositive ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  )
}
