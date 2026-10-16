import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { toggleTheme } from './uiSlice'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const theme = useAppSelector((state) => state.ui.theme)
  const dispatch = useAppDispatch()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => dispatch(toggleTheme())}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
