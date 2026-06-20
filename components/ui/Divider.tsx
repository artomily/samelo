interface Props {
  label?: string
  className?: string
}

export function Divider({ label, className = '' }: Props) {
  if (label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs uppercase tracking-wide">{label}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
    )
  }
  return <hr className={`border-white/10 ${className}`} />
}
