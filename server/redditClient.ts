// Node-side Reddit client. Reddit blocks anonymous requests to its public
// JSON endpoints, but its OAuth API stays open to registered apps. This module
// fetches an app-only ("installed client") bearer token — which needs only a
// public client ID, no secret — caches it until it expires, and uses it to
// proxy read-only requests to https://oauth.reddit.com.
//
// It runs on a server (the Vite dev middleware or the deployed function),
// never in the browser, so the token is never exposed to the client.

const TOKEN_URL = 'https://www.reddit.com/api/v1/access_token'
const API_BASE = 'https://oauth.reddit.com'
const DEFAULT_UA = 'web:reddit-client:v1.0 (portfolio project)'

interface CachedToken {
  value: string
  expiresAt: number
}

let cached: CachedToken | null = null

/** Fetch (or reuse) an app-only access token for the given client ID. */
async function getAccessToken(clientId: string, userAgent: string): Promise<string> {
  // Reuse the cached token until a minute before it expires.
  if (cached && Date.now() < cached.expiresAt - 60_000) {
    return cached.value
  }

  const body = new URLSearchParams({
    grant_type: 'https://oauth.reddit.com/grants/installed_client',
    // Reddit's documented sentinel for "don't track a device".
    device_id: 'DO_NOT_TRACK_THIS_DEVICE',
  })

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      // Installed apps authenticate with the client ID as the username and an
      // empty password.
      Authorization: `Basic ${Buffer.from(`${clientId}:`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': userAgent,
    },
    body,
  })

  if (!res.ok) {
    throw new Error(`Reddit token request failed: ${res.status}`)
  }

  const json = (await res.json()) as { access_token: string; expires_in: number }
  cached = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  }
  return cached.value
}

export interface RedditProxyConfig {
  clientId: string | undefined
  userAgent?: string
}

/**
 * Proxy a single read-only request to the Reddit OAuth API.
 * `path` is a Reddit API path such as "r/popular/hot?limit=25&raw_json=1".
 * Returns the parsed JSON, or throws if credentials are missing or the
 * upstream request fails (the caller then decides whether to fall back).
 */
export async function fetchRedditJson(
  path: string,
  { clientId, userAgent = DEFAULT_UA }: RedditProxyConfig,
): Promise<unknown> {
  if (!clientId) {
    throw new Error('REDDIT_CLIENT_ID is not configured')
  }

  const token = await getAccessToken(clientId, userAgent)
  const url = `${API_BASE}/${path.replace(/^\/+/, '')}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': userAgent,
    },
  })

  if (!res.ok) {
    throw new Error(`Reddit API request failed: ${res.status}`)
  }

  return res.json()
}
