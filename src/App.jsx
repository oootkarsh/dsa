import { HashRouter, Routes, Route } from 'react-router-dom'
import { ProgressProvider } from './context/ProgressContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import TopicPage from './pages/TopicPage'
import Cheatsheet from './pages/Cheatsheet'
import Resources from './pages/Resources'

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/topic/:topicId" element={<TopicPage />} />
              <Route path="/cheatsheet" element={<Cheatsheet />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </HashRouter>
      </ProgressProvider>
    </ThemeProvider>
  )
}
