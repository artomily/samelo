import { describe, it, expect } from 'vitest'
import { celoscanTx, celoscanAddress, celoscanToken, celoscanTokenHolder } from '@/lib/celoscan'

describe('celoscanTx', () => {
  it('builds correct tx URL', () => {
    expect(celoscanTx('0xabc123')).toBe('https://celoscan.io/tx/0xabc123')
  })
})

describe('celoscanAddress', () => {
  it('builds correct address URL', () => {
    expect(celoscanAddress('0xDEAD')).toBe('https://celoscan.io/address/0xDEAD')
  })
})

describe('celoscanToken', () => {
  it('builds correct token URL', () => {
    expect(celoscanToken('0xMELO')).toBe('https://celoscan.io/token/0xMELO')
  })
})

describe('celoscanTokenHolder', () => {
  it('builds correct token holder URL with query param', () => {
    expect(celoscanTokenHolder('0xMELO', '0xUSER'))
      .toBe('https://celoscan.io/token/0xMELO?a=0xUSER')
  })
})
