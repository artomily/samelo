import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const PADDING = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' }

export function Card({ children, className = '', hover = false, padding = 'md' }: Props) {
  return (
    <div className={`
      rounded-xl border border-white/10 bg-white/5
      ${hover ? 'hover:border-[#c8f135]/40 transition-colors cursor-pointer' : ''}
      ${PADDING[padding]}
      ${className}
    `}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-white font-semibold ${className}`}>{children}</h3>
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
