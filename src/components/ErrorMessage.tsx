import styles from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

/** A friendly, accessible error panel with an optional retry action. */
export default function ErrorMessage({
  message = 'Something went wrong while loading data.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className={styles.wrap} role="alert">
      <p className={styles.text}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.button} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
