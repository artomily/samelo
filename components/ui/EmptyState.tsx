import { ReactNode } from 'react'

interface Props {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon = '○', title, description, action, className = '' }: Props) {
  return (
    <div className={`text-center py-16 space-y-4 ${className}`}>
      <p className="text-4xl opacity-30">{icon}</p>
      <div className="space-y-1">
        <p className="text-white/60 font-medium">{title}</p>
        {description && <p className="text-white/30 text-sm">{description}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
