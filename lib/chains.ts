import { celo, celoAlfajores } from 'wagmi/chains'
import type { Chain } from 'viem'

export const CELO_CHAIN_ID = 42220
export const CELO_TESTNET_CHAIN_ID = 44787

/** Celo Sepolia — newer testnet (chain ID 11142220) */
export const celoSepolia = {
  id: 11142220,
  name: 'Celo Sepolia Testnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://celo-sepolia.drpc.org', 'https://celo-sepolia.gateway.tenderly.co'] },
    public: { http: ['https://celo-sepolia.drpc.org', 'https://celo-sepolia.gateway.tenderly.co'] },
  },
  blockExplorers: {
    default: {
      name: 'CeloScan',
      url: 'https://sepolia.celoscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 12345678,
    },
  },
  testnet: true,
} satisfies Chain

export { celo, celoAlfajores }

