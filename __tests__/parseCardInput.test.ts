import { describe, it, expect } from 'vitest'
import { parseCardInput } from '@/lib/og/parseCardInput'

describe('parseCardInput', () => {
  it('accepts a valid body', () => {
    const r = parseCardInput({
      username: 'fauzan', roast: 'savage line', photoDataUrl: 'data:image/jpeg;base64,abc',
      label: 'GOSONG', color: '#FF3B1F', serial: 'GSG-AB12',
    })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.username).toBe('fauzan')
  })

  it('rejects when username or roast missing', () => {
    expect(parseCardInput({ roast: 'x' }).ok).toBe(false)
    expect(parseCardInput({ username: 'x' }).ok).toBe(false)
  })

  it('rejects a non-data-url photo (no remote fetch in the renderer)', () => {
    const r = parseCardInput({
      username: 'a', roast: 'b', photoDataUrl: 'https://evil.example/x.png',
      label: 'GOSONG', color: '#fff', serial: 'GSG-0001',
    })
    expect(r.ok).toBe(true) // tolerated…
    if (r.ok) expect(r.value.photoDataUrl).toBeNull() // …but dropped to fallback avatar
  })

  it('clamps an overlong roast to 600 chars', () => {
    const r = parseCardInput({ username: 'a', roast: 'x'.repeat(700) })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.roast.length).toBe(600)
  })
})
