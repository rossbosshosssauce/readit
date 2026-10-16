/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import type { Connect, Plugin } from 'vite'
import { fetchRedditJson } from './server/redditClient.ts'

// Mounts the Reddit OAuth proxy at /api/reddit during `vite dev` and
// `vite preview`, so local development hits the same endpoint shape the
// deployed serverless function provides.
function redditProxyPlugin(clientId: string | undefined, userAgent: string): Plugin {
  const handler: Connect.SimpleHandleFunction = (req, res) => {
    const url = new URL(req.url ?? '', 'http://localhost')
    const path = url.searchParams.get('path')
    res.setHeader('Content-Type', 'application/json')

    if (!path) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Missing "path" query parameter' }))
      return
    }

    fetchRedditJson(path, { clientId, userAgent })
      .then((data) => res.end(JSON.stringify(data)))
      .catch((err: unknown) => {
        // 502 signals the client to fall back to demo data.
        res.statusCode = 502
        res.end(JSON.stringify({ error: String(err) }))
      })
  }

  return {
    name: 'reddit-oauth-proxy',
    configureServer(server) {
      server.middlewares.use('/api/reddit', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/reddit', handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load every env var (empty prefix), not just VITE_-prefixed ones, so the
  // server-side client ID stays out of the client bundle.
  const env = loadEnv(mode, process.cwd(), '')
  const userAgent = env.REDDIT_USER_AGENT || 'web:reddit-client:v1.0 (portfolio project)'

  return {
    plugins: [react(), redditProxyPlugin(env.REDDIT_CLIENT_ID, userAgent)],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  }
})
