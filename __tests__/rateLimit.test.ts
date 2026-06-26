import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { rateLimit, __resetRateLimitStore } from '@/lib/rateLimit'

describe('rateLimit', () => {
  beforeEach(() => {
    __resetRateLimitStore()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-26T00:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it('allows up to the limit then blocks', () => {
    const opts = { limit: 3, windowMs: 1000 }
    expect(rateLimit('ip-1', opts).allowed).toBe(true)
    expect(rateLimit('ip-1', opts).allowed).toBe(true)
    expect(rateLimit('ip-1', opts).allowed).toBe(true)
    const blocked = rateLimit('ip-1', opts)
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('tracks keys independently', () => {
    const opts = { limit: 1, windowMs: 1000 }
    expect(rateLimit('a', opts).allowed).toBe(true)
    expect(rateLimit('b', opts).allowed).toBe(true)
    expect(rateLimit('a', opts).allowed).toBe(false)
  })

  it('resets after the window elapses', () => {
    const opts = { limit: 1, windowMs: 1000 }
    expect(rateLimit('ip-1', opts).allowed).toBe(true)
    expect(rateLimit('ip-1', opts).allowed).toBe(false)
    vi.advanceTimersByTime(1001)
    expect(rateLimit('ip-1', opts).allowed).toBe(true)
  })
})
