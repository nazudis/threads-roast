import { SEVERITY_TIERS } from './cardTokens'

export type CardMeta = { score: number; label: string; color: string; serial: string }

function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0
  return h >>> 0
}

export function getCardMeta(username: string, roast: string): CardMeta {
  const h = hashString(`${username}::${roast}`)
  const score = h % 101 // 0..100
  const tier =
    [...SEVERITY_TIERS].reverse().find((t) => score >= t.min) ?? SEVERITY_TIERS[0]
  const serial = `GSG-${(h % 0x10000).toString(36).toUpperCase().padStart(4, '0')}`
  return { score, label: tier.label, color: tier.color, serial }
}
