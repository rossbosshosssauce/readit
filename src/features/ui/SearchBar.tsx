import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setSearchTerm } from './uiSlice'
import styles from './SearchBar.module.css'

const DEBOUNCE_MS = 350

export default function SearchBar() {
  const dispatch = useAppDispatch()
  const subreddit = useAppSelector((state) => state.ui.subreddit)
  const [value, setValue] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Clear the input when the user switches communities.
  useEffect(() => {
    setValue('')
  }, [subreddit])

  // Debounce: only push the term to the store once typing pauses.
  function handleChange(next: string) {
    setValue(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      dispatch(setSearchTerm(next.trim()))
    }, DEBOUNCE_MS)
  }

  // Flush any pending debounce if the component unmounts.
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <form className={styles.form} role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="post-search" className="sr-only">
        Search posts in {subreddit === 'popular' ? 'all of Reddit' : `r/${subreddit}`}
      </label>
      <span className={styles.icon} aria-hidden="true">
        🔍
      </span>
      <input
        id="post-search"
        type="search"
        className={styles.input}
        placeholder={`Search ${subreddit === 'popular' ? 'Reddit' : `r/${subreddit}`}…`}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        autoComplete="off"
      />
    </form>
  )
}
