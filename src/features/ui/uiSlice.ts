import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { SortOption } from '../posts/redditApi'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'reddit-client-theme'

/** Read the saved theme, falling back to the OS preference. Never throws. */
function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage can be unavailable (private mode, blocked cookies) — ignore.
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

interface UiState {
  theme: Theme
  subreddit: string
  searchTerm: string
  sort: SortOption
  /** True when the app is serving bundled demo data instead of live Reddit. */
  demoMode: boolean
}

const initialState: UiState = {
  theme: loadTheme(),
  subreddit: 'popular',
  searchTerm: '',
  sort: 'hot',
  demoMode: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem(THEME_KEY, state.theme)
      } catch {
        // Persisting is best-effort; the toggle still works for this session.
      }
    },
    setSubreddit(state, action: PayloadAction<string>) {
      state.subreddit = action.payload
      state.searchTerm = '' // switching communities clears the active search
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload
    },
    setDemoMode(state, action: PayloadAction<boolean>) {
      state.demoMode = action.payload
    },
  },
})

export const { toggleTheme, setSubreddit, setSearchTerm, setSort, setDemoMode } =
  uiSlice.actions
export default uiSlice.reducer
