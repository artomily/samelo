interface Props {
  value: number
  max?: number
  color?: string
  height?: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, max = 100, color = '#c8f135', height = 4, showLabel = false, className = '' }: Props) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-white/40">
          <span>{value.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      )}
      <div className="bg-white/10 rounded-full overflow-hidden" style={{ height }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
