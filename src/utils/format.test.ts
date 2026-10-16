import { describe, expect, it, vi } from 'vitest'
import { formatScore, timeAgo } from './format'

describe('formatScore', () => {
  it('leaves values under 1000 untouched', () => {
    expect(formatScore(0)).toBe('0')
    expect(formatScore(42)).toBe('42')
    expect(formatScore(999)).toBe('999')
  })

  it('compacts thousands with a "k" suffix', () => {
    expect(formatScore(1000)).toBe('1k')
    expect(formatScore(12_345)).toBe('12.3k')
    expect(formatScore(2_500)).toBe('2.5k')
  })
})

describe('timeAgo', () => {
  it('describes recent and older timestamps', () => {
    const now = 1_700_000_000_000 // fixed "now" in ms
    vi.spyOn(Date, 'now').mockReturnValue(now)
    const nowSec = now / 1000

    expect(timeAgo(nowSec - 30)).toBe('just now')
    expect(timeAgo(nowSec - 120)).toBe('2m ago')
    expect(timeAgo(nowSec - 7200)).toBe('2h ago')
    expect(timeAgo(nowSec - 172_800)).toBe('2d ago')

    vi.restoreAllMocks()
  })
})
