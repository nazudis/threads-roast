import { sanitizeUsername } from '@/lib/sanitize'

export type CardInput = {
  username: string
  roast: string
  photoDataUrl: string | null
  label: string
  color: string
  serial: string
}

export function parseCardInput(
  body: unknown,
): { ok: true; value: CardInput } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>
  const username = sanitizeUsername(b.username)
  const roast = typeof b.roast === 'string' ? b.roast.trim().slice(0, 600) : ''
  if (!username || !roast) return { ok: false, error: 'username dan roast wajib ada' }

  const photo = typeof b.photoDataUrl === 'string' ? b.photoDataUrl : ''
  const photoDataUrl = photo.startsWith('data:image/') ? photo : null // only inline data URLs

  return {
    ok: true,
    value: {
      username,
      roast,
      photoDataUrl,
      label: typeof b.label === 'string' ? b.label.slice(0, 24) : 'WELL DONE',
      color: typeof b.color === 'string' ? b.color.slice(0, 9) : '#FF3B1F',
      serial: typeof b.serial === 'string' ? b.serial.slice(0, 16) : 'GSG-0000',
    },
  }
}
