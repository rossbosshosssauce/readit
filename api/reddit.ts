// Serverless function (Vercel/Netlify Node runtime) that proxies read-only
// requests to the Reddit OAuth API. The browser calls /api/reddit?path=...;
// this attaches the app-only token server-side and returns the JSON.
//
// Configure REDDIT_CLIENT_ID (and optionally REDDIT_USER_AGENT) as environment
// variables in your deployment. Without them the function returns 502 and the
// client falls back to bundled demo data.
import { fetchRedditJson } from '../server/redditClient'

interface ApiRequest {
  query: Record<string, string | string[] | undefined>
}

interface ApiResponse {
  setHeader(key: string, value: string): void
  status(code: number): ApiResponse
  end(body: string): void
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  const raw = req.query.path
  const path = Array.isArray(raw) ? raw[0] : raw

  res.setHeader('Content-Type', 'application/json')
  // Let the CDN cache feeds briefly to ease Reddit's rate limits.
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')

  if (!path) {
    res.status(400).end(JSON.stringify({ error: 'Missing "path" query parameter' }))
    return
  }

  try {
    const data = await fetchRedditJson(path, {
      clientId: process.env.REDDIT_CLIENT_ID,
      userAgent: process.env.REDDIT_USER_AGENT,
    })
    res.status(200).end(JSON.stringify(data))
  } catch (err) {
    res.status(502).end(JSON.stringify({ error: String(err) }))
  }
}
