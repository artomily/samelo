/** Retry an async function up to maxAttempts times with exponential backoff */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 200,
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < maxAttempts - 1) {
        await new Promise(r => setTimeout(r, baseDelayMs * 2 ** attempt))
      }
    }
  }
  throw lastError
}

/** Retry only if the error matches a predicate */
export async function withRetryIf<T>(
  fn: () => Promise<T>,
  shouldRetry: (err: unknown) => boolean,
  maxAttempts = 3,
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (!shouldRetry(err) || attempt >= maxAttempts - 1) throw err
    }
  }
  throw lastError
}
