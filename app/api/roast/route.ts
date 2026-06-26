import { NextResponse } from 'next/server'
import { sanitizeUsername, sanitizeVibe } from '@/lib/sanitize'
import { rateLimit } from '@/lib/rateLimit'
import { createClient, getRoast } from '@/lib/openai'

export const runtime = 'nodejs' // in-memory rate limit + sized bodies

function clientIp(req: Request): string {
  // v1 limitation: the first XFF entry is client-supplied and spoofable, so the
  // per-IP limit is best-effort (matches the in-memory store's best-effort nature).
  // Behind a trusted single proxy (e.g. Vercel), prefer the infra-set x-real-ip.
  const xff = req.headers.get('x-forwarded-for')
  return req.headers.get('x-real-ip') || xff?.split(',')[0]?.trim() || 'unknown'
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Format request gak valid.' }, { status: 400 })
  }

  const b = (body ?? {}) as Record<string, unknown>
  const username = sanitizeUsername(b.username)
  const vibe = sanitizeVibe(b.vibe)
  const reroll = Boolean(b.reroll)

  if (!username) {
    return NextResponse.json({ error: 'Username dulu dong.' }, { status: 400 })
  }

  const limit = Number(process.env.ROAST_RATE_LIMIT) || 15
  const windowMs = Number(process.env.ROAST_RATE_WINDOW_MS) || 60_000
  const rl = rateLimit(`roast:${clientIp(req)}`, { limit, windowMs })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Sabar, lo kebanyakan minta roast. Coba lagi bentar 🔥' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    )
  }

  try {
    const roast = await getRoast({ username, vibe, reroll }, { client: createClient() })
    return NextResponse.json({ roast })
  } catch (err) {
    console.error('[roast] provider error:', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: 'Lagi rame nih, gagal nge-roast. Coba lagi ya 🙏' },
      { status: 502 },
    )
  }
}
