interface Props {
  className?: string
  width?: string
  height?: string
  rounded?: boolean
}

export function Skeleton({ className = '', width, height, rounded = false }: Props) {
  return (
    <div
      className={`bg-white/10 animate-pulse ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{ width, height }}
    />
  )
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4" style={{ width: i === lines - 1 ? '60%' : '100%' } as React.CSSProperties} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 rounded-xl border border-white/10 bg-white/5 space-y-3 ${className}`}>
      <Skeleton className="h-5 w-3/4" />
      <SkeletonText lines={2} />
    </div>
  )
}
