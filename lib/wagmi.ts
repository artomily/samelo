import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { celo, celoAlfajores, celoSepolia } from './chains'

const isTestnet = process.env.NEXT_PUBLIC_CHAIN_ENV === 'testnet'

/** Active chain — driven by NEXT_PUBLIC_CHAIN_ENV (default: mainnet) */
export const activeChain = isTestnet ? celoSepolia : celo

const defaultRpc = isTestnet
  ? 'https://celo-sepolia.drpc.org'
  : 'https://forno.celo.org'

export const wagmiConfig = createConfig({
  chains: [activeChain],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [activeChain.id]: http(process.env.NEXT_PUBLIC_CELO_RPC ?? defaultRpc),
  },
  ssr: true,
  storage: createStorage({
    key: 'samelo.wagmi',
    storage: cookieStorage,
  }),
})

export { celoAlfajores }
