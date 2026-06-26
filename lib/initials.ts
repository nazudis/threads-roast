export function initials(username: string): string {
  const clean = String(username ?? '')
    .replace(/^@+/, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
  if (!clean) return '??'
  const parts = clean.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
