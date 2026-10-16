import { configureStore } from '@reduxjs/toolkit'
import { hnApi } from '../features/stories/hnApi'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    [hnApi.reducerPath]: hnApi.reducer,
    ui: uiReducer,
  },
  // RTK Query needs its middleware for caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(hnApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
