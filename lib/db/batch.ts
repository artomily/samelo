import type { SupabaseClient } from '@supabase/supabase-js'

export async function batchInsert<T extends object>(
  supabase: SupabaseClient,
  table: string,
  rows: T[],
  batchSize = 100,
): Promise<{ inserted: number; errors: number }> {
  let inserted = 0
  let errors = 0

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error, count } = await supabase.from(table).insert(batch).select('*', { count: 'exact', head: true })
    if (error) errors++
    else inserted += count ?? batch.length
  }

  return { inserted, errors }
}

export async function batchUpdate<T extends object>(
  supabase: SupabaseClient,
  table: string,
  rows: Array<T & { id: string }>,
  batchSize = 50,
): Promise<{ updated: number; errors: number }> {
  let updated = 0
  let errors = 0

  for (const row of rows) {
    const { id, ...data } = row
    const { error } = await supabase.from(table).update(data).eq('id', id)
    if (error) errors++
    else updated++
  }

  return { updated, errors }
}

export async function parallelQueries<T>(
  queries: Array<() => Promise<T>>,
  concurrency = 5,
): Promise<Array<T | Error>> {
  const results: Array<T | Error> = []
  for (let i = 0; i < queries.length; i += concurrency) {
    const batch = queries.slice(i, i + concurrency)
    const settled = await Promise.allSettled(batch.map(q => q()))
    for (const result of settled) {
      results.push(result.status === 'fulfilled' ? result.value : result.reason)
    }
  }
  return results
}
