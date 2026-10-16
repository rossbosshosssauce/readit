import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ItemPage from './pages/ItemPage'

export default function App() {
  const theme = useAppSelector((state) => state.ui.theme)

  // Reflect the current theme onto <html> so the CSS variables switch.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:id" element={<ItemPage />} />
      </Route>
    </Routes>
  )
}
