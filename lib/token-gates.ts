import { createClient } from '@supabase/supabase-js'
import type { TokenGate, GateResourceType } from './types/token-gate'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getGatesForResource(
  resourceType: GateResourceType,
  resourceId: string
): Promise<TokenGate[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('token_gates')
    .select('*')
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAllGates(): Promise<TokenGate[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('token_gates')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createGate(
  gate: Omit<TokenGate, 'id' | 'created_at'>
): Promise<TokenGate> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('token_gates')
    .insert(gate)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteGate(id: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('token_gates').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function recordGateCheck(
  wallet: string,
  gateId: string,
  passed: boolean
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('token_gate_checks')
    .insert({ wallet, gate_id: gateId, passed })
  if (error) throw new Error(error.message)
}
