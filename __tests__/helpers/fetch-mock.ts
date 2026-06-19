import { vi } from 'vitest'

export function createFetchMock(response: {
  ok?: boolean
  status?: number
  json?: unknown
}) {
  const mockResponse = {
    ok: response.ok ?? true,
    status: response.status ?? 200,
    json: vi.fn().mockResolvedValue(response.json ?? {}),
    text: vi.fn().mockResolvedValue(''),
    headers: new Headers(),
    clone: vi.fn().mockReturnThis(),
  }

  const fetchMock = vi.fn().mockResolvedValue(mockResponse)
  return { fetchMock, mockResponse }
}

export function mockGlobalFetch(response: Parameters<typeof createFetchMock>[0]) {
  const { fetchMock } = createFetchMock(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}