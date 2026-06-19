import { useQuery } from '@tanstack/react-query'
import type { FlowTimeline } from '@/lib/types/onchain'

async function fetchFlow(days: number): Promise<FlowTimeline> {
  const res = await fetch(`/api/onchain/flow?days=${days}`)
  if (!res.ok) throw new Error('Failed to fetch flow timeline')
  return res.json()
}

export function useFlowTimeline(days: 7 | 14 | 30 = 7) {
  return useQuery({
    queryKey: ['flow-timeline', days],
    queryFn: () => fetchFlow(days),
    staleTime: 60_000,
  })
}
