import { useState } from 'react'
import type { CommentNode } from '../posts/redditApi'
import { formatScore, timeAgo } from '../../utils/format'
import styles from './CommentThread.module.css'

/** One comment plus its (collapsible) replies, rendered recursively. */
function Comment({ comment, depth }: { comment: CommentNode; depth: number }) {
  const [collapsed, setCollapsed] = useState(false)
  const hasReplies = comment.replies.length > 0

  return (
    <li className={styles.comment}>
      <div className={styles.meta}>
        <button
          type="button"
          className={styles.collapse}
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand comment' : 'Collapse comment'}
        >
          {collapsed ? '[+]' : '[–]'}
        </button>
        <span className={styles.author}>u/{comment.author}</span>
        <span className={styles.dot}>·</span>
        <span>{formatScore(comment.score)} pts</span>
        <span className={styles.dot}>·</span>
        <span>{timeAgo(comment.created_utc)}</span>
      </div>

      {!collapsed && (
        <>
          <p className={styles.bodyText}>{comment.body}</p>
          {hasReplies && depth < 6 && (
            <ul className={styles.replies}>
              {comment.replies.map((reply) => (
                <Comment key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  )
}

export default function CommentThread({ comments }: { comments: CommentNode[] }) {
  if (comments.length === 0) {
    return <p className={styles.none}>No comments yet.</p>
  }

  return (
    <ul className={styles.thread}>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} depth={0} />
      ))}
    </ul>
  )
}
