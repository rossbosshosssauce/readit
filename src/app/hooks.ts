import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// Typed versions of the React-Redux hooks. Use these throughout the app so
// you get autocomplete on state and dispatch without annotating every call.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
