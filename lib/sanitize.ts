export const USERNAME_MAX = 30
export const VIBE_MAX = 280

/** Strip non-printable / control characters (keeps whitespace for later collapsing). */
const stripControl = (s: string) => s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

export function sanitizeUsername(raw: unknown): string {
  return stripControl(String(raw ?? ''))
    .trim()
    .replace(/^@+/, '')
    .replace(/\s+/g, '')
    .slice(0, USERNAME_MAX)
}

export function sanitizeVibe(raw: unknown): string {
  return stripControl(String(raw ?? ''))
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, VIBE_MAX)
}
