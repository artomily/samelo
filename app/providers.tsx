'use client'

import { WagmiProvider, cookieToInitialState } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { wagmiConfig } from '@/lib/wagmi'
import { I18nProvider } from '@/lib/i18n'
import { AutoConnect } from '@/app/components/AutoConnect'

export function Providers({
  children,
  cookie,
}: {
  children: React.ReactNode
  cookie?: string | null
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30,
            retry: 1,
          },
        },
      }),
  )

  const initialState = cookieToInitialState(wagmiConfig, cookie)

  return (
    <I18nProvider>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <AutoConnect />
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </I18nProvider>
  )
}
