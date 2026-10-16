import { Link } from 'react-router-dom'
import type { RedditPost } from '../../types/reddit'
import { formatScore, timeAgo } from '../../utils/format'
import styles from './PostCard.module.css'

/** Reddit HTML-encodes preview URLs (&amp;); decode for use in <img src>. */
function previewUrl(post: RedditPost): string | undefined {
  const raw = post.preview?.images[0]?.source.url
  return raw?.replace(/&amp;/g, '&')
}

export default function PostCard({ post }: { post: RedditPost }) {
  const image = previewUrl(post)

  return (
    <article className={styles.card}>
      <div className={styles.score} aria-label={`${post.score} points`}>
        <span aria-hidden="true">▲</span>
        <span>{formatScore(post.score)}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.meta}>
          <span className={styles.sub}>{post.subreddit_name_prefixed}</span>
          <span> · u/{post.author}</span>
          <span> · {timeAgo(post.created_utc)}</span>
        </p>

        <h2 className={styles.title}>
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h2>

        {image && !post.over_18 && (
          <Link to={`/post/${post.id}`} className={styles.thumbWrap} tabIndex={-1}>
            <img className={styles.thumb} src={image} alt="" loading="lazy" />
          </Link>
        )}

        <div className={styles.actions}>
          <Link to={`/post/${post.id}`} className={styles.comments}>
            💬 {post.num_comments} comments
          </Link>
          <a
            href={`https://www.reddit.com${post.permalink}`}
            target="_blank"
            rel="noreferrer"
            className={styles.external}
          >
            ↗ Open on Reddit
          </a>
        </div>
      </div>
    </article>
  )
}
