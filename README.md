# reddit‑client

A fast, accessible Reddit client built with **React, TypeScript, and Redux Toolkit (RTK Query)**. Browse popular communities, search, open a post, and read its full nested comment thread — in light or dark mode.

> **Live demo:** _add your deployed URL here after following [Deployment](#deployment)._

![Light and dark mode screenshots go here](docs/screenshot.png)

---

## Features

- **Browse feeds** from a set of popular communities, with **hot / new / top** sorting.
- **Search** within a community (or across Reddit), with the input **debounced** so it doesn't fire a request per keystroke.
- **Post detail view** with the full, **recursively rendered** comment tree — each comment collapsible.
- **Light / dark theme** that follows your OS preference and remembers your choice.
- **Skeleton loaders** while data is in flight and an **error state with retry**.
- **Responsive** layout and real **accessibility**: keyboard navigation, visible focus rings, ARIA roles, and `prefers-reduced-motion` support.
- **Demo‑data fallback** so the app always works, even without API credentials.

## Tech stack

| Concern | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| State | Redux Toolkit |
| Data fetching / caching | RTK Query |
| Routing | React Router |
| Styling | CSS Modules + CSS custom properties |
| Build | Vite |
| Tests | Vitest + Testing Library + MSW |
| Proxy / deploy | Serverless function (Vercel) |

## Architecture

State is split by **who owns the data**:

```
store
├── redditApi   RTK Query — all server data (posts, search, comments), auto‑cached
└── ui          plain slice — theme, current subreddit, search term, sort, demo mode
```

Server data lives in RTK Query (no hand‑written thunks or loading booleans); only genuine UI state lives in a normal slice.

### Why there's a proxy

Reddit no longer allows anonymous requests to its public `*.json` endpoints — they return **403**. Its **OAuth API** is still open to registered apps, but a browser can't call it directly (no CORS, and the token shouldn't live in client code). So a tiny server sits in between:

```
browser ──/api/reddit?path=…──▶  proxy  ──OAuth token──▶  oauth.reddit.com
                                   │
                                   └── on failure the client falls back to bundled demo data
```

The same proxy logic (`server/redditClient.ts`) runs two ways:

- **Locally** as Vite dev/preview middleware (`vite.config.ts`).
- **In production** as a serverless function (`api/reddit.ts`).

## Live data

The app runs in **demo‑data mode** out of the box. To show live Reddit data, give it a free Reddit **client ID**:

1. Go to <https://www.reddit.com/prefs/apps>.
2. Click **create another app…**.
3. Choose type **installed app**.
4. Name it anything; set **redirect uri** to `http://localhost:5173` (required but unused).
5. Create it — the **client ID** is the string shown just under the app name.
6. Copy `.env.example` to `.env` and set `REDDIT_CLIENT_ID=<your id>`.
7. Restart the dev server.

The client ID for an installed app isn't a secret, but it's kept out of the repo anyway.

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Testing

```bash
npm run test       # watch mode
npm run test:run   # single run
```

Tests mock the network at the `/api/reddit` boundary with **MSW**, so they never hit Reddit and cover loading, success, and the demo‑fallback paths.

## Deployment

Deploys to **Vercel** as a static site plus one serverless function:

```bash
npm i -g vercel
vercel            # follow the prompts
```

Then set the `REDDIT_CLIENT_ID` (and optional `REDDIT_USER_AGENT`) environment variables in the Vercel project settings and redeploy. `vercel.json` already routes client‑side paths to `index.html` and leaves `/api/*` to the function.

> Netlify works too — move `api/reddit.ts` to `netlify/functions/` and add a redirect from `/api/reddit`; the shared `server/redditClient.ts` logic is unchanged.

## What I learned

- Structuring async server state with **RTK Query** instead of hand‑rolled thunks.
- Modeling **deeply nested, recursive data** (comment trees) in TypeScript and the UI.
- Working around a **real‑world API restriction** with an OAuth proxy and a graceful fallback.
- Testing a data‑driven app by mocking at the network boundary.

---

Built as a portfolio project for the Codecademy Full‑Stack path.
