export type TokenType = 'erc20' | 'erc721' | 'erc1155'
export type GateResourceType = 'video' | 'playlist' | 'feature'

export interface TokenGate {
  id: string
  name: string
  description: string | null
  token_address: string
  chain_id: number
  min_balance: number
  token_type: TokenType
  resource_type: GateResourceType
  resource_id: string
  created_at: string
}

export interface TokenGateCheck {
  id: string
  wallet: string
  gate_id: string
  passed: boolean
  checked_at: string
}

export interface GateCheckResult {
  gate: TokenGate
  passed: boolean
  balance: string
}

export const TOKEN_TYPE_LABELS: Record<TokenType, string> = {
  erc20: 'ERC-20 Token',
  erc721: 'NFT (ERC-721)',
  erc1155: 'Multi-token (ERC-1155)',
}

export function formatMinBalance(gate: TokenGate): string {
  if (gate.token_type === 'erc721' || gate.token_type === 'erc1155') {
    return `Hold at least ${gate.min_balance}`
  }
  return `Min ${gate.min_balance.toLocaleString()} tokens`
}
