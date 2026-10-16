import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import type { Category } from '../../types/hn'
import { setCategory } from './uiSlice'
import styles from './CategoryNav.module.css'

const CATEGORIES: Array<{ id: Category; label: string }> = [
  { id: 'top', label: 'Top' },
  { id: 'new', label: 'New' },
  { id: 'best', label: 'Best' },
  { id: 'ask', label: 'Ask HN' },
  { id: 'show', label: 'Show HN' },
  { id: 'job', label: 'Jobs' },
]

export default function CategoryNav() {
  const current = useAppSelector((state) => state.ui.category)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function choose(id: Category) {
    dispatch(setCategory(id))
    navigate('/') // always return to the feed when switching categories
  }

  return (
    <nav className={styles.nav} aria-label="Story categories">
      <ul className={styles.list}>
        {CATEGORIES.map(({ id, label }) => (
          <li key={id}>
            <button
              type="button"
              className={styles.chip}
              aria-current={current === id ? 'page' : undefined}
              data-active={current === id}
              onClick={() => choose(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
