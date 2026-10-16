# readit

A fast, accessible **Hacker News** reader built with **React, TypeScript, and Redux Toolkit (RTK Query)** — *read it* before you reddit.

> **Live demo:** _add your deployed URL here after following [Deployment](#deployment)._

![Light and dark mode screenshots go here](docs/screenshot.png)

---

## About this project

This started as the Codecademy "Build Your Own Reddit Client" project. Partway through, Reddit **closed off its public API** — anonymous `*.json` requests now return `403`, and self-service API app creation was gated behind an approval process in late 2025. Rather than ship something that couldn't fetch live data, I **repointed the same app at the Hacker News API**, which is free, open, keyless, and CORS-friendly. The React/Redux architecture is identical; only the data layer changed.

## Features

- **Browse** Top / New / Best / Ask HN / Show HN / Jobs feeds.
- **Full-text search** across Hacker News (via the Algolia HN API), with the input **debounced**.
- **Story detail view** with the full, **recursively rendered** comment thread — each comment collapsible.
- **Light / dark theme** that follows your OS preference and remembers your choice.
- **Skeleton loaders** while data is in flight and an **error state with retry**.
- **Responsive** layout and real **accessibility**: keyboard navigation, visible focus rings, ARIA roles, and `prefers-reduced-motion` support.
- HN serves comment bodies as HTML, which is **sanitized with DOMPurify** before rendering.

## Tech stack

| Concern | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| State | Redux Toolkit |
| Data fetching / caching | RTK Query (`queryFn` endpoints) |
| Routing | React Router |
| Styling | CSS Modules + CSS custom properties |
| HTML sanitizing | DOMPurify |
| Build | Vite |
| Tests | Vitest + Testing Library + MSW |

## Architecture

State is split by **who owns the data**:

```
store
├── hnApi   RTK Query — all server data (feeds, search, items + comments), auto‑cached
└── ui      plain slice — theme, current category, search term
```

Server data lives in RTK Query; only genuine UI state lives in a normal slice.

Each Hacker News view needs more than one request — a feed is an **ID list followed by an item fetch per story**, and a thread is a **recursive walk** of nested comment ids. That orchestration lives in RTK Query **`queryFn`** endpoints (`src/features/stories/hnApi.ts`), so components still just call a hook and get `isLoading` / `isError` / `data`. The HN API sends permissive CORS headers, so the browser calls it directly — **no proxy or API key required**.

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
```

No environment variables or keys needed.

## Testing

```bash
npm run test       # watch mode
npm run test:run   # single run
```

Tests mock the HN Firebase and Algolia endpoints with **MSW**, so they never hit the network and cover loading, success, and error paths.

## Deployment

It's a pure static site — deploy the `dist/` output anywhere (Vercel, Netlify, GitHub Pages):

```bash
npm i -g vercel
vercel            # follow the prompts
```

`vercel.json` routes client-side paths back to `index.html` so deep links like `/item/123` work on refresh.

## What I learned

- Structuring async server state with **RTK Query** instead of hand-rolled thunks.
- Orchestrating **dependent, fan-out requests** (ID lists → items, recursive comment trees) inside `queryFn`.
- Modeling **deeply nested, recursive data** in TypeScript and the UI.
- **Sanitizing third-party HTML** before rendering it.
- Adapting an app's data layer when an upstream API **changes the rules** mid-project.

---

Built as a portfolio project for the Codecademy Full-Stack path.
