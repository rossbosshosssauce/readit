import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  AlgoliaResponse,
  Category,
  CommentNode,
  HNComment,
  Story,
} from '../../types/hn'

const HN = 'https://hacker-news.firebaseio.com/v0'
const ALGOLIA = 'https://hn.algolia.com/api/v1'

const STORY_COUNT = 30 // stories per feed
const MAX_DEPTH = 6 // how deep to walk comment threads
const MAX_REPLIES = 60 // cap replies fetched per level to bound request fan-out

/** The HN list endpoint backing each category. */
const LIST_ENDPOINT: Record<Category, string> = {
  top: 'topstories',
  new: 'newstories',
  best: 'beststories',
  ask: 'askstories',
  show: 'showstories',
  job: 'jobstories',
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

/** Recursively fetch a comment tree, bounded by depth and breadth. */
async function fetchComments(ids: number[], depth: number): Promise<CommentNode[]> {
  if (ids.length === 0 || depth > MAX_DEPTH) return []

  const items = await Promise.all(
    ids.slice(0, MAX_REPLIES).map((id) =>
      fetchJson<HNComment>(`${HN}/item/${id}.json`).catch(() => null),
    ),
  )

  const live = items.filter(
    (item): item is HNComment => item !== null && !item.deleted && !item.dead,
  )

  return Promise.all(
    live.map(async (item) => ({
      id: item.id,
      by: item.by ?? '[deleted]',
      text: item.text ?? '',
      time: item.time,
      replies: await fetchComments(item.kids ?? [], depth + 1),
    })),
  )
}

export const hnApi = createApi({
  reducerPath: 'hnApi',
  // No single base URL — endpoints hit different hosts, so each supplies its
  // own queryFn and we skip fetchBaseQuery entirely.
  baseQuery: fakeBaseQuery<string>(),
  endpoints: (builder) => ({
    // A category feed: fetch the id list, then the first STORY_COUNT items.
    getStories: builder.query<Story[], Category>({
      async queryFn(category) {
        try {
          const ids = await fetchJson<number[]>(`${HN}/${LIST_ENDPOINT[category]}.json`)
          const stories = await Promise.all(
            ids.slice(0, STORY_COUNT).map((id) => fetchJson<Story>(`${HN}/item/${id}.json`)),
          )
          return { data: stories.filter(Boolean) }
        } catch (err) {
          return { error: String(err) }
        }
      },
    }),

    // Full-text search via the Algolia HN API, mapped into Story shape.
    searchStories: builder.query<Story[], string>({
      async queryFn(term) {
        try {
          const res = await fetchJson<AlgoliaResponse>(
            `${ALGOLIA}/search?query=${encodeURIComponent(term)}&tags=story&hitsPerPage=${STORY_COUNT}`,
          )
          const stories: Story[] = res.hits.map((hit) => ({
            id: Number(hit.objectID),
            by: hit.author,
            title: hit.title,
            url: hit.url ?? undefined,
            score: hit.points,
            descendants: hit.num_comments,
            time: hit.created_at_i,
            type: 'story',
          }))
          return { data: stories }
        } catch (err) {
          return { error: String(err) }
        }
      },
    }),

    // A single story plus its comment tree.
    getItem: builder.query<{ story: Story; comments: CommentNode[] }, number>({
      async queryFn(id) {
        try {
          const story = await fetchJson<Story>(`${HN}/item/${id}.json`)
          const comments = await fetchComments(story.kids ?? [], 0)
          return { data: { story, comments } }
        } catch (err) {
          return { error: String(err) }
        }
      },
    }),
  }),
})

export const { useGetStoriesQuery, useSearchStoriesQuery, useGetItemQuery } = hnApi
