'use client'
import { useQuery } from '@tanstack/react-query'

export function BlockNumber() {
  const { data, isLoading } = useQuery({
    queryKey: ['celo-block'],
    queryFn: async () => {
      const res = await fetch('/api/celo/block')
      if (!res.ok) throw new Error('Block fetch failed')
      return res.json() as Promise<{ blockNumber: string }>
    },
    staleTime: 5_000,
    refetchInterval: 5_000,
  })

  if (isLoading) {
    return <span className="inline-block w-20 h-3 bg-white/10 rounded animate-pulse" />
  }

  const formatted = data?.blockNumber
    ? Number(data.blockNumber).toLocaleString()
    : '—'

  return (
    <span className="text-xs font-mono text-white/40">
      Block #{formatted}
    </span>
  )
}
