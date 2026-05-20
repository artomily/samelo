'use client'

import { cn } from '@/lib/utils'

/**
 * Skeleton - A loading placeholder component with pulse animation
 * Used for content that's still loading
 */
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-card',
        className,
      )}
    />
  )
}
