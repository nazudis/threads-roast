import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { CARD } from '@/lib/cardTokens'
import { parseCardInput } from '@/lib/og/parseCardInput'
import { CardImage } from '@/lib/og/CardImage'

export const runtime = 'nodejs'

// Load font binaries once per cold start.
// Using fs.readFile instead of fetch(file://) because Next.js's fetch override
// does not support the file:// protocol in dev or production (nodejs runtime).
const assetsDir = join(process.cwd(), 'app/api/card/assets')
const antonData = readFile(join(assetsDir, 'Anton-Regular.ttf')).then((b) => b.buffer as ArrayBuffer)
const monoData = readFile(join(assetsDir, 'JetBrainsMono-Regular.ttf')).then((b) => b.buffer as ArrayBuffer)
const monoBoldData = readFile(join(assetsDir, 'JetBrainsMono-Bold.ttf')).then((b) => b.buffer as ArrayBuffer)

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response('bad request', { status: 400 })
  }

  const parsed = parseCardInput(body)
  if (!parsed.ok) return new Response(parsed.error, { status: 400 })

  const [anton, mono, monoBold] = await Promise.all([antonData, monoData, monoBoldData])

  return new ImageResponse(<CardImage input={parsed.value} />, {
    width: CARD.width,
    height: CARD.height,
    fonts: [
      { name: 'Anton', data: anton, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: monoBold, weight: 700, style: 'normal' },
    ],
  })
}
