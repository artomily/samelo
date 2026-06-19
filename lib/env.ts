function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

function optional(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue
}

export const env = {
  // Supabase
  supabaseUrl: optional('NEXT_PUBLIC_SUPABASE_URL', ''),
  supabaseAnonKey: optional('NEXT_PUBLIC_SUPABASE_ANON_KEY', ''),

  // Server-only
  get supabaseServiceKey() { return required('SUPABASE_SERVICE_ROLE_KEY') },
  get watchHmacSecret() { return required('WATCH_HMAC_SECRET') },

  // Optional oracle config
  rewardOracleKey: process.env.REWARD_ORACLE_PRIVATE_KEY,
  minSwapPoints: Number(optional('MIN_SWAP_POINTS', '500')),

  // Contract addresses
  treasuryAddress: optional('NEXT_PUBLIC_TREASURY_ADDRESS', ''),
  pointsAddress: optional('NEXT_PUBLIC_POINTS_ADDRESS', ''),
  swapAddress: optional('NEXT_PUBLIC_SWAP_ADDRESS', ''),
}
