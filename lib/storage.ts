/** Safe localStorage wrapper — returns null if unavailable (SSR/private mode) */
export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key: string): void {
    try { localStorage.removeItem(key) } catch { /* noop */ }
  },

  clear(): void {
    try { localStorage.clear() } catch { /* noop */ }
  },
}

export const STORAGE_KEYS = {
  REF_CODE: 'samelo_ref_code',
  WATCH_QUEUE: 'samelo_watch_queue',
  PREFERRED_LANG: 'samelo_lang',
  LAST_WALLET: 'samelo_last_wallet',
  DISMISSED_BANNERS: 'samelo_dismissed_banners',
} as const
