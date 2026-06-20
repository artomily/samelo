import { ReactNode } from 'react'

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'lime'

interface Props {
  children: ReactNode
  variant?: Variant
  size?: 'sm' | 'md'
  className?: string
}

const VARIANT_STYLES: Record<Variant, string> = {
  default: 'bg-white/10 text-white/60',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  error: 'bg-red-500/20 text-red-400',
  info: 'bg-blue-500/20 text-blue-400',
  lime: 'bg-[#c8f135]/20 text-[#c8f135]',
}

const SIZE_STYLES = { sm: 'text-[10px] px-1.5 py-0.5', md: 'text-xs px-2 py-1' }

export function Badge({ children, variant = 'default', size = 'md', className = '' }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wide ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}>
      {children}
    </span>
  )
}
