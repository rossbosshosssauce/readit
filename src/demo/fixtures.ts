// Bundled demo data used when the Reddit proxy is unavailable (no client ID
// configured, upstream error, etc.). It mirrors the real API's shape so the
// rest of the app treats it identically. Clearly surfaced to the user via the
// demo banner — this is not live data.
import type {
  CommentChild,
  CommentsResponse,
  PostsResponse,
  RedditComment,
  RedditPost,
} from '../types/reddit'

const NOW = Math.floor(Date.now() / 1000)

function post(overrides: Partial<RedditPost> & Pick<RedditPost, 'id' | 'title'>): RedditPost {
  return {
    author: 'demo_user',
    subreddit: 'popular',
    subreddit_name_prefixed: 'r/popular',
    score: 1234,
    num_comments: 42,
    created_utc: NOW - 3600,
    permalink: `/r/popular/comments/${overrides.id}/demo/`,
    url: 'https://example.com',
    selftext: '',
    is_self: false,
    over_18: false,
    stickied: false,
    thumbnail: 'self',
    ...overrides,
  }
}

const DEMO_POSTS: RedditPost[] = [
  post({
    id: 'demo1',
    title: 'TIL you can browse this app without any API keys — this is demo data',
    subreddit: 'todayilearned',
    subreddit_name_prefixed: 'r/todayilearned',
    author: 'curious_dev',
    score: 15400,
    num_comments: 320,
    is_self: true,
    selftext:
      "Reddit now requires OAuth for its API, so this portfolio app falls back to bundled sample data when no credentials are set. Add a client ID (see the README) to see live posts.",
    created_utc: NOW - 1800,
  }),
  post({
    id: 'demo2',
    title: 'A quiet morning lake, long exposure [OC]',
    subreddit: 'EarthPorn',
    subreddit_name_prefixed: 'r/EarthPorn',
    author: 'shutter_sally',
    score: 28900,
    num_comments: 540,
    created_utc: NOW - 7200,
    url: 'https://picsum.photos/id/1016/1200/800',
    preview: {
      images: [{ source: { url: 'https://picsum.photos/id/1016/1200/800', width: 1200, height: 800 } }],
    },
  }),
  post({
    id: 'demo3',
    title: 'React 19 is out — what are your favorite new features?',
    subreddit: 'reactjs',
    subreddit_name_prefixed: 'r/reactjs',
    author: 'hook_enthusiast',
    score: 4200,
    num_comments: 198,
    is_self: true,
    selftext: 'The new use() hook and Actions are game changers. Curious what everyone else likes.',
    created_utc: NOW - 10_800,
  }),
  post({
    id: 'demo4',
    title: 'Homemade sourdough after 2 years of practice',
    subreddit: 'food',
    subreddit_name_prefixed: 'r/food',
    author: 'bread_wizard',
    score: 67000,
    num_comments: 890,
    created_utc: NOW - 14_400,
    url: 'https://picsum.photos/id/292/1200/800',
    preview: {
      images: [{ source: { url: 'https://picsum.photos/id/292/1200/800', width: 1200, height: 800 } }],
    },
  }),
  post({
    id: 'demo5',
    title: 'New telescope image reveals thousands of previously unseen galaxies',
    subreddit: 'science',
    subreddit_name_prefixed: 'r/science',
    author: 'astro_nerd',
    score: 51200,
    num_comments: 1120,
    created_utc: NOW - 21_600,
    url: 'https://picsum.photos/id/1002/1200/800',
    preview: {
      images: [{ source: { url: 'https://picsum.photos/id/1002/1200/800', width: 1200, height: 800 } }],
    },
  }),
  post({
    id: 'demo6',
    title: 'What underrated game deserves way more attention?',
    subreddit: 'gaming',
    subreddit_name_prefixed: 'r/gaming',
    author: 'pixel_pusher',
    score: 8800,
    num_comments: 2300,
    is_self: true,
    selftext: 'Mine is Outer Wilds. The sense of discovery is unmatched.',
    created_utc: NOW - 28_800,
  }),
]

function comment(
  id: string,
  author: string,
  body: string,
  score: number,
  replies: CommentChild[] = [],
): CommentChild {
  const data: RedditComment = {
    id,
    author,
    body,
    score,
    created_utc: NOW - 1200,
    replies: replies.length
      ? { kind: 'Listing', data: { after: null, before: null, children: replies } }
      : '',
  }
  return { kind: 't1', data }
}

const DEMO_COMMENTS: CommentChild[] = [
  comment('c1', 'top_commenter', 'This is sample comment data shown in demo mode.', 320, [
    comment('c2', 'replier_one', 'Nested replies render recursively — try collapsing me!', 88, [
      comment('c3', 'deep_thinker', 'Threads can go several levels deep.', 21),
    ]),
    comment('c4', 'replier_two', 'Add a Reddit client ID to see real comments.', 45),
  ]),
  comment('c5', 'another_user', 'The score and "time ago" formatting are real utilities though.', 130),
]

/** Pick the right demo payload for a given Reddit API path. */
export function getDemoResponse(path: string): PostsResponse | CommentsResponse | null {
  const clean = path.replace(/^\/+/, '')

  if (clean.startsWith('comments/')) {
    const demoPost = DEMO_POSTS[0]
    const postListing: PostsResponse = {
      kind: 'Listing',
      data: { after: null, before: null, children: [{ kind: 't3', data: demoPost }] },
    }
    const commentListing = {
      kind: 'Listing' as const,
      data: { after: null, before: null, children: DEMO_COMMENTS },
    }
    return [postListing, commentListing]
  }

  // Any feed or search request gets the sample feed.
  return {
    kind: 'Listing',
    data: { after: null, before: null, children: DEMO_POSTS.map((data) => ({ kind: 't3', data })) },
  }
}
