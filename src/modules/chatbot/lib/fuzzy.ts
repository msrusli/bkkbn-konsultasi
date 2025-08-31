export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const levenshtein = (a: string, b: string) => {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

const jaccard = (a: string, b: string) => {
  const A = new Set(a.split(' ').filter(Boolean))
  const B = new Set(b.split(' ').filter(Boolean))
  const inter = new Set([...A].filter(x => B.has(x))).size
  const union = new Set([...A, ...B]).size
  return union === 0 ? 0 : inter / union
}

export const similarity = (q: string, t: string) => {
  const a = normalize(q), b = normalize(t)
  const maxLen = Math.max(a.length, b.length) || 1
  const lev = 1 - levenshtein(a, b) / maxLen
  const jac = jaccard(a, b)
  return (lev * 0.6) + (jac * 0.4)
}

export interface Candidate<T> { item: T; score: number }

export function bestMatch<T extends { question: string }>(query: string, list: T[], threshold = 0.5): Candidate<T> | null {
  let best: Candidate<T> | null = null
  for (const item of list) {
    const score = similarity(query, item.question)
    if (!best || score > best.score) best = { item, score }
  }
  return best && best.score >= threshold ? best : null
}
