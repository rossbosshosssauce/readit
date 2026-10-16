/** Compact a score like 12345 into "12.3k". */
export function formatScore(score: number): string {
  if (Math.abs(score) < 1000) return String(score)
  return `${(score / 1000).toFixed(1).replace(/\.0$/, '')}k`
}

/** Extract a bare hostname (no "www.") from a URL, or undefined if invalid. */
export function domainOf(url: string | undefined): string | undefined {
  if (!url) return undefined
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return undefined
  }
}

/** Turn a Unix (seconds) timestamp into a short "x ago" string. */
export function timeAgo(createdUtc: number): string {
  const seconds = Math.floor(Date.now() / 1000 - createdUtc)
  const units: Array<[string, number]> = [
    ['y', 31_536_000],
    ['mo', 2_592_000],
    ['d', 86_400],
    ['h', 3_600],
    ['m', 60],
  ]
  for (const [label, size] of units) {
    const value = Math.floor(seconds / size)
    if (value >= 1) return `${value}${label} ago`
  }
  return 'just now'
}
