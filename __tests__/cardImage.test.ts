import { describe, it, expect } from 'vitest'
import { getRoastTextStyle } from '@/lib/og/CardImage'

describe('getRoastTextStyle', () => {
  it('keeps short roasts large', () => {
    expect(getRoastTextStyle('Satu. Dua.').fontSize).toBe(40)
  })

  it('shrinks long multiline roasts so they fit the export card', () => {
    const longRoast = 'Kalimat panjang banget buat ngetes kartu export yang biasanya kepotong. '.repeat(8)
    const style = getRoastTextStyle(longRoast)

    expect(style.fontSize).toBeLessThan(40)
    expect(style.lineHeight).toBeLessThanOrEqual(1.35)
  })
})
