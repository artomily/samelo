import { vi } from 'vitest'

type SupabaseQueryBuilder = ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<ReturnType<any, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>, any>

export function createSupabaseMock(returnData: Record<string, unknown> = {}) {
  const mockChain: Record<string, ReturnType<typeof vi.fn>> = {}

  const chain = new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, {
    get(_, method: string) {
      if (!mockChain[method]) {
        mockChain[method] = vi.fn().mockReturnValue(chain)
      }
      return mockChain[method]
    },
  })

  const defaultData = returnData.data ?? null
  const defaultError = returnData.error ?? null
  const defaultCount = returnData.count ?? null

  mockChain.select = vi.fn().mockReturnValue(chain)
  mockChain.from = vi.fn().mockReturnValue(chain)
  mockChain.eq = vi.fn().mockReturnValue(chain)
  mockChain.neq = vi.fn().mockReturnValue(chain)
  mockChain.gt = vi.fn().mockReturnValue(chain)
  mockChain.gte = vi.fn().mockReturnValue(chain)
  mockChain.lt = vi.fn().mockReturnValue(chain)
  mockChain.lte = vi.fn().mockReturnValue(chain)
  mockChain.in = vi.fn().mockReturnValue(chain)
  mockChain.like = vi.fn().mockReturnValue(chain)
  mockChain.ilike = vi.fn().mockReturnValue(chain)
  mockChain.order = vi.fn().mockReturnValue(chain)
  mockChain.range = vi.fn().mockReturnValue(chain)
  mockChain.limit = vi.fn().mockReturnValue(chain)
  mockChain.single = vi.fn().mockResolvedValue({ data: defaultData, error: defaultError })
  mockChain.maybeSingle = vi.fn().mockResolvedValue({ data: defaultData, error: defaultError })
  mockChain.insert = vi.fn().mockReturnValue(chain)
  mockChain.update = vi.fn().mockReturnValue(chain)
  mockChain.delete = vi.fn().mockReturnValue(chain)
  mockChain.upsert = vi.fn().mockReturnValue(chain)
  mockChain.not = vi.fn().mockReturnValue(chain)

  // Resolve the chain — returns data/error when awaited.
  // Must call onFulfilled(value) to satisfy the Promise thenable protocol;
  // mockResolvedValue only returns a Promise, it never calls the callback.
  const resolveData = returnData.resolveData ?? defaultData
  const resolvedValue = {
    data: resolveData,
    error: returnData.resolveError ?? defaultError,
    count: returnData.resolveCount ?? defaultCount,
  }
  const then = vi.fn().mockImplementation((onFulfilled: ((v: unknown) => unknown) | undefined) => {
    if (onFulfilled) return Promise.resolve(onFulfilled(resolvedValue))
    return Promise.resolve(resolvedValue)
  })

  // Make the chain thenable (awaitable)
  const chainable = Object.create(chain)
  chainable.then = then
  chainable.catch = vi.fn().mockResolvedValue(undefined)
  chainable.finally = vi.fn().mockResolvedValue(undefined)

  return {
    from: vi.fn().mockReturnValue(chainable),
    rpc: vi.fn().mockReturnValue(chainable),
    chain,
    mockChain,
  }
}

export function mockSupabase(data: Record<string, unknown> = {}) {
  const mock = createSupabaseMock(data)
  vi.mocked(getServiceSupabase).mockReturnValue(mock as any)
  return mock
}

export { createSupabaseMock as createMock }