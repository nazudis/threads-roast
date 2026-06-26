import { describe, it, expect } from 'vitest'
import { getCardMeta } from '@/lib/cardMeta'

describe('getCardMeta', () => {
  it('is deterministic for the same input', () => {
    const a = getCardMeta('fauzan', 'roast text here')
    const b = getCardMeta('fauzan', 'roast text here')
    expect(a).toEqual(b)
  })

  it('produces a score in [0,100] and a known tier label', () => {
    const m = getCardMeta('fauzan', 'anything')
    expect(m.score).toBeGreaterThanOrEqual(0)
    expect(m.score).toBeLessThanOrEqual(100)
    expect(['SETENGAH MATANG', 'MEDIUM WELL', 'WELL DONE', 'GOSONG']).toContain(m.label)
  })

  it('emits a serial of the form GSG-XXXX', () => {
    expect(getCardMeta('fauzan', 'x').serial).toMatch(/^GSG-[0-9A-Z]{4,}$/)
  })

  it('different inputs generally differ', () => {
    expect(getCardMeta('a', 'one').serial).not.toBe(getCardMeta('b', 'two').serial)
  })
})
