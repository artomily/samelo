import { vi } from 'vitest'
import { NextRequest } from 'next/server'

export function createNextRequest(
  url: string,
  options?: { method?: string; body?: unknown; headers?: Record<string, string> },
): NextRequest {
  const { searchParams, pathname } = new URL(url, 'http://localhost:3000')

  const init: RequestInit = {
    method: options?.method ?? 'GET',
    headers: options?.headers ?? {},
  }

  if (options?.body) {
    init.body = JSON.stringify(options.body)
    init.headers = {
      ...init.headers,
      'Content-Type': 'application/json',
    }
  }

  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}