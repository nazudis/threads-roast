import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { CARD } from '@/lib/cardTokens'
import { parseCardInput } from '@/lib/og/parseCardInput'
import { CardImage } from '@/lib/og/CardImage'

export const runtime = 'nodejs'

// Load font binaries once per cold start.
// Use fs.readFile with an import.meta.url-relative file URL (not fetch(file://),
// which Next's fetch override rejects; and not a process.cwd() string path, which
// Next's file tracing can't statically detect — that would drop the .ttf files
// from the serverless bundle and ENOENT in production). This form gets traced AND
// works in Node's fs. fs.readFile accepts a file: URL object natively.
const toArrayBuffer = (b: Buffer) =>
  b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer
const antonData = readFile(new URL('./assets/Anton-Regular.ttf', import.meta.url)).then(toArrayBuffer)
const monoData = readFile(new URL('./assets/JetBrainsMono-Regular.ttf', import.meta.url)).then(toArrayBuffer)
const monoBoldData = readFile(new URL('./assets/JetBrainsMono-Bold.ttf', import.meta.url)).then(toArrayBuffer)

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
