'use client'
import { useQuery } from '@tanstack/react-query'

export function GasDisplay() {
  const { data, isLoading } = useQuery({
    queryKey: ['celo-gas'],
    queryFn: async () => {
      const res = await fetch('/api/celo/gas-price')
      if (!res.ok) throw new Error('Gas fetch failed')
      return res.json() as Promise<{ gasPriceGwei: string }>
    },
    staleTime: 15_000,
    refetchInterval: 15_000,
  })

  if (isLoading) {
    return <span className="inline-block w-12 h-3 bg-white/10 rounded animate-pulse" />
  }

  return (
    <span className="text-xs font-mono text-white/40">
      {data?.gasPriceGwei ?? '—'} Gwei
    </span>
  )
}
