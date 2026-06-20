const ADMIN_IP_ALLOWLIST = (process.env.ADMIN_IP_ALLOWLIST ?? '')
  .split(',')
  .map(ip => ip.trim())
  .filter(Boolean)

export function isAllowedAdminIp(ip: string | null): boolean {
  if (ADMIN_IP_ALLOWLIST.length === 0) return true
  if (!ip) return false
  return ADMIN_IP_ALLOWLIST.includes(ip)
}

export function extractIp(headers: Headers): string | null {
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    null
  )
}
