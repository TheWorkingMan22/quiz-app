import { Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import Setup from './pages/Setup'
import Quiz from './pages/Quiz'
import Stats from './pages/Stats'

export default function App() {
  return (
    <>
      <AppNavbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Setup />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
    </>
  )
}
