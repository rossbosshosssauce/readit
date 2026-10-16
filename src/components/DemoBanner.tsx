import { useAppSelector } from '../app/hooks'
import styles from './DemoBanner.module.css'

/** A dismissable-free notice shown whenever the app is on bundled demo data. */
export default function DemoBanner() {
  const demoMode = useAppSelector((state) => state.ui.demoMode)
  if (!demoMode) return null

  return (
    <div className={styles.banner} role="status">
      ⚠️ Showing <strong>demo data</strong> — Reddit requires API credentials for
      live posts. See the{' '}
      <a
        href="https://github.com/rossbosshosssauce/reddit-client#live-data"
        target="_blank"
        rel="noreferrer"
      >
        README
      </a>{' '}
      to enable them.
    </div>
  )
}
