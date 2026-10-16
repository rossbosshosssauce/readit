import { describe, expect, it } from 'vitest'
import reducer, {
  setSearchTerm,
  setSort,
  setSubreddit,
  toggleTheme,
} from './uiSlice'

const base = {
  theme: 'light' as const,
  subreddit: 'popular',
  searchTerm: '',
  sort: 'hot' as const,
  demoMode: false,
}

describe('uiSlice', () => {
  it('toggles the theme', () => {
    const next = reducer(base, toggleTheme())
    expect(next.theme).toBe('dark')
    expect(reducer(next, toggleTheme()).theme).toBe('light')
  })

  it('clears the search term when the subreddit changes', () => {
    const searched = reducer(base, setSearchTerm('cats'))
    expect(searched.searchTerm).toBe('cats')

    const switched = reducer(searched, setSubreddit('science'))
    expect(switched.subreddit).toBe('science')
    expect(switched.searchTerm).toBe('')
  })

  it('updates the sort option', () => {
    expect(reducer(base, setSort('top')).sort).toBe('top')
  })
})
