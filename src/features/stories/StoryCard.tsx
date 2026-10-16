import { Link } from 'react-router-dom'
import type { Story } from '../../types/hn'
import { domainOf, formatScore, timeAgo } from '../../utils/format'
import styles from './StoryCard.module.css'

export default function StoryCard({ story }: { story: Story }) {
  const domain = domainOf(story.url)
  const commentCount = story.descendants ?? 0

  return (
    <article className={styles.card}>
      <div className={styles.score} aria-label={`${story.score} points`}>
        <span aria-hidden="true">▲</span>
        <span>{formatScore(story.score)}</span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>
          {/* External link if the story points off-site; otherwise the discussion. */}
          {story.url ? (
            <a href={story.url} target="_blank" rel="noreferrer">
              {story.title}
            </a>
          ) : (
            <Link to={`/item/${story.id}`}>{story.title}</Link>
          )}
          {domain && <span className={styles.domain}> ({domain})</span>}
        </h2>

        <p className={styles.meta}>
          <span>by {story.by}</span>
          <span> · {timeAgo(story.time)}</span>
          <span> · </span>
          <Link to={`/item/${story.id}`} className={styles.comments}>
            💬 {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </Link>
        </p>
      </div>
    </article>
  )
}
