const KEY = 'samelo_search_history'
const MAX_HISTORY = 10

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addToSearchHistory(query: string): void {
  if (typeof window === 'undefined') return
  const history = getSearchHistory().filter(q => q !== query)
  history.unshift(query)
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

export function removeFromSearchHistory(query: string): void {
  if (typeof window === 'undefined') return
  const history = getSearchHistory().filter(q => q !== query)
  localStorage.setItem(KEY, JSON.stringify(history))
}

export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}
