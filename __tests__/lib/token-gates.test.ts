import { describe, it, expect } from 'vitest'
import { formatMinBalance, TOKEN_TYPE_LABELS } from '@/lib/types/token-gate'
import type { TokenGate } from '@/lib/types/token-gate'

function makeGate(overrides: Partial<TokenGate> = {}): TokenGate {
  return {
    id: 'gate-1',
    name: 'MELO Holder',
    description: null,
    token_address: '0xAbc123',
    chain_id: 42220,
    min_balance: 100,
    token_type: 'erc20',
    resource_type: 'video',
    resource_id: 'vid-1',
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('TOKEN_TYPE_LABELS', () => {
  it('has labels for all token types', () => {
    expect(TOKEN_TYPE_LABELS.erc20).toBeTruthy()
    expect(TOKEN_TYPE_LABELS.erc721).toBeTruthy()
    expect(TOKEN_TYPE_LABELS.erc1155).toBeTruthy()
  })
})

describe('formatMinBalance', () => {
  it('formats erc20 with token count', () => {
    const result = formatMinBalance(makeGate({ token_type: 'erc20', min_balance: 100 }))
    expect(result).toContain('100')
  })

  it('formats erc721 with hold count', () => {
    const result = formatMinBalance(makeGate({ token_type: 'erc721', min_balance: 1 }))
    expect(result).toContain('1')
    expect(result.toLowerCase()).toContain('hold')
  })

  it('formats erc1155 with hold count', () => {
    const result = formatMinBalance(makeGate({ token_type: 'erc1155', min_balance: 5 }))
    expect(result).toContain('5')
  })
})
