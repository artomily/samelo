import { celo, celoAlfajores } from 'wagmi/chains'
import type { Chain } from 'viem'

export const CELO_CHAIN_ID = 42220
export const CELO_TESTNET_CHAIN_ID = 44787

/** Celo Sepolia — newer testnet used by samelo-contracts deploy workflow */
export const celoSepolia: Chain = {
  id: 11142220,
  name: 'Celo Sepolia',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://celo-sepolia.drpc.org'] },
    public: { http: ['https://celo-sepolia.drpc.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://celo-sepolia.blockscout.com',
    },
  },
  testnet: true,
}

export { celo, celoAlfajores }
