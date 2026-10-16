// Types for the parts of the Hacker News Firebase API and Algolia search API
// that this app uses. See https://github.com/HackerNews/API

/** The story lists HN exposes, used as the app's top-level navigation. */
export type Category = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job'

/** A story/job item from the Firebase API (and mapped from Algolia hits). */
export interface Story {
  id: number
  by: string
  title: string
  /** External link; absent for text posts like "Ask HN". */
  url?: string
  score: number
  /** Unix timestamp in seconds. */
  time: number
  /** Total comment count. */
  descendants?: number
  /** Top-level comment ids. */
  kids?: number[]
  /** HTML body for text posts (Ask HN etc.). */
  text?: string
  type: string
}

/** A raw comment item from the Firebase API. */
export interface HNComment {
  id: number
  by?: string
  text?: string
  time: number
  kids?: number[]
  deleted?: boolean
  dead?: boolean
  type: string
}

/** A comment flattened into a render-ready tree. */
export interface CommentNode {
  id: number
  by: string
  text: string
  time: number
  replies: CommentNode[]
}

/** Shape of the Algolia search response (only the fields we read). */
export interface AlgoliaResponse {
  hits: AlgoliaHit[]
}

export interface AlgoliaHit {
  objectID: string
  title: string
  url: string | null
  author: string
  points: number
  num_comments: number
  created_at_i: number
}
