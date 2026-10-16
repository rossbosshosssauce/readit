import { useState } from 'react'
import SafeHtml from '../../components/SafeHtml'
import type { CommentNode } from '../../types/hn'
import { timeAgo } from '../../utils/format'
import styles from './CommentThread.module.css'

/** One comment plus its (collapsible) replies, rendered recursively. */
function Comment({ comment, depth }: { comment: CommentNode; depth: number }) {
  const [collapsed, setCollapsed] = useState(false)
  const replyCount = comment.replies.length

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
        <span className={styles.author}>{comment.by}</span>
        <span className={styles.dot}>·</span>
        <span>{timeAgo(comment.time)}</span>
        {collapsed && replyCount > 0 && (
          <span className={styles.hidden}>
            ({replyCount} {replyCount === 1 ? 'reply' : 'replies'} hidden)
          </span>
        )}
      </div>

      {!collapsed && (
        <>
          <SafeHtml className={styles.bodyText} html={comment.text} />
          {replyCount > 0 && depth < 8 && (
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
