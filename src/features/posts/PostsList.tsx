import type { RedditPost } from '../../types/reddit'
import PostCard from './PostCard'
import styles from './PostsList.module.css'

export default function PostsList({ posts }: { posts: RedditPost[] }) {
  if (posts.length === 0) {
    return (
      <p className={styles.empty}>
        No posts found. Try a different community or search term.
      </p>
    )
  }

  return (
    <section className={styles.list} aria-label="Posts">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  )
}
