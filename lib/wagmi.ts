import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { celo } from './chains'

export const wagmiConfig = createConfig({
  chains: [celo],
  connectors: [injected()],
  transports: {
    [celo.id]: http(
      process.env.NEXT_PUBLIC_CELO_RPC ?? 'https://forno.celo.org',
    ),
  },
  ssr: true,
})
