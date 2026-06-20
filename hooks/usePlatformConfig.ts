import { useQuery } from '@tanstack/react-query'
import type { PlatformSettings } from '@/lib/types/platform-config'
import { DEFAULT_SETTINGS } from '@/lib/types/platform-config'

export function usePlatformConfig() {
  return useQuery<Partial<PlatformSettings>>({
    queryKey: ['platform-config'],
    queryFn: async () => {
      const res = await fetch('/api/config')
      if (!res.ok) return DEFAULT_SETTINGS
      const { config } = await res.json()
      return config
    },
    staleTime: 300_000,
    initialData: DEFAULT_SETTINGS,
  })
}

export function useFeatureFlag(feature: keyof PlatformSettings['feature_flags'] | 'tips' | 'live_events' | 'governance' | 'collections') {
  const { data } = usePlatformConfig()
  const flags = data?.feature_flags ?? DEFAULT_SETTINGS.feature_flags
  return flags[feature as keyof typeof flags] ?? false
}
